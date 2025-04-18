---
title: Databending Part 4 — Codecs & Realtime Glitches
description: Today I'm returning to a lo-fi cellphone codec plugin, and I'm breaking/glitching the codec in real time!
fedi_url:
date: 2025-05-01T00:00:00-0400
octothorpes:
  - Art
  - Audio
  - audio
  - music
  - sound
tags:
  - post
  - codec
  - databending 
  - mp3 
  - music 
  - sounddesign
post_series: databending
draft: true
---

I started a plugin, “[RS Telecom](https://github.com/reillypascal/RSTelecom)” a while ago that imitates the [GSM 06.10](https://en.wikipedia.org/wiki/Full_Rate) cell phone codec, and the [µ-law](https://en.wikipedia.org/wiki/%CE%9C-law_algorithm) and [A-law](https://en.wikipedia.org/wiki/A-law_algorithm) 8-bit formats. I originally wanted to include glitching of the GSM codec, as well as further lossy formats, and with my recent [success at glitching MP3s](/posts/2025/04/databending-part-3/), I wanted to return to this project.