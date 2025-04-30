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

The code for the tool is available on GitHub at [this link](https://github.com/reillypascal/data2audio).

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

```rust
#[derive(ValueEnum, Clone, Debug)]
enum SampleFormat {
    Uint8,
    Int16,
    Int24,
    Int32,
}

```


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