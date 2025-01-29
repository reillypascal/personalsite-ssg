---
title: Databending Part 2 — Hacking MP3s
description: 
canonical_url: https://reillyspitzfaden.com/posts/2025/01/databending-part-2
date: 2025-01-31
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
---
<link rel="stylesheet" type="text/css" href="/styles/tables.css" />


I [recently posted](https://reillyspitzfaden.com/posts/2025/01/databending-part-1/) about “databending,” which includes importing raw data into Audacity to make glitchy noises, changing the data in an image using a text/hex editor, and many other ways of creatively reinterpreting/damaging data. Since writing that post, I've learned some more fun ways of creating glitchy sounds with data, and I'll be discussing that today.

### Hacking MP3s

Nick Briz [^1] writes about hacking mp3s in a hex editor

Yasunao Tone — cool sounds, but the process it not particularly connected to MP3s


### MP3 Headers

Hex |  Binary | Meaning |
--- | ------- | ------- |
F | 1111 | All four bits are part of the MP3 sync code (used to find the header). |
F | 1111 | All four bits are part of the MP3 sync code. |
F | 1111 | The first three bits are part of the MP3 sync code. The last bit, in combination with the next bit below (i.e., 11), tells us which MPEG version this was encoded with. In this case 11 translates to MPEG version 1. |
B | 1011 | The first is used to determine the MPEG version (see prior), the second and third bit tell us the layer (i.e., 01, which is Layer 3), and the last bit tells us if there is copy protection (i.e., 1). In this case there is no protection; if there was the last bit would be a 0. |
A | 1010 | This byte (all four bits) tell us the bitrate; in this case 1010 is a bitrate of 160 kbps. |
0 | 0000 | This byte tells us the sample rate, in this case 0000 is a sample rate of 44,100 Hz. Had it been 0100, this would be a sample rate of 48,000 Hz, or 1000 would be a sample rate of 32,000 Hz. |
4 | 0100 | The first two bits contain channel information; in this case 01 means Join Stereo. When set to Joint Stereo (like this example), the latter two bits tell us the mode of joint stereo. |
0 | 0000 | The first bit tells us if the MP3 file has a copyright (0 means it does not), the next bit tells us if it’s a copy of the original file or not (0 means it is). The last two bits tell us if there are empha­ sized frequencies (00 means there are not). |

An example of an MP3 frame header, FF FB A0 40, and its meaning. [^2]

[^1]: Nick Briz, “Data Hacking: The Foundations of Glitch Art,” in [Handmade Electronic Music, 3rd ed.](https://www.nicolascollins.com/handmade.htm) (Routledge, 2020), 377–90.

[^2]: Ibid., 396

Li Tan and Jean Jiang, Digital Signal Processing: Fundamentals and Applications (Academic Press, 2018).
