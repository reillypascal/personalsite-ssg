---
title: Databending Part 5 — Listening to Telephone Codecs
description: 
fedi_url: 
og_image: /media/blog/2025/05/databending-part-5/dpcm-block-og-image.jpg
og_image_width: 1200
og_image_height: 630
date: 2025-05-03T12:55:02-0400
octothorpes:
  - 
tags:
  - post
post_series: databending
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

Today we'll be talking about the VOX or [Dialogic ADPCM](https://en.wikipedia.org/wiki/Dialogic_ADPCM) format from [Oki Electric](https://en.wikipedia.org/wiki/Dialogic_ADPCM), a lossy algorithm for digital voice telephony. I'm implementing it in Rust and using it to translate raw data (e.g., program files) into audio. As I mentioned in my [first post](/posts/2025/01/databending-part-1/) on the topic, at a certain point, 

> once you listen to the “sonified” data from enough files, commonalities start to become apparent. Many programs use some of the same \[library] files, and…\[even] differently-named library files sometimes contain similar elements — likely re-used code patterns, or further library code compiled in.

One way I've found of getting more variety from the data is to change the sample format in which I import it. If I divide or group the raw bytes in different ways, or treat them as coming from audio files with different encodings, I can get different audio results from the exact same data. Let's talk about how ADPCM and VOX formats work; how to do this yourself in Audacity; and how I incorporated these formats into the [Rust tool](https://github.com/reillypascal/data2audio) I made in my [last post](/posts/2025/05/databending-part-4/) to automate the process of converting data to audio.

### What is ADPCM?

Tan and Jiang [^1] have a helpful discussion of the basics of ADPCM, or “adaptive differential pulse-code modulation.”

First, with differential pulse-code modulation (the “non-adaptive” flavor),

> \[the] general idea is to use past recovered values as the basis to predict the current input data and then encode the difference between the current input and the predicted input. (486)

In other words, if we can predict the output to within a decent approximation, all we need to store is the difference between our rough prediction and the actual output. This difference uses less data to store than the original signal, saving bandwidth. The following diagram illustrates the signal flow for the encoder (A) and decoder (B):

<figure>

![Differential pulse code modulation (DPCM) block diagram. A quantizer feeds back into a prediction of the output; the prediction is compared to the actual next sample; and the difference is used for the next prediction.](/media/blog/2025/05/databending-part-5/dpcm-block-diagram.webp)

<figcaption>DPCM block diagram from Tan and Jiang (487)</figcaption>

</figure>

Note that while we describe a “predictor,” there isn't anything fancy here — we simply “predict” that the current sample will equal the previous one and take the (quantized) difference between that and the actual current sample.

The next diagram shows the adaptive version of the encoder (A) and decoder (B).

<figure>

![Adaptive differential pulse code modulation (DPCM) block diagram.](/media/blog/2025/05/databending-part-5/adpcm-block-diagram.webp)

<figcaption>ADPCM block diagram from Tan and Jiang (491)</figcaption>

</figure>

### VOX

There are a number of ADPCM algorithms, and Audacity has the VOX format and something listed as NMS ADPCM. To avoid spending a while on something with a disappointing sound result, I tested importing raw data as audio using these two, and the VOX format was by far the most interesting. You can hear the same data imported as 16-bit integer and VOX ADPCM in [this aside](/posts/2025/05/databending-part-4/#adpcm) from my previous post. I love the result, but unfortunately I wasn't able to find anything in Rust to handle this — the [symphonia crate](https://crates.io/crates/symphonia) that was recommended to me only has [Microsoft and IMA flavors](https://lib.rs/crates/symphonia-codec-adpcm#readme-support) of ADPCM. 

I did find [this](https://github.com/dreamflyforever/vox/) VOX implementation in C, but it doesn't have a license, and I find reading block diagrams to be easier than trying to convert from C to DSP concepts, so I will be referencing the original VOX ADPCM paper [^2] from Oki Electric.

[^1]: Li Tan and Jean Jiang, Digital Signal Processing: Fundamentals and Applications (Academic Press, 2018).

[^2]: https://people.cs.ksu.edu/~tim/vox/dialogic_adpcm.pdf

[^3]: https://www.dialogic.com/webhelp/NaturalAccess/Release9.0/Voice_Control_Element_API_Dev_Manual/overview_of_vox_file_format.html