---
title: Databending Part 2 — Hacking MP3s
description: I'm continuing my databending series with a look at MP3s. We'll talk about how to glitch and corrupt them into oblivion while still leaving them playable!
canonical_url: https://reillyspitzfaden.com/posts/2025/02/databending-part-2/
fedi_url: https://hachyderm.io/@reillypascal/113935424662297591
date: 2025-02-02T00:00:00-0500
octothorpes:
  - Art
  - Audio
  - music
tags:
  - post
  - databending
  - music
  - sounddesign
  - mp3
post_series: databending
---
<link rel="stylesheet" type="text/css" href="/styles/tables.css" />

<!-- Code highlighting CSS -->
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
<noscript>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
</noscript>

I [recently posted](https://reillyspitzfaden.com/posts/2025/01/databending-part-1/) about “databending,” which includes importing raw data into Audacity to make glitchy noises, changing the data in an image using a text/hex editor, and many other ways of creatively reinterpreting/damaging data. Since writing that post, I've learned some more fun ways of creating glitchy sounds with data, and I'll be discussing that today.

### Hacking MP3s

Composer Yasunao Tone has a series of “[MP3 Deviation](https://yasunaotone.bandcamp.com/album/mp3-deviation-8)” pieces that I like. Because his [previous work with damaged CDs](https://en.wikipedia.org/wiki/Yasunao_Tone#Activity_in_the_United_States_(1972-Present)) ([YouTube link](https://www.youtube.com/watch?v=CEDi-39o5qw)) derives its sounds directly from digital audio errors, I was expecting these pieces to do the same, but as the Bandcamp page above notes, Tone found errors between the MP3 encoder and decoder to be “not satisfactory,” and instead, these “MP3 Deviation” pieces use different MP3 errors to trigger different sample playback lengths. The pieces are full of cool sounds, but the process is not particularly connected to MP3s, and I've remained interested in seeing what's possible directly listening to MP3 errors.

I've done some reading off and on about MPEG compression (i.e., the family of formats that includes MP3) from a few DSP textbooks [^1] [^2] and managed to get the [GSM 06.10](https://en.wikipedia.org/wiki/Full_Rate) 2G cell phone [codec](https://en.wikipedia.org/wiki/Codec) [running in a plugin](https://github.com/reillypascal/RSTelecom), but I hadn't previously figured out how to get the MP3 codec to *glitch*. It turned out to be easier than I assumed! After having Nicolas Collins' book for a while, I recently realized that Nick Briz has a chapter in it on databending, [^3] and among other things, Briz writes about hacking MP3s in a hex editor. To explain how this works, I'll first cover a bit of background about MP3s.

### How MP3s Work
MP3s use [lossy compression](https://en.wikipedia.org/wiki/Lossy_compression). Compression summarizes the data to reduce storage space, and lossy compression additionally discards or makes an inexact summary of some of the data that is less perceptually relevant. An MP3 breaks down the audio into short chunks or "frames"; analyzes the frequencies present in each frame; determines which frequencies are "masked" by others, and thus less perceptually relevant; and based on which sounds are most relevant, allocates different numbers of bits to represent the loudness of each frequency.

The most important part of this for trying to glitch up an MP3 is that there is a header at the beginning of each frame that contains data about the file and must be left intact in order for the file to be readable. Additionally, there is a larger header at the beginning of the file, which must also be left intact. This where the Nick Briz article comes in. He goes into detail about what the header looks like, how to find it, and different ways the header may vary.

Before we get into how to do this, we need some background. First, because we will be looking at the raw binary data of the MP3 file, it's best to use a [hex editor](https://en.wikipedia.org/wiki/Hex_editor). This is an editor that represents raw binary data in [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) or base-16. I use [Hex Fiend](https://hexfiend.com/) on Mac, and [ImHex](https://imhex.werwolv.net/) is a popular one that works on Mac, Windows, and Linux. If you're familiar with hexadecimal, you can skip the next paragraph. Otherwise, let's take a moment to explain the hexadecimal number system.

For reference, the number "100" in [base-10](https://en.wikipedia.org/wiki/Decimal) (i.e., the usual number system we use) means one in the hundreds place (10^2), zero in the tens place (10^1), and zero in the ones place (10^0). In hexadecimal, "100" is equivalent to 256 in base-10 — one in the 256s place (16^2), zero in the 16s place (16^1), and zero in the ones place (16^0). To represent values greater than 9, hexadecimal adds the letters A-F to represent 10-15. For example, "FF" is equivalent to 255 in base-10 — "F" (or 15) in the 16s place, and "F" (or 15) in the ones place. Hexadecimal is a useful way to work with binary values since each hexadecimal digit always represents 4 binary digits — half a byte, sometimes called a "nibble" — making numbers much easier to read.

Now that we know what these values mean, let's take a look at the hex values in a typical MP3 header. The following table is taken from the Nick Briz article, [^4] and it shows the meaning of the example header FF FB A0 40:

| Hex | Binary | Meaning                                                                                                                                                                                                                                                                             |
| --- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F   | 1111   | All four bits are part of the MP3 sync code (used to find the header).                                                                                                                                                                                                              |
| F   | 1111   | All four bits are part of the MP3 sync code.                                                                                                                                                                                                                                        |
| F   | 1111   | The first three bits are part of the MP3 sync code. The last bit, in combination with the next bit below (i.e., 11), tells us which MPEG version this was encoded with. In this case 11 translates to MPEG version 1.                                                               |
| B   | 1011   | The first is used to determine the MPEG version (see prior), the second and third bit tell us the layer (i.e., 01, which is Layer 3), and the last bit tells us if there is copy protection (i.e., 1). In this case there is no protection; if there was the last bit would be a 0. |
| A   | 1010   | This byte \[ed: should say "nibble"] (all four bits) tell us the bitrate; in this case 1010 is a bitrate of 160 kbps.                                                                                                                                                               |
| 0   | 0000   | This byte tells us the sample rate, in this case 0000 is a sample rate of 44,100 Hz. Had it been 0100, this would be a sample rate of 48,000 Hz, or 1000 would be a sample rate of 32,000 Hz.                                                                                       |
| 4   | 0100   | The first two bits contain channel information; in this case 01 means Join Stereo. When set to Joint Stereo (like this example), the latter two bits tell us the mode of joint stereo.                                                                                              |
| 0   | 0000   | The first bit tells us if the MP3 file has a copyright (0 means it does not), the next bit tells us if it’s a copy of the original file or not (0 means it is). The last two bits tell us if there are empha­sized frequencies (00 means there are not).                            |

Most MP3 headers will begin with FFFB, as shown here. Briz gives a long list of alternative (and rarer) headers, but in short, all begin with either FFF or FFE. The important things to do when hacking an MP3 are:
- Find the *second* header in the file (e.g., use ctrl + F/cmd + F). It will be 8 hex digits long and will start with FFF or FFE. The first header will be the one for the entire file. It will (as far as I understand) start with the same values as the frame header, but the data after these 4 hex digits is also important and should be left alone.
- Do not alter the header or change the number of hex values in a frame. Instead replace values outside the header with an equal number of hex values.
- Repeat this process for each subsequent frame header.

One thing to note is that some MP3s are [variable bitrate](https://en.wikipedia.org/wiki/Variable_bitrate), and since the 5th hex digit in the header tells the bitrate, this digit will change between headers. On one file I tested, this tripped me up for a little while.

### Notes on the Process

Here are some of my observations:
- It's usually enough to replace 1 string of 8 characters (i.e., 4 bytes) per frame, and it's not necessary to mangle each frame. Jumping around and listening to the result, and returning to a spot if it needs more glitching helps keep me from getting bogged down.
- It tends to produce better results to use smaller numbers in each byte (i.e., each pair of digits). Smaller numbers correlate to lower amplitudes for the frequencies in each frame, and this tends to sound like watery burbling. Higher numbers tend to give bursts of white noise.
- It doesn't seem to matter too much if you repeat strings of numbers. A strategy that's worked well is to make a sequence of 8 hexadecimal digits with mostly smaller values in each byte and repeatedly paste it in as a replacement for one string with higher values every few frames.

### My Results
First, here is a short "un-glitched" MP3 file I used as the source for this process:

<audio controls>
	<source src="/media/blog/2025/02/beat_1_bip_2_F_snip.mp3" type="audio/mp3">
</audio>

Here is the same file after glitching:

<audio controls>
	<source src="/media/blog/2025/02/beat_1_bip_2_F_snip_ed.mp3" type="audio/mp3">
</audio>

I like the weird bubbling quality, and especially the high chirps and clicks. As far as I can tell, editing near the beginning or end of the frame should get different frequencies, and I may try getting more of those high chirps using this information.

### Improving the Process

My results here are extremely short, and the process of doing this by hand makes me feel like [Ben Wyatt making claymation](https://www.youtube.com/watch?v=LCUze7kuNas&t=42s). For a 160kbps MP3, not counting the headers, there should be 40,000 hex digits per second (160,000 bits divided by 4 bits per hex digit), so editing these by hand is beyond tedious. In addition, it would be nice to be able to audition a few different glitched versions of a file and pick the best one — this process feels like poking around in the dark since I don't fully know what will happen until I work for a while and listen back to my results. It would be great if I were able to automate some of this. 

I had a look around, and it looks like it isn't too hard to work with binary data as hex in Python. [This Stack Overflow answer](https://stackoverflow.com/questions/34687516/how-to-read-binary-files-as-hex-in-python/34687617#34687617) mentions that the [built in ```bytes``` object contains a ```.hex()``` method](https://docs.python.org/3/library/stdtypes.html#bytes.hex) and suggests the following code. This example is for opening genome data, but I imagine something similar could work for an MP3:

```python
with open('data.geno', 'rb') as f:
    hexdata = f.read().hex()
```

I haven't done too much with Python — most of my coding is with JS, C++, or a bit of Rust — so if anyone has suggestions on working with MP3s I would love to hear them! My general plan is as follows:
- Import the MP3 as hexadecimal (as shown above).
- Split up the hex data at the frame headers and put the frames into an array.
- For each frame, start after the header and randomly replace values. It might be nice to change the probability of replacing a value based on how far through the frame I am — as noted before, this should make the glitches tend to be higher or lower in pitch.
- Reassemble the frames and export as an MP3 again.

I will have a go at this soon, and if I get anywhere, I will do another writeup of my results. I hope to see you then, and I would love to hear if you try any of this!

[^1]: Udo Zölzer, _Digital Audio Signal Processing_ (John Wiley & Sons, 2022).

[^2]: Li Tan and Jean Jiang, _Digital Signal Processing: Fundamentals and Applications_ (Academic Press, 2018).

[^3]: Nick Briz, “Data Hacking: The Foundations of Glitch Art,” in [Handmade Electronic Music, 3rd ed.](https://www.nicolascollins.com/handmade.htm) (Routledge, 2020), 377–90.

[^4]: Ibid., 386

<!-- basic and Python highlighting from "highlight.js" library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"></script>

<script>hljs.highlightAll();</script>