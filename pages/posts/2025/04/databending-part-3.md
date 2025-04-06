---
title: Databending Part 3 — Glitching MP3s with Python
description: I'm continuing my databending series. Today we'll discuss how to use Python to easily glitch up MP3s, adding warbles, clicks, and other cool noise!
canonical_url: https://reillyspitzfaden.com/posts/2025/04/databending-part-3/
fedi_url:
og_image: 
og_image_width: 
og_image_height: 
date: 2025-04-06T00:00:00-0500
octothorpes:
  - Audio
  - music
tags:
  - post
  - databending 
  - mp3 
  - music 
  - sounddesign
post_series: databending
---

In the [previous post](/posts/2025/02/databending-part-2/) in this series, I wrote about how to glitch up an MP3 file in a hex editor, while still leaving it playable. Since this process is incredibly slow and tedious to do by hand I mentioned wanting to automate this in Python. This week I've figured out how to do just that, and I'll walk through how it works.

### Recap
I previously described how an MP3 chops an audio file into short “frames” and analyzes the frequencies present in those frames. The file is structured with a “header” consiting of 8 [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) digits, some further information about the file, and then the list of frames, each prefixed by its own header. 

When glitching the file, the important thing is to leave the headers as well as the data before the list of frames alone, and to only change the data in the frames. My Python code loads the file as binary data, converts it to a hexadecimal string, finds the headers, and then makes random changes to data within the frames, using the headers as a reference for where the frames are located. Let's walk through how the code does this.

### Code Walkthrough

The full code is available online [here](https://github.com/reillypascal/mp3glitch) under the MIT license — please feel free to use and adapt it!

To use the code, you can run this line from the code folder: `python3 mp3glitch.py <input_file_name> <output_file_name>`. The first argument, `<input_file_name>` is assigned to `args.input` below, and the `'rb'` argument to `open()` means “read as binary data.” The [`.hex()` method](https://docs.python.org/3/library/functions.html#hex) then converts that binary data to a hexadecimal string.

```python
with open(args.input, 'rb') as input_file:
    hexdata = input_file.read().hex()
```

This next block takes the hexadecimal data (currently formatted as a string) looks for the substring “fff,” which is the beginning of the header in almost all MP3s. I use the `.find()` string method to get the index for the first occurrence of that substring; store that index in the array `header_start_indices`; and start the search again 8 indices later in the hex data (because the headers are 8 hex digits long). Using this array of indices, I create an array of the opening metadata followed by each frame. 

```python
header_start_indices = []
header_start_index = 0
while hexdata.find("fff", header_start_index) >= 0:
    header_start_index = hexdata.find("fff", header_start_index)
    if header_start_index >= 0:
        header_start_indices.append(header_start_index)
    header_start_index += 8

frames = [hexdata[header_start_indices[i]:header_start_indices[i+1]] for i in range(len(header_start_indices)-1)]
```

With my hex data broken up into an array of frames, I iterate through the array, and inside that loop I iterate through each character in the frame. If the frame number is greater than 0 (to leave the opening metadata alone) and the index within the frame is greater than or equal to 8 (to leave the frame header alone), I have the frame data, which is available to glitch.

I have some additional conditions for glitching. The `num_glitches_this_frame` variable (if set) limits the number of glitches in a frame; the `glitch_width` variable indicates how many digits in a row to randomly change; the `glitch_prob` variable indicates the probability that a given `glitch_width`-long string should be replaced; and the `frame_min` and `frame_max` variables constrain glitches to a certain stretch along the length of a frame. Since (as far as I understand) the frequencies are distributed along the frame with the lower ones at the beginning and the high ones at the end, this gives a frequency range for the glitches.

```python
hex_digits = '0123456789abcdef'
# strings are immutable, so need a new array
output_hex = []

# variables defined outside test block
num_glitches_this_frame = 0
testval = 0
frame_counter = 0
frame_spacing = 1

for idx_frame, frame in enumerate(frames):
    num_glitches_this_frame = 0
    for idx_digit, digit in enumerate(frame):
        # don't glitch first frame (file header)
        if idx_frame > 0:
            # new chance to glitch every (glitch_width) digits; count num per frame
            if idx_digit % glitch_width == 0:
                testval = random.uniform(0,100)
                if testval < glitch_prob:
                    num_glitches_this_frame += 1
            # perform glitch if testval, not to many glitches for this frame
            # within min/max freq, frame counter is 0
            if (
                testval < glitch_prob and 
                (True, num_glitches_this_frame <= max_glitches_per_frame)[max_glitches_per_frame > 0] and 
                idx_digit >= (len(frame) * frame_min) and
                idx_digit <= (len(frame) * frame_max) and
                idx_digit >= 8 and # leave header alone - first 8 digits
                frame_counter == 0
            ):
                digit = random.choice(hex_digits[hex_min:hex_max + 1])
        # append digit regardless of glitching
        output_hex.append(digit)
    # choose new frame spacing when counter is 0 (max is +1 because randrange is non-inclusive); increment, wrap (run once per frame)
    if frame_counter == 0:
        frame_spacing = random.randrange(frame_spacing_min, frame_spacing_max + 1)
    frame_counter += 1
    frame_counter %= frame_spacing
```

Finally, `''.join(output_hex)` takes the resulting hex data, which is in a new array called `output_hex`, and joins it into a single string, which is what the `.write()` method expects. As with the use of `open()` above, the argument `'wb'` indicates to write as binary, and the `.unhexlify()` method (from the `binascii` package) converts from ASCII hex back to raw binary data.


```python
rejoined_frames = ''.join(output_hex)
# 'wb' = 'write' + 'binary'; binascii.unhexlify converts ascii hex -> binary
# args.output is second cli positional argument
with open(args.output, 'wb') as output_file:
    output_file.write(binascii.unhexlify(rejoined_frames))
```

### Wrapping Up
I glossed over using the [`argparse`](https://docs.python.org/3/library/argparse.html) package to parse command-line arguments — that's more of a convenience-of-use feature, and I don't want to go on too long. If you want more info on it, there's an `argparse` tutorial at [this link](https://docs.python.org/3/howto/argparse.html).

If anyone tries this code out, I would love to hear about it! Especially I would be interested to know if there are any specific MP3s it fails to glitch. I will be adding support for a few more niche variants of the format in which the header starts with ”ffe” instead of ”fff,” so that will be addressed soon.

