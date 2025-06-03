---
title: Databending Part 5—Listening to Telephone Codecs
description: One way to get more variety when transforming data into audio is to change the encoding. Today I'm implementing the VOX ADPCM telephone codec—which I especially like—in Rust to accomplish this!
fedi_url: 
  - https://hachyderm.io/@reillypascal/114467479727280788
  - https://bsky.app/profile/reillypascal.bsky.social/post/3lolssltkxc24
og_image: /media/blog/2025/05/databending-part-5/dpcm-block-og-image.jpg
og_image_width: 1200
og_image_height: 630
date: 2025-05-07T10:16:00-0400
octothorpes:
  - Art
  - Audio
  - audio
  - music
tags:
  - post
  - databending
  - sound-design
  - rust
  - programming
  - telecommunications
  - dsp
post_series: databending
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

Today we'll be talking about the VOX or [Dialogic ADPCM](https://en.wikipedia.org/wiki/Dialogic_ADPCM) format—a lossy algorithm from [Oki Electric](https://en.wikipedia.org/wiki/Dialogic_ADPCM) for digital voice telephony — and using it to translate raw data (e.g., program files) into audio. As I mentioned in my [first post](/posts/2025/01/databending-part-1/) on the topic, at a certain point, 

> once you listen to the “sonified” data from enough files, commonalities start to become apparent. Many programs use some of the same \[library] files, and…\[even] differently-named library files sometimes contain similar elements—likely re-used code patterns, or further library code compiled in.

One way I've found of getting more variety from the data is to change the sample format in which I import it. If I divide or group the raw bytes in different ways, or treat them as coming from audio files with different encodings, I can get different sound results from the exact same data. For example, here is the same data (```libicudata.73.1.dylib``` from the Calibre e-book manager macOS app) imported into Audacity first as 16-bit integer, then as VOX ADPCM:

<audio controls src="/media/blog/2025/05/databending-part-4/libicudata.73.1 i16.mp3" title="libicudata.73.1 imported to Audacity as 16-bit audio"></audio>

<audio controls src="/media/blog/2025/05/databending-part-4/libicudata.73.1 VOX ADPCM.mp3" title="libicudata.73.1 imported to Audacity as VOX ADPCM audio"></audio>

Both very cool, and both very different, despite coming from the same data! Today, let's talk about how ADPCM and VOX formats work; how to do this yourself in Audacity; and how I incorporated these formats into the [Rust tool](https://github.com/reillypascal/data2audio) I made in my [last post](/posts/2025/05/databending-part-4/) to automate the process of converting data to audio. Also check out the end of today's post for some fun stuff to look forward to!

## Following along in Audacity

While I will be doing this in Rust, you can make the exact same sounds (minus the convenience of automation) in Audacity. See my [first post](/posts/2025/01/databending-part-1/) on databending for a discussion of how to find the best files to use. Once you have the file you want to convert to audio,

- in Audacity, go to File > Import > Raw Data…, choose your file, and click “Open”
- in the settings menu that pops up, set encoding to “VOX ADPCM,” byte order to “default endianness,” channels to “1 channel (mono),” and sample rate to 44100 (or change sample rate to taste)

## What is ADPCM?

Tan and Jiang [^1] have a helpful discussion of the basics of ADPCM, or “adaptive differential pulse-code modulation.” First, with differential pulse-code modulation (the “non-adaptive” flavor),

> \[the] general idea is to use past recovered values as the basis to predict the current input data and then encode the difference between the current input and the predicted input. (486)

In other words, if we can predict the output to within a decent approximation, all we need to store is the difference between our rough prediction and the actual output. This difference uses less data to store than the original signal, saving bandwidth. The following diagram illustrates the signal flow for the encoder (A) and decoder (B):

<figure>

![Differential pulse code modulation (DPCM) block diagram. A quantizer feeds back into a prediction of the output; the prediction is compared to the actual next sample; and the difference is used for the next prediction.](/media/blog/2025/05/databending-part-5/dpcm-block-diagram.webp)

<figcaption>DPCM block diagram from Tan and Jiang</figcaption>

</figure>

Note that while we describe a “predictor,” there isn't anything fancy here—we simply “predict” that the current sample will equal the previous one and take the (quantized) difference between that and the actual current sample.

The next diagram shows the adaptive version of the decoder as shown in the original VOX ADPCM paper from the Dialogic Corporation. [^2] The primary difference here is the addition of an adaptive scaling factor for the difference between prediction and actual value. This scaling factor is based on the amplitude of the incoming difference, and we will discuss the specifics of the scaling in the next section.

<figure>

![VOX ADPCM (adaptive differential pulse code modulation) decoder block diagram.](/media/blog/2025/05/databending-part-5/vox-adpcm-block-diagram.webp)

<figcaption>ADPCM decoder block diagram from the Dialogic Corporation</figcaption>

</figure>

## VOX

There are a number of ADPCM algorithms—many different ways to adapt our step size based on the amplitude of the difference and/or prediction—and after testing some out while importing data as audio in Audacity, I decided VOX was by far my favorite. Unfortunately I wasn't able to find anything pre-existing in Rust for VOX — the [symphonia crate](https://crates.io/crates/symphonia) that was recommended to me only has [Microsoft and IMA flavors](https://lib.rs/crates/symphonia-codec-adpcm#readme-support) of ADPCM. Looks like I need to code it myself! You can find the resulting code [here](https://github.com/reillypascal/data2audio).

Here's a snippet of audio databent through my resulting VOX ADPCM implementation:

<audio controls src="/media/blog/2025/05/databending-part-5/libQt5Core.5.mp3" title="libQt5Core.5.dylib file databent through VOX ADPCM codec"></audio>

The file is ```libQt5Core.5.dylib``` which I *believe* I pulled from DaVinci Resolve a week or two ago. Also, just as a check, here's a voice file (8 kHz sample rate) I encoded as VOX ADPCM with Audacity [^3] and decoded with this Rust tool:

<audio controls src="/media/blog/2025/05/databending-part-5/this-is-a-test.mp3" title="me saying 'this is a test of my voice to import as VOX ADPCM' at 8 kHz sample rate"></audio>

Sounds just as expected—a bit crunchy and lo-fi like a telephone, but clear and comprehensible.

## Reading the VOX Spec

First, we need to calculate the step size ```ss(n)``` and use that and the 4-bit input sample ```L(n)``` to calculate the difference ```d(n)```. That difference plus the previous output ```X(n-1)``` will give our 12-bit output value. Below is the pseudocode from the Dialogic paper for calculating ```d(n)``` given a value of ```ss(n)``` and an incoming sample. Note the values B3–B0—these refer to the 4 bits in the incoming sample, with B3 as the sign and the rest as the magnitude. 

```c
d(n) = (ss(n)*B2)+(ss(n)/2*B1)+(ss(n)/4*BO)+(ss(n)/8) 
if (B3 = 1)
    then d(n) = d(n) * (-1)
X(n) = X(n-1) + d(n)
```

To make this calculation, we need to get the step size ```ss(n)```. The pseudocode for that is shown below:

```c
ss(n+1) = ss(n) * 1.1M(L(n))
```

The paper includes a pair of lookup tables to efficiently calculate this value. Here they are as I use them in my Rust code. We use the 4-bit incoming value to look up an “adjustment factor” in the ```ADPCM_INDEX_TABLE```, and we move an index into the ```VOX_STEP_TABLE``` table by that adjustment factor. This index is initialized to zero, giving the first value in that table—16.

<div class="code-file">vox.rs</div>

```rust
// duplicate values from spec; can index w/ whole nibble, incl sign bit (4th)
// increment up/down thru this table...
const ADPCM_INDEX_TABLE: [i16; 16] = [
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8,
];
// ...use (clamped) index table to index this array for step size
const VOX_STEP_TABLE: [i16; 49] = [
    16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 
    157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 
    494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552,
];
```

Note that incoming magnitudes (first 3 bits) below 4 cause the step size to decrease, and values 4 or greater cause it to increase. The values in ```ADPCM_INDEX_TABLE``` are duplicated so I can use the whole 4-bit value (including bit 4, the sign bit) to index the table.

## Implementing VOX in Rust

To start, I have a struct called ```VoxState``` that stores the predictor and step index. Note in the diagram above that these two values are fed into single-sample delays (the blocks labeled “Z<sup>-1</sup>”), [^4] so having them stored in a struct allows us to maintain state between calls to the decoder function.

<div class="code-file">vox.rs</div>

```rust
pub struct VoxState {
    predictor: i16,
    step_index: i16,
}
```

I implement a ```vox_decode()``` function for the ```VoxState``` struct, as shown below. We get the step size from last time around, then update the step size for next time. The sign is the 4th bit of the incoming nibble, and the magnitude is the lower 3 bits. We get the difference between the current value and the prediction from last time with the line ```let mut delta = ((2 * (magnitude as i16) + 1) * step_size) >> 3;```—we will come back to how this relates to the pseudocode in a bit. 

We either add or subtract the predictor and ```delta```, depending on the sign bit, and clamp the predictor to the range of a 12-bit signed integer. When we return this value from the function, we multiply it by 16, scaling it into the range of the 16 bit integer format of the .WAV file we'll write later. Before returning, we'll also update the struct's step index for next time around.

<div class="code-file">vox.rs</div>

```rust
impl VoxState {
    // ...
    pub fn vox_decode(&mut self, in_nibble: &u8) -> i16 {
        // get step size from last time's index before updating
        let step_size = VOX_STEP_TABLE[self.step_index as usize];
        // use in_nibble to index into adpcm step table; add to step
        let mut step_index = self.step_index + ADPCM_INDEX_TABLE[*in_nibble as usize];
        // clamp index to size of step table—for next time
        step_index = i16::clamp(step_index, 0, 48);
        
        // sign is 4th bit; magnitude is 3 LSBs
        let sign = in_nibble & 0b1000;
        let magnitude = in_nibble & 0b0111;
        // magnitude; after * 2 and >> 3, equivalent to scale of 3 bits in (ss(n)*B2)+(ss(n)/2*B1)+(ss(n)/4*BO) from pseudocode
        // + 1; after >> 3, corresponds to ss(n)/8 from pseudocode—bit always multiplies step, regardless of 3 magnitude bits on/off
        let mut delta = ((2 * (magnitude as i16) + 1) * step_size) >> 3;
        // last time's value
        let mut predictor = self.predictor;
        // if sign bit (4th one) is set, value is negative
        if sign != 0 { delta *= -1; }
        predictor += delta;
        
        // clamp output between 12-bit signed min/max value
        self.predictor = i16::clamp(predictor, -i16::pow(2, 11), i16::pow(2, 11) - 1);
        // update for next time through; ss(n+1) into z-1 from block diagram
        self.step_index = step_index;
        // return updated predictor, which is also saved for next time; X(n) into z-1
        // scale from 12-bit to 16-bit; 16 = 2^4, or 4 extra bits
        self.predictor * 16
    }
}
```

Returning to the main code file and picking up from [last time](/posts/2025/05/databending-part-4/), here is how we use our new code. We've opened a file as a ```Vec<u8>```, and we're storing the results of a ```match``` expression in a ```Vec<f64>``` (since the filtering will work better with floats). In the “arm” of the ```match``` expression for the VOX format, we iterate over the imported ```Vec<u8>```, and for each byte, we split the byte into two 4-bit “nibbles,” iterating over ```[chunk >> 4, chunk & 0b1111].iter()``` and running ```vox_state.vox_decode()``` for each nibble. 

In the diagram below from the spec, note that the highest 4 bits in a byte come first, so our first nibble is ```chunk >> 4```, which brings those bits down into the lowest 4 positions. ```chunk & 0b1111``` keeps only the 4 lowest bits, giving us the second nibble in the byte.

<figure>

![A diagram of a byte, showing “sample N” as the highest 4 bits and ”sample N+1” as the lower 4 bits](/media/blog/2025/05/databending-part-5/vox-adpcm-nibbles.webp)

<figcaption>VOX byte layout from the Dialogic Corporation</figcaption>

</figure>

We push the decoded values into our output ```Vec<f64>```, ready for the next stage, which is filtering and writing to .WAV (see [previous post](/posts/2025/05/databending-part-4) for a discussion of that code).

<div class="code-file">main.rs</div>

```rust
// import file as Vec<u8>
let data: Vec<u8> = fs::read(entry.path()).expect("Error reading file");
// need to filter as f64 anyway, so best to do in match arms here for consistency
let converted_data: Vec<f64> = match args.format {
    // ...
    SampleFormat::Vox => {
        let mut output: Vec<f64> = Vec::new();
        let mut vox_state = vox::VoxState::new();
        data
            .iter()
            // using for_each and...
            .for_each(|chunk| {
                // start with highest 4 bits (by right-shifting)
                // then & 0x1111 then selects lowest 4
                for nibble in [chunk >> 4, chunk & 0b1111].iter() {
                    output.push(vox_state.vox_decode(nibble) as f64);
                }
            });
        // ...returning outside of pipeline since we need to handle *two* nibbles per element in iter()
        output
    }
};
```

Before we discuss the challenges, just for funsies I put the compiled binary for my databending tool back through the tool (using our new VOX codec). Here's a segment of the result:

<audio controls src="/media/blog/2025/05/databending-part-5/data2audio.mp3" title="data2audio binary file databent through VOX ADPCM codec"></audio>

## Challenges

At this point, our code works! There were a few things in the VOX spec that tripped me up though, so let's talk about how I got my code working. First, when my attempt at implementing the spec gave me trouble, I looked at the source for FFmpeg, which Audacity uses—specifically the function ```adpcm_ima_oki_expand_nibble()``` in ```libavcodec/adpcm.c```, line 553. [^5] This is where I got the line ```let mut delta = ((2 * (magnitude as i16) + 1) * step_size) >> 3;``` from ```vox.rs``` above.

Let's consider the line of pseudocode ```d(n) = (ss(n)*B2)+(ss(n)/2*B1)+(ss(n)/4*BO)+(ss(n)/8)```—this is how we combine the incoming magnitude and the step size to get the difference between the current and previous samples. B2, B1, and B0 are the three magnitude bits from the incoming nibble. If, for example, B1 is zero, ```ss(n)/2*B1``` will divide by zero. Not only will we need to check whether each bit is zero or not, but division is more costly than the other arithmetic operations. However, we can think about this another way.

With ```(ss(n)*B2)+(ss(n)/2*B1)+(ss(n)/4*BO)+(ss(n)/8)```, if we leave out the multiplication by ```ss(n)``` for the time being, we have 1 or 0 times 1; 1 or 0 times 1/2; 1 or 0 times 1/4; and 1 times 1/8. That's just the ones place and first 3 binary floating point places. If we shift those values 3 places left, we have no more fractions/division, and if we shift the incoming 3 magnitude bits 1 place left (i.e., multiply by 2) and add one, our magnitude and the previous values we shifted line up the same way as before. We can multiply what we have now by the step size, and ```>> 3``` “undoes” the left shift we did to get rid of the fraction. Thus ```((2 * (magnitude as i16) + 1) * step_size) >> 3``` is equivalent to ```(ss(n)*B2)+(ss(n)/2*B1)+(ss(n)/4*BO)+(ss(n)/8)```, but we don't need to work around dividing by zero, and things are a bit faster to boot.

## Looking Forward

Lately I've been enjoying windytan (Oona Räisänen)'s [blog](https://www.windytan.com/2013/11/broadcast-messages-on-darc-side.html)—a “blog about sound & signals” where she discusses a variety of telecommunications encoding formats, both in terms of their sound and decoding them. I got an [RTL-SDR](https://www.rtl-sdr.com/about-rtl-sdr/) [software-defined radio](https://en.wikipedia.org/wiki/Software-defined_radio) dongle back in 2020, and greatly enjoyed tracking down and decoding interesting signals. Now that I have more programming skills, I think I'll do more discussion of and coding with different telecommunications formats—both for radio, and for telephony, as I did today.

One thing that [@EveHasWords](https://toot.cat/@EveHasWords/114377893125307935) mentioned recently and that I also saw [on windytan's blog](https://www.windytan.com/2012/08/vintage-bits-on-cassettes.html) is using cassette tapes to store digital data such as software or games. The general idea is that you modulate a tone to encode digital data, and then record that as audio on a regular cassette tape—[this person](https://zeninstruments.blogspot.com/2021/10/manchester-decoder-and-cassette.html) did it with an Arduino and Python, so that could be a good starting point for a fun project. 

<!-- At one point I even [figured out](https://hachyderm.io/@reillypascal/112747124169952464) how to run Rust on a BBC micro:bit (using [this book](https://docs.rust-embedded.org/discovery/microbit/)), so that could be another fun thing to use in the project. -->

You can follow the [RSS feeds](/feeds) for this blog to see any future updates on such projects — hope to see you then!

[^1]: L. Tan and J. Jiang, *Digital Signal Processing: Fundamentals and Applications*. Academic Press, 2018, pp. 486–496.

[^2]: Dialogic Corporation, *Dialogic ADPCM Algorithm*, 1988. \[Online]. Available: https://people.cs.ksu.edu/~tim/vox/dialogic_adpcm.pdf.

[^3]: Here's a [link](https://forum.audacityteam.org/t/dialogic-vox-format/40080/2) to the Audacity forum explaining where to find the settings to do this.

[^4]: This notation comes from the idea of the [Z-transform](https://en.wikipedia.org/wiki/Z-transform).

[^5]: FFmpeg, *libavcodec/adpcm.c*. \[Online]. Available: https://ffmpeg.org/doxygen/7.0/adpcm_8c_source.html#l00553.