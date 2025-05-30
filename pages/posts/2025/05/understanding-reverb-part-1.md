---
title: Understanding Reverb Part 1
description: I discuss how several kinds of algorithmic reverb work, and I return to a VST/AU plugin I coded in C++/JUCE
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-30T11:26:36-0400
octothorpes:
  - Art
  - Audio
  - audio
  - music
tags:
  - post
  - juce
  - c++
  - plugin
  - dsp
  - reverb
post_series: 
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

I started work on a [reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb) in C++/JUCE back in 2023, and I've slowly added to it since. Today, I'm going to discuss how algorithmic (i.e., delay-based) reverbs work and some different designs, as well as an overview of my plugin and some JUCE resources. Let's get started!

## How Reverb Works

Sean Costello of Valhalla DSP has a [series](https://valhalladsp.com/2021/09/22/getting-started-with-reverb-design-part-2-the-foundations/) of [posts](https://valhalladsp.com/2021/09/23/getting-started-with-reverb-design-part-3-online-resources/) giving [helpful resources](https://valhalladsp.com/2021/09/28/getting-started-with-reverb-design-part-4-books/) on reverb design, including influential papers, online resources, and books.

### Delays and Allpasses

## Reverb Algorithms

### The Classic Schroeder Reverb

### Allpass Rings

### Feedback Delay Networks (FDNs)