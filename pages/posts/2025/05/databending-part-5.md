---
title: Databending Part 5 — Listening to Telephone Codecs
description: One way to get more variety when transforming data into audio is to change the encoding. Today I'm using the VOX ADPCM telephone codec — which I've found to be especially interesting — to do this.
fedi_url: 
og_image: /media/blog/2025/05/databending-part-5/dpcm-block-og-image.jpg
og_image_width: 1200
og_image_height: 630
date: 2025-05-03T12:55:02-0400
octothorpes:
  - Art
  - Audio
  - audio
  - music
tags:
  - post
  - databending
  - sounddesign
  - rust
  - programming
  - telecommunications
post_series: databending
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

Today we'll be talking about the VOX or [Dialogic ADPCM](https://en.wikipedia.org/wiki/Dialogic_ADPCM) format — a lossy algorithm from [Oki Electric](https://en.wikipedia.org/wiki/Dialogic_ADPCM) for digital voice telephony — and using it to translate raw data (e.g., program files) into audio. As I mentioned in my [first post](/posts/2025/01/databending-part-1/) on the topic, at a certain point, 

> once you listen to the “sonified” data from enough files, commonalities start to become apparent. Many programs use some of the same \[library] files, and…\[even] differently-named library files sometimes contain similar elements — likely re-used code patterns, or further library code compiled in.

One way I've found of getting more variety from the data is to change the sample format in which I import it. If I divide or group the raw bytes in different ways, or treat them as coming from audio files with different encodings, I can get different sound results from the exact same data. Let's talk about how ADPCM and VOX formats work; how to do this yourself in Audacity; and how I incorporated these formats into the [Rust tool](https://github.com/reillypascal/data2audio) I made in my [last post](/posts/2025/05/databending-part-4/) to automate the process of converting data to audio.

### What is ADPCM?

Tan and Jiang [^1] have a helpful discussion of the basics of ADPCM, or “adaptive differential pulse-code modulation.” First, with differential pulse-code modulation (the “non-adaptive” flavor),

> \[the] general idea is to use past recovered values as the basis to predict the current input data and then encode the difference between the current input and the predicted input. (486)

In other words, if we can predict the output to within a decent approximation, all we need to store is the difference between our rough prediction and the actual output. This difference uses less data to store than the original signal, saving bandwidth. The following diagram illustrates the signal flow for the encoder (A) and decoder (B):

<figure>

![Differential pulse code modulation (DPCM) block diagram. A quantizer feeds back into a prediction of the output; the prediction is compared to the actual next sample; and the difference is used for the next prediction.](/media/blog/2025/05/databending-part-5/dpcm-block-diagram.webp)

<figcaption>DPCM block diagram from Tan and Jiang (2018, 487)</figcaption>

</figure>

Note that while we describe a “predictor,” there isn't anything fancy here — we simply “predict” that the current sample will equal the previous one and take the (quantized) difference between that and the actual current sample.

<!-- The next diagram shows the adaptive version of the encoder (A) and decoder (B), as used in standard [G.721/G.726](https://en.wikipedia.org/wiki/G.726). The primary difference here is the addition of an adaptive logarithmic scaling factor for the quantization. This adaptive scaling factor is based on a combination of the short- and long-term variation in the input signal.

<figure>

![Adaptive differential pulse code modulation (DPCM) block diagram.](/media/blog/2025/05/databending-part-5/adpcm-block-diagram.webp)

<figcaption>ADPCM block diagram from Tan and Jiang (491)</figcaption>

</figure>

The details of the algorithm start to get much more involved, so I will focus on the decoder portion, which is all I need to implement. The decoder splits the input into two paths — the adaptation and quantizer — and the quantizer uses the adaptation to scale the quantization. The predictor also uses a combination of the output of the quantizer and the outgoing, decoded signal to predict the next sample. -->

The next diagram shows the adaptive version of the decoder as shown in the original VOX ADPCM paper from the Dialogic Corporation. [^2] 

<figure>

![VOX ADPCM (adaptive differential pulse code modulation) decoder block diagram.](/media/blog/2025/05/databending-part-5/vox-adpcm-block-diagram.webp)

<figcaption>ADPCM decoder block diagram from the Dialogic Corporation (1988, 5)</figcaption>

</figure>

### VOX

There are a number of ADPCM algorithms, and Audacity has the VOX format and something listed as NMS ADPCM. To avoid spending a while coding something with a disappointing sound result, I just used Audacity to import raw data as audio using these two, and the VOX format was by far the most interesting. You can hear the same data imported as 16-bit integer and VOX ADPCM in [this aside](/posts/2025/05/databending-part-4/#adpcm) from my previous post. I love the result, but unfortunately I wasn't able to find anything pre-existing in Rust to use the VOX format — the [symphonia crate](https://crates.io/crates/symphonia) that was recommended to me only has [Microsoft and IMA flavors](https://lib.rs/crates/symphonia-codec-adpcm#readme-support) of ADPCM. Looks like I need to code it myself!

Now we will discuss the implementation details of the VOX format. We've already seen the block diagram of the VOX algorithm above. We need to calculate the step size ```ss(n)``` and use that and the 4-bit input sample ```L(n)``` to calculate the difference ```d(n)```. That difference plus the previous output ```X(n-1)``` will be our 12-bit output value. Below is the pseudocode from the Dialogic paper (1988, 5) for calculating ```d(n)``` given a value of ```ss(n)``` and an incoming sample. Note the values B3–B0 — these refer to the 4 bits in the incoming sample. This tripped me up for a bit since the paper wasn't very explicit about what these values refer to, but I came across a usage of the same terminology in Dialogic's Voice API Programming Guide (2010, 78) which pointed me in the right direction. [^3]

```c
d(n) = (ss(n)*B2)+(ss(n)/2*B1)+(ss(n)/4*BO)+(ss(n)/8) 
if (B3 = 1)
    then d(n) = d(n) * (-1)
X(n) = X(n-1) + d(n)
```

To make this calculation, we also need the step size ```ss(n)```. The pseudocode for that is shown below:

```c
ss(n+1) = ss(n) * 1.1M(L(n))
```

The paper includes a pair of lookup tables to efficiently calculate this value. Here they are as I use them in my Rust code. We use the 4-bit incoming value to look up an “adjustment factor” in the first table, and we move a pointer into the ```STEP_SIZE``` table by the resulting amount, initialized to the first value, 16. Note that incoming values below 4 cause the step size to decrease, and values 4 or greater cause it to increase.

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

<div class="code-file">vox.rs</div>

```rust
pub struct VoxState {
    predictor: i16,
    step_index: i16,
}
```

<div class="code-file">vox.rs</div>

```rust
impl VoxState {
    // ...
    pub fn vox_decode(&mut self, in_nibble: &u8) -> i16 {
        // get step size from last time's index before updating
        let step_size = VOX_STEP_TABLE[self.step_index as usize];
        // use in_nibble to index into adpcm step table; add to step
        let mut step_index = self.step_index + ADPCM_INDEX_TABLE[*in_nibble as usize];
        // clamp index to size of step table — for next time
        step_index = i16::clamp(step_index, 0, (VOX_STEP_TABLE.len() - 1) as i16);
        
        // sign is 4th bit; magnitude is 3 LSBs
        let sign = in_nibble & 8;
        let delta = in_nibble & 7;
        // delta; after * 2 and >> 3, equivalent to scale of 3 bits in (ss(n)*B2)+(ss(n)/2*B1)+(ss(n)/4*BO) from pseudocode
        // + 1; after >> 3, corresponds to ss(n)/8 from pseudocode — bit always multiplies step, regardless of 3 delta bits on/off
        let diff = ((2 * delta + 1) as i16 * step_size) >> 3;
        // last time's value
        let mut predictor = self.predictor;
        // if sign bit (4th one) is set, value is negative
        if sign != 0 { predictor -= diff; } 
        else { predictor += diff; }
        
        // clamp output between -(2^p), (2^p-1), p = 11
        self.predictor = i16::clamp(predictor, -i16::pow(2, 11), i16::pow(2, 10));
        // update for next time through; ss(n+1) into z-1 from block diagram
        self.step_index = step_index;
        // return updated predictor, which is also saved for next time; X(n) into z-1
        self.predictor * 16
    }
}
```

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
                // & 0xf only selects lowest 4
                for nibble in [(chunk >> 4) & 0xf, chunk & 0xf].iter() {
                    // vox output is 12-bit, from i16::MIN <-> i16::MAX/2
                    // *don't* shift — seems to change spectrum, envelope
                    output.push(vox_state.vox_decode(nibble) as f64);
                }
            });
        // ...returning outside of pipeline since we need to handle *two* nibbles per element in iter()
        output
    }
};
```

<!-- <figure>

![Two lookup tables. The first has the values -1, -1, -1, -1, +2, +4, +6, and +8; the second has 49 values incrementing from 16 to 1552, with the step size progressively increasing.](/media/blog/2025/05/databending-part-5/vox-adpcm-lookup-tables.webp)

<figcaption>VOX ADPCM decoder lookup tables from the Dialogic Corporation (1988, 6)</figcaption>

</figure> -->

[^1]: Li Tan and Jean Jiang, Digital Signal Processing: Fundamentals and Applications (Academic Press, 2018).

[^2]: https://people.cs.ksu.edu/~tim/vox/dialogic_adpcm.pdf

[^3]: https://www.dialogic.com/~/media/manuals/docs/voice_programming_hmp_v7.pdf

[^4]: https://www.dialogic.com/webhelp/NaturalAccess/Release9.0/Voice_Control_Element_API_Dev_Manual/overview_of_vox_file_format.html