---
title: Databending Part 1
description: Did you know you can listen to pretty much any file as an audio file? In this post I'll explain how it works, and in the next, I'll go into more depth about composing with these sounds.
canonical_url: https://reillyspitzfaden.com/posts/2025/01/databending-part-1
date: 2024-01-01
octothorpes:
  - Audio
  - music
tags:
  - post
  - databending
  - music
  - sounddesign
---
Let's start today off with some sounds right out of the gate:

<audio controls>
  <source src="/media/blog/2025/01/Finale.7_23.mp3" type="audio/mp3">
</audio>

What you're listening to is a segment of the recently departed [Finale](https://en.wikipedia.org/wiki/Finale_(scorewriter)) notation program being treated as an audio file. Notice how the tone and [envelope](https://en.wikipedia.org/wiki/Envelope_(music)) *almost* sound like a drum machine. The rhythm is in a wonderful place between random and regular — there are sequences of sounds that almost repeat, and that almost sound like a kick-snare dance beat, but it's not *quite* regular enough to dance to. It reminds me of the rhythmic qualities of some of Autechre's music (see e.g., <cite>[Tapr](https://autechre.bandcamp.com/track/tapr)</cite> at around 1 minute, or <cite>[VI Scose Poise](https://autechre.bandcamp.com/track/vi-scose-poise)</cite>).

This process of treating non-audio data as if it is audio (along with other such artistic data reinterpretations) is often called "[databending](https://en.wikipedia.org/wiki/Databending)." Today I'll talk about how this reinterpretation works for audio, how to do it using simple tools such as [Audacity](https://www.audacityteam.org/), and what kinds of files tend to produce different kinds of sounds. In further post(s), I will dive deeper into analyzing music and art that uses this and similar techniques — both my and others' work.

### How It Works

First, sound is compressions and rarefactions (i.e., the opposite of compression) in the air or another substance ([see an animation here](https://www.youtube.com/watch?v=z_gxBUP1aec&t=49s)). These increases and decreases in pressure can be represented as a rising and falling line. In a [digital audio](https://en.wikipedia.org/wiki/Digital_audio) file, we take repeated readings or "samples" of this rising and falling pressure at very rapid intervals in time, and represent the height of the rising and falling line at each reading using an integer value.

Since any computer file is just a list of numbers — binary values stored on the computer's drive — we can take the list of numbers from any file and treat them as a list of amplitudes in an audio file. For significant portions of many files, the resulting audio mostly sounds like white noise, but most files have at least some stretches in which percussive rhythms and glitchy, buzzing pitches appear.

### How to Do It

In Audacity, go to File > Import > Raw Data, choose any file and import it. The "Raw Data" import instructs Audacity to ignore the encoding of the original file (executable, document, image, library, etc.) and allows any file to be treated as audio. There are a number of settings in the "Import" menu, but this is enough to get started. I usually use signed 16-bit PCM, default endianness, one channel, and 44100 Hz for the sample rate. I chose 16 bits and 44100 Hz because those are the values in CD-quality audio, one channel so all the data is laid out linearly in a single sound, and default [endianness](https://en.wikipedia.org/wiki/Endianness) because it seems to often produce the clearest results.

### What Kinds of Files?

Since I primarily use macOS and some Linux, this discussion will be most specific to those OSes, but similar things work well on Windows. The files I find work best are [binary](https://en.wikipedia.org/wiki/Binary_file) program files — Unix [executable files](https://en.wikipedia.org/wiki/Executable) and libraries. While all computer files use binary code in some form, "binary file" usually refers to a file that does not encode text. Let's compare a snippet of a PDF and one from a binary [shared library](https://en.wikipedia.org/wiki/Library_(computing)) file.

This is an excerpt of the audio generated from a PDF. ^[ This is from a copy of <cite>Digital Folklore</cite> (2009) by Olia Lialina, Dragan Espenschied, and Manuel Buerger. ] Other than white noise, the entire file sounds almost exactly like this. Note the rapid "tremolo" effect. My best guess is that this is because text is fairly repetitive from a data perspective — a small number of characters grouped into short words, separated by spaces and paragraph breaks. Rapid repetition of short blocks of similar data sounds like a rhythmic tremolo:

<audio controls>
  <source src="/media/blog/2025/01/Olia-Lialina-Dragan-Espenschied-Digital-Folklore-01.mp3" type="audio/mp3">
</audio>

It's certainly an interesting enough sound, but since the entire file sounds essentially the same, I don't find it as productive to look at text files, PDFs, etc.

This next recording is an excerpt of the file [`libicudata.73.dylib`](https://docs.oracle.com/cd/E36784_01/html/E36873/libicudata-3lib.html) found in the [Calibre](https://calibre-ebook.com/) E-book manager on macOS. A macOS application (`.app`) is technically a folder, and Audacity will refuse to import folders as raw data. To get to this binary file, right-click, "Show Package Contents," and look in Contents > Frameworks. There are usually a number of folders in macOS applications, and any binary file can potentially be interesting. I usually look for ones that are at least a few megabytes in size — since a good portion of most files is white noise, the "interesting" parts of small files are rarely as long and varied as I would like:

<audio controls>
  <source src="/media/blog/2025/01/libicudata.73.dylib-01.mp3" type="audio/mp3">
</audio>

I want to draw your ears to the rhythmic character of this sound. The PDF had two elements — a low motor-like buzz, and a burst of white noise — and rapidly "toggles" between them. In contrast, this library file has high "wheedling" tones; medium-register "beeps" that poke out through the texture; chugging, clicking noises that remind me of a receipt printer; low tones that rapidly bend up and down; sustained, buzzing bass notes; and many other small nuances. These are the kinds of sounds I tend to seek out for composing: rhythmically interesting, containing a mix of pitched and percussive elements, and varied in character.

### Challenges

Another fascinating aspect of this sound is apparent when re-listening to the excerpt of the Finale binary file at the start of today's article. The two files contain some of the same sounds!

This creates a challenge in finding new sounds. Similar to what I mention about digital radio transmissions in the "challenges" section of [this post](https://reillyspitzfaden.com/posts/2024/12/radio-listening-musically/), once you listen to the "sonified" data from enough files, commonalities start to become apparent. Many programs use some of the same `.dylib` files, and I imagine Finale either contains this exact file or some of the component code this file uses. The second seems more likely to me, given that a number of other `.dylib` files or program binary files contain the same or similar sounds, and are often smaller than the ~64.7MB of `libicudata.73.dylib`.

The process of finding these sounds is also fairly slow and painstaking. ^[ When I import the files, there is a good deal of [DC offset](https://en.wikipedia.org/wiki/DC_bias) and sub-20 Hz noise, and the file is usually at max amplitude. I filter out the frequencies below 20 Hz on each file. This is both useful to remove "mud" and to make it easier to visually distinguish between parts of the audio — what was originally a flat peak amplitude becomes more varied when removing DC offset/infrasound. To make room for the new variation in amplitude, I also have to lower the amplitude prior to filtering. ] After importing and cleaning up the files, there is a huge amount of material to get through, and since the way I divide up the source material is relevant to the composition process, it takes a good deal of back and forth between the long audio files and the composition I'm currently writing before I settle on exactly where my samples should start and end.

Something interesting to check out is James Bradbury's [FluCoMa](https://www.flucoma.org/) plenary talk titled "[Finding Things in Stuff](https://www.youtube.com/watch?v=IpD_XzW1Az4)," in which he uses Python and the FluCoMa ("Fluid Corpus Manipulation") toolkit for Max/MSP, SuperCollider, and Pure Data to find the "interesting" sections of databending sessions. I haven't tried his methods yet, but they look promising for speeding up the search.

### Where I've Used Databending
<cite>Afterimage from</cite>
- chugging rhythmic patterns in opening
- chaotic glitches in delay loop
- high tones at end

<cite>Outlive everything you know</cite>
- opening, with data at low sample rate

<cite>If this reaches you</cite>
- low, staticky, rhythmic sound

Since writing <cite>Afterimage from</cite> back in 2021 in particular, I've shied away from heavy use of databending sounds, since <cite>Afterimage from</cite> covered a significant portion of the ground available for these sounds.

Tried Windows/Linux

### Looking Forward
I'm also planning to write a part 2 that goes into a bit more depth analyzing and discussing works that use this approach. There are a number of composers I like who do this, and I think it'll be interesting to collect my responses to their music in one place. I hope to see you then!