---
title: "Reverb Part 2: Classic Lexicon Units & Allpass Rings"
description: I discuss a lovely-sounding family of reverb algorithms that appears in the classic Lexicon 224/480 units, among many other places
fedi_url:
og_image:
og_image_width:
og_image_height:
date: 2025-09-30T12:30:00-0400
octothorpes:
  - Audio
  - audio
  - music
tags:
  - post
  - reverb
  - audio
  - cpp
  - juce
  - programming
  - maxmsp
post_series: reverb
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

Continuing from [a previous post](/posts/2025/06/reverb-part-1), today we'll be looking at another collection of reverb algorithms that I've implemented in my [reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb/releases).

My main reference for the theory behind this is the article “[A Realtime Multichannel Room Simulator](https://pubs.aip.org/asa/jasa/article/92/4_Supplement/2395/646024/A-real-time-multichannel-room-simulator)” by Bill Gardner. [^1]

## Allpass Rings

### Nested Allpass Filters

https://ccrma.stanford.edu/~jos/pasp/Nested_Allpass_Filters.html

### Multiple Taps in a Delay

## Dattorro, Griesinger, and the Lexicon LX244/LX480

[^1]: W. G. Gardner, “A realtime multichannel room simulator,” _J. Acoust. Soc. Am_, vol. 92, no. 4, p. 2395, 1992. Available: https://pubs.aip.org/asa/jasa/article/92/4_Supplement/2395/646024/A-real-time-multichannel-room-simulator
