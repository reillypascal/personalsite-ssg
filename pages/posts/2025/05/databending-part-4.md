---
title: Databending Part 4 – Making a Rust Tool
description: Manually importing files as raw data in Audacity is slow — let's automate it in Rust!
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-04T12:30:00-0400
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
post_series: databending
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />

Earlier this year I [wrote](/posts/2025/01/databending-part-1/) about how to import any file into Audacity and convert it to audio. Today I want to make the process less tedious, as well as get some practice with the [Rust](https://en.wikipedia.org/wiki/Rust_(programming_language)) programming language. 

As a refresher on the databending process, I wrote in the first post that in digital audio files

> we take repeated readings or “samples” of this rising and falling pressure at very rapid intervals in time (the “sample rate”), and represent the height of the rising and falling line at each reading using an integer value.

> Since any computer file is just a list of numbers — binary values stored on the computer's drive — we can take the list of numbers from any file and treat them as a list of amplitudes in an audio file.

Let's talk about the why and how of my databending tool! If you want to use it or just follow along, the code is available [here on GitHub](https://github.com/reillypascal/data2audio).

### Why Automate?

When I first wrote about this process, I mentioned that

> once you listen to the “sonified” data from enough files, commonalities start to become apparent…\[and] the process of finding these sounds is also fairly slow and painstaking.

In addition to simply speeding up the search for interesting files, automation also makes it more practical to “audition” different *ways* of importing a given interesting file. I usually convert the data into an audio file in which each “sample” is a  [16-bit integer](https://en.wikipedia.org/wiki/Audio_bit_depth) — in many cases, I find I like the sound result of this best. However, treating it as an 8-bit, 24-bit or 32-bit integer (or some of the more unique sample formats available in Audacity, such as [ADPCM](https://en.wikipedia.org/wiki/Differential_pulse-code_modulation)) can give additional variety and get around the sonic commonalities I mentioned.

Even with the additional work of writing this code, it's already been helpful for composing to not have to think too hard before importing a file with a given format — I can do all options and more easily comb through the results, plus there's less mouse usage, which tends to be bad for my wrists, even with my ergonomic vertical mouse.

### Importing the Files

```rust
use std::fs;
use walkdir::WalkDir;

fn main() {
  // WalkDir "walks" recursively through a directory and all its subfolders
  // In actual code, use CLI inputs for input folder name
  WalkDir::new("input/")
  .into_iter()
  .filter_map(|entry| entry.ok())
  .for_each(|entry| {
    // extract metadata from Result<T,E> for each entry in dir
    if let Ok(metadata) = entry.metadata() {
      // if it's a file and greater/equal to min size (which is CLI argument in actual code)...
      if metadata.is_file() && metadata.len() >= 1000000 {
        // ...read in file as a vector of unsigned 8-bit integers
        let data: Vec<u8> = fs::read(entry.path()).expect("Error reading file");
      }
    }
  });
}
```

### Converting Files to Audio

I'm using the [clap](https://crates.io/crates/clap) crate to handle command-line arguments. I won't get into too much detail here, but the relevant part is that the user's choice of sample format is recorded as one of the options in the ```SampleFormat``` enum, which derives from ```clap```'s ```ValueEnum```.

```rust
use clap::{Parser, ValueEnum};
// ...
#[derive(ValueEnum, Clone, Debug)]
enum SampleFormat {
    Uint8,
    Int16,
    Int24,
    Int32,
}

```

Picking up where we left off when importing the file, I can take that ```Vec<u8>``` holding our file data and, depending on the sample format, convert it to appropriately-sized values. If the contents of the “arms” of a Rust ```match``` statement are an [expression](https://doc.rust-lang.org/book/ch03-03-how-functions-work.html#statements-and-expressions), you can have something like ```let converted_data: Vec<f64> = match args.format``` and and the variable ```converted_data``` will hold the appropriate value, based on the arm chosen. In this case, simply not putting a semicolon after (e.g.) ```data.chunks_exact(2).map().collect()``` causes that piece of code to be an expression. 

```rust
// ...
if metadata.is_file() && metadata.len() >= 1000000 {
  // ...read in file as a vector of unsigned 8-bit integers
  let data: Vec<u8> = fs::read(entry.path()).expect("Error reading file");

  // ---- CONVERT BASED ON SAMPLE FORMAT ----
  // need to filter as f64 anyway, so best to do in match arms here for consistency
  let converted_data: Vec<f64> = match args.format {
    SampleFormat::Uint8 => {
      data
        .iter()
        .map(|chunk| {
            // bit-shift based on using 16-bit wav at output
            // need to do as 16-bit to avoid overflow in shift
            ((*chunk as u16) << 8) as f64
        }).collect()
    }
    SampleFormat::Int16 => {
      data
        .chunks_exact(2)
        .map(|chunks| {
          // from_le_bytes() takes array of bytes and converts to a single little-endian integer
          i16::from_le_bytes(chunks.try_into().expect("Could not import as 16-bit")) as f64
        }).collect()
    }
    SampleFormat::Int24 => {
      data
        .chunks_exact(3)
        .map(|chunks| {
          // no i24, so we take 3 bytes + 0x00 
          // to fill out hi byte in i32
          let low_part: [u8; 3] = chunks.try_into().expect("Could not import as 24-bit");
          let high_part: [u8; 1] = [0x00];
          let mut joined: [u8; 4] = [0; 4];
          
          joined[3..].copy_from_slice(&high_part);
          joined[..3].copy_from_slice(&low_part);
          
          (i32::from_le_bytes(joined) >> 8) as f64
        }).collect()
    }
    SampleFormat::Int32 => {
      data
        .chunks_exact(4)
        .map(|chunks| {
          // bit-shift based on using 16-bit wav at output
          (i32::from_le_bytes(chunks.try_into().expect("Could not import as 32-bit")) >> 16) as f64
        }).collect()
    }
  };
}
```

For the 16-, 24-, and 32-bit versions, I need the ```.chunks_exact()``` function, which returns an iterator over a slice of the specified length. The function ```from_le_bytes()``` takes in an array of bytes and converts them into a single little-endian number. The type (e.g., in ```i32::from_le_bytes```) specifies which version of the function to use. For the 24-bit version, there is no 24-bit integer type, so I use a 32-bit integer and fill the upper byte with zeroes. For the 8-bit version, I simply get an iterator for the ```data``` variable. 

All of these use ```.map()``` to process each value in the ```Vec<u8>```, and ```.collect()``` collects those processed values into a new ```Vec<f64>``` for processing by the audio filter.


### Filtering

```rust
// make filter
let mut filter = biquad::AudioFilter::new();
filter.calculate_filter_coeffs();
// vec in which to process sound
let mut filtered_vec = Vec::<i16>::new();
// filter audio
for sample in &converted_data {
  let filtered_samp = filter.process_sample(*sample * 0.4);
  filtered_vec.push(filtered_samp as i16);
}
```