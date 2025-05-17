---
title: Databending Part 4 — Data to Audio with a Rust Tool
description: Manually importing data as audio in Audacity sounds super cool but takes a while and slows down my composition. Today I'm automating it in Rust!
fedi_url: 
  - https://hachyderm.io/@reillypascal/114434723302418270
  - https://bsky.app/profile/reillypascal.bsky.social/post/3lo5b7trn722x
og_image: /media/blog/2025/05/databending-part-4/libicudata.73.1.jpg
og_image_width: 1200
og_image_height: 630
date: 2025-05-01T17:24:00-0400
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
post_series: databending
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

Earlier this year I [wrote](/posts/2025/01/databending-part-1/) about how to import any file into Audacity and convert it to audio. Today I want to make the process less tedious, as well as get some practice with the [Rust](https://en.wikipedia.org/wiki/Rust_(programming_language)) programming language. 

When I first wrote about this process, I mentioned that

> once you listen to the “sonified” data from enough files, commonalities start to become apparent…\[and] the process of finding these sounds is also fairly slow and painstaking.

In addition to simply speeding up the search for interesting files, automation also makes it more practical to “audition” different *ways* of importing a given interesting file. I usually convert the data into an audio file in which each “sample” is a [16-bit integer](https://en.wikipedia.org/wiki/Audio_bit_depth) — in many cases, I find I like the sound result of this best. However, treating it as an 8-bit, 24-bit or 32-bit integer (or some of the more unique sample formats available in Audacity, such as [ADPCM](https://en.wikipedia.org/wiki/Differential_pulse-code_modulation)) can give additional variety and get around the sonic commonalities I mentioned.

<aside id="adpcm" class="post-body-aside">

The ADPCM input format is still in the works, but just because I like to include audio at the start of things, I want to take a brief sidebar about why ADPCM could be cool. Audacity has the VOX or [Dialogic ADPCM](https://en.wikipedia.org/wiki/Dialogic_ADPCM) flavor as one of its import formats, and I've had some interesting results importing data using it and similar formats. 

If my math is correct, the audio examples here should be from the same portion of the source data (the ```libicudata.73.1``` library file from the macOS release of the [calibre](https://calibre-ebook.com/) e-book manager). The first one is imported in Audacity as signed 16-bit integer at 44.1 kHz sampling rate:

<audio controls src="/media/blog/2025/05/databending-part-4/libicudata.73.1 i16.mp3" title="libicudata.73.1 imported to Audacity as 16-bit audio"></audio>

The second is imported into Audacity as VOX ADPCM (also at 44.1 kHz):

<audio controls src="/media/blog/2025/05/databending-part-4/libicudata.73.1 VOX ADPCM.mp3" title="libicudata.73.1 imported to Audacity as VOX ADPCM audio"></audio>

The VOX ADPCM file is 4x as long (since it only uses 4 bits per sample, instead of 16), and the result is *sort of* like a time-stretched version of the 16-bit one, but the voice-focused algorithm of the VOX ADPCM format introduces new strange characteristics as well.

</aside>

Anyway, my Rust tool is still a work in progress, but I thought I'd do a writeup of what I have so far. If you want to use it or just follow along, the code is available [here on GitHub](https://github.com/reillypascal/data2audio) — if you're comfortable using Rust's ```cargo``` package manager, it should be usable, and I'll look into providing compiled releases at some point! You can hear the result of this tool here:

<audio controls src="https://media.hachyderm.io/media_attachments/files/114/410/358/926/835/338/original/5a33b44d29ec6fba.mp3" title="databent audio using my Rust tool"></audio>

### Importing the Files

As a refresher on the databending process, I wrote in the first post that in digital audio files

> we take repeated readings or “samples” of this rising and falling \[air] pressure at very rapid intervals in time (the “sample rate”), and represent the height of the rising and falling line at each reading using an integer value.

> Since any computer file is just a list of \[binary] numbers…we can take the list of numbers from any file and treat them as a list of amplitudes in an audio file.

First, we want to import files as a list of bytes, and we want to be able to traverse through a large folder of files, with possible sub-folders. The [walkdir](https://crates.io/crates/walkdir) Rust crate is useful for traversing directories, and [these examples](https://rust-lang-nursery.github.io/rust-cookbook/file/dir.html#recursively-find-all-files-with-given-predicate) from the Rust Cookbook are a good model. ```WalkDir::new()``` returns a recursive iterator into the directory, and we can check if the metadata is good; check if the metadata says an entry is a file and is bigger than the minimum size we've chosen (0 is the default); and if so, use ```fs::read()``` to read in the file. ```fs::read()``` returns a ```Result<Vec<u8>>```, so we can use ```.expect()``` to get the vector out of the ```Result<T,E>```.

```rust
use std::fs;
use walkdir::WalkDir;

fn main() {
  // WalkDir "walks" recursively through a directory and all its subfolders
  // args.input is from CLI arguments via clap
  WalkDir::new(&args.input)
    .into_iter()
    .filter_map(|entry| entry.ok())
    .for_each(|entry| {
      // extract metadata from Result<T,E> for each entry in dir
      if let Ok(metadata) = entry.metadata() {
        // if it's a file and greater/equal to min size (from CLI args via clap)
        if metadata.is_file() && metadata.len() >= args.min {
          // ...read in file as a vector of unsigned 8-bit integers
          let data: Vec<u8> = fs::read(entry.path()).expect("Error reading file");
        }
      }
    });
}
```

### Converting Files to Audio

I'm using the [clap](https://crates.io/crates/clap) crate to handle command-line arguments. I won't get into too much detail here, but just to cover where it shows up, ```WalkDir::new(&args.input)``` above is taking an input path from these arguments, but that could be replaced with another source of ```&str```/```&String``` reading e.g., ```"input"```; ```args.min``` above is an integer giving the minimum filesize in bytes, and defaulting to 0; and below, the user's choice of sample format is recorded as one of the options in my ```SampleFormat``` enum, which derives from ```clap```'s ```ValueEnum```.

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

Picking up where we left off when importing the file, I can take that ```Vec<u8>``` holding our file data and, depending on the sample format, convert it to appropriately-sized values. If the contents of the “arms” of a Rust ```match``` statement are an [expression](https://doc.rust-lang.org/book/ch03-03-how-functions-work.html#statements-and-expressions), you can have something like ```let converted_data: Vec<f64> = match args.format {}```, and the variable ```converted_data``` will hold the appropriate value, based on the arm chosen. In this case, simply not putting a semicolon after (e.g.) ```data.chunks_exact(2).map().collect()``` causes that piece of code to be an expression. 

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
          // get values from chunks_exact(3), put in array
          let low_part: [u8; 3] = chunks.try_into().expect("Could not import as 24-bit");
          // no i24, so we add this 0x00 to fill out hi byte in i32
          let high_part: [u8; 1] = [0x00];
          // copy to "joined" from low/hi parts as slices
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

For the 16-, 24-, and 32-bit versions, I need the ```core::slice::chunks_exact()``` function, which returns an iterator over a slice of the specified length. The function ```from_le_bytes()``` takes in an array of bytes and converts them into a single little-endian number. The type (e.g., in ```i32::from_le_bytes()```) specifies which version of the function to use. For the 24-bit version, there is no 24-bit integer type, so I use a 32-bit integer and fill the upper byte with zeroes. For the 8-bit version, I simply get an iterator over the ```data``` ```Vec<u8>```. All of the ```match``` “arms” use ```.map()``` to process each value in the ```Vec<u8>```, and ```.collect()``` collects those processed values into a new ```Vec<f64>``` for processing by the audio filter.

Note that all the sample formats except 16-bit integer use the bit-shift operators (```<<``` or ```>>```) to scale the values to the range needed to output a 16-bit WAV file. 16 bits is plenty to get good-quality sound, and the input formats are primarily for the different sound results, so I'm fine with converting everything to 16-bit at the end. I temporarily convert everything to floating point numbers for filtering because the filter math is nicer to work with that way.


### Filtering

I wrote [the filter](https://github.com/reillypascal/rs_rust_audio) I'm using here myself over summer 2024. Filter math gets *intense* really fast (and I can only barely muddle through it myself!) so I won't go into it here, but I'll put some reading materials/references in the footnotes if you're interested in reading further. [^1] [^2] In short, I have a filter module called ```biquad```; ```biquad::AudioFilter::new()``` creates a filter; ```filter.calculate_filter_coeffs()``` sets it up; and ```filter.process_sample()``` takes in the audio, one ```f64``` sample at a time, returning another ```f64``` on each pass. All this ends up cast as 16-bit integers in a ```Vec<i16>``` to be written to the WAV file. Note that I multiply each sample by 0.4 before filtering — this is necessary because filtering out sub-audible noise results in higher peaks in the sound, so I need more headroom to compensate.

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

### Writing to WAV

I create a [PathBuf](https://doc.rust-lang.org/std/path/struct.PathBuf.html) from the output path selected by the user, which defaults to ```output/```. This uses the ```clap``` crate (which again, I'm not covering to save time), but ```&args.output``` could be replaced with another source of ```&str```/```&String``` reading e.g., ```"output"```. ```create_dir()``` uses ```fs::create_dir_all()```, which the [documentation](https://doc.rust-lang.org/beta/std/fs/fn.create_dir_all.html) says is equivalent to multiple ```mkdir``` calls on a Unix-like system. I can then use ```PathBuf::push()``` to add the file name (taken from the entry's path), and ```PathBuf::set_extension()``` to change the previous file extension to ```.wav``` before using my ```write_file_as_wav()``` function.

```rust
// args.output is from CLI arguments via clap
let mut write_path = PathBuf::from(&args.output);
// create output dir if doesn't exist - create_dir returns Result<T,E>, so match it and print if error
let out_dir = create_dir(&args.output);
match out_dir {
  Ok(()) => {},
  Err(e) => {
    eprintln!("{}", e)
  },
};
// entry.path().file_name() returns an Option, so if let Some() handles/extracts value
if let Some(file_name) = entry.path().file_name() {
  write_path.push(file_name);
  write_path.set_extension("wav");
  write_file_as_wav(filtered_vec, write_path);
}

// ...

fn create_dir(dir: &str) -> std::io::Result<()> {
    // create_dir_all - like multiple mkdir calls
    fs::create_dir_all(dir.to_string())?;
    Ok(())
}

```

I use the [```hound```](https://crates.io/crates/hound) crate to handle writing WAV files (see [documentation](https://docs.rs/hound/latest/hound/struct.WavWriter.html) for ```hound```'s ```WavWriter``` struct). In addition to the filename, ```hound::WavWriter::create()``` requires a “spec” giving the number of channels, sample rate, sample [bit depth](https://en.wikipedia.org/wiki/Audio_bit_depth), and the sample format (from the ```hound::SampleFormat``` enum). Once I have an appropriate ```WavWriter``` made, I write the file one sample at a time with the ```hound::WavWriter::write_sample()``` method, after which I need to call ```hound::WavWriter::finalize()``` to update the WAVE header with the final file size.

```rust
use hound;

// ...

fn write_file_as_wav(data: Vec<i16>, name: path::PathBuf) {
  // write WAV file
  // spec
  let spec = hound::WavSpec {
    channels: 1,
    sample_rate: 44100,
    bits_per_sample: 16,
    sample_format: hound::SampleFormat::Int,
  };
  
  // writer
  let mut writer = hound::WavWriter::create(name, spec).expect("Could not create writer");
  for t in 0..data.len() {
    writer.write_sample(data[t]).expect("Could not write sample");
  }
  writer.finalize().expect("Could not finalize WAV file");
}
```

### Summary and Future Goals

To review:
  1. We use the [walkdir](https://crates.io/crates/walkdir) crate and ```fs::read()``` to recursively traverse the files in the folder and open each as a ```Vec<u8>```
  2. The [clap](https://crates.io/crates/clap) crate handles CLI arguments, including selecting the input sample format.
  3. We use ```core::slice::chunks_exact()``` and (e.g.) ```i16::from_le_bytes()``` to convert groupings of bytes into 16-, 24-, or 32-bit samples.
  4. We use a biquad [filter](https://github.com/reillypascal/rs_rust_audio) I wrote to cut out sub-audible frequencies, casting to/from 64-bit floats for the filtering.
  5. Finally, we use a ```WavWriter``` struct from the [hound](https://crates.io/crates/hound) crate to write each WAV file.

I mentioned the [ADPCM](https://en.wikipedia.org/wiki/Differential_pulse-code_modulation) sample format at the start, and one of my next goals is to include that option when importing files. The [symphonia](https://lib.rs/crates/symphonia#readme-codecs-decoders) Rust crate has an ADPCM decoder (sadly not the VOX version — symphonia [has Microsoft and IMA flavors](https://lib.rs/crates/symphonia-codec-adpcm#readme-support)). I'll need to do some poking around to figure out how to use it, but I definitely plan to do so in the near future.

I hope to see you again soon!

[^1]: Steven W. Smith, “The Scientist and Engineer’s Guide to Digital Signal Processing,” accessed April 30, 2025, https://www.dspguide.com/. This one is a bit older (and includes some BASIC and FORTRAN examples), but it's freely available online, the math parts are very helpful, and I overall greatly appreciate that it targets those with less math experience, while still being thorough.

[^2]: Will Pirkle, Designing Audio Effect Plugins in C++: For AAX, AU, and VST3 with DSP Theory (Routledge, 2019), https://www.taylorfrancis.com/books/mono/10.4324/9780429490248/designing-audio-effect-plugins-pirkle. Chapters 10–12 in this one have a good discussion of filter math, and I (very loosely) based my filter on some of the examples here.