---
title: "Databending Part 6: Modem Sounds"
description: 
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-07-12T11:30:00-0400
octothorpes:
  - 
tags:
  - post
post_series: databending
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

[Nathan Ho writes](https://nathan.ho.name/posts/dm-synthesis/) about what he calls “digital modulation” (DM) synthesis, based on the [digital modulation methods](https://en.wikipedia.org/wiki/Signal_modulation#Digital_modulation_methods) used in telecommunications. Today, I'm using Rust to convert ASCII data into a .WAV file, and using that to modulate a sine wave in Max/MSP, much the way a dial-up modem or transmissions of data over shortwave radio might function. Let's get to it!

## The Max Patch

I will start with the Max patch since the way that works informs the Rust code. 

## The Rust Code

```rust
use std::fs;
use hound;

//...

let data: Vec<u8> = fs::read("input.txt").expect("Error reading file");

let mut out_data: Vec<i16> = vec![];

// uncomment for bpsk
/* for num in data {
    for i in 0..8 {
        let bpsk_val = (num >> i) & 0b1;
        // for two's complement, max positive is all ones *except* highest bit; need to ! the value if doing << 15
        out_data.push(!((bpsk_val as i16) << 15));
    }
} */

// uncomment for qpsk
/* for num in data {
    for i in 0..4 {
        let qpsk_val = (num >> (i * 2)) & 0b11;
        out_data.push((qpsk_val as i16) << 13);
    }
} */

let spec = hound::WavSpec {
    channels: 1,
    sample_rate: 44100,
    bits_per_sample: 16,
    sample_format: hound::SampleFormat::Int,
};

let mut writer = hound::WavWriter::create("dm.wav", spec).expect("Could not create writer");
for sample in out_data {
    writer
        .write_sample(sample)
        .expect("Could not write sample");
}
writer.finalize().expect("Could not finalize WAV file");
```

