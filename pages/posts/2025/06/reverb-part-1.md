---
title: Reverb Part 1
description: I discuss how several kinds of algorithmic reverb work, and I return to a VST/AU plugin I coded in C++/JUCE
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-06-06T12:30:00-0400
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

feedforward delay

<figure>

![block diagram of a feedforward delay/comb filter](/media/blog/2025/06/reverb/feedforward_comb.webp)

<figcaption>Feedforward delay/comb filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp04/Feedforward_Comb_Filters.html">Julius O. Smith</a>)</figcaption>
</figure>

feedback delay

<figure>

![block diagram of a feedback delay/comb filter](/media/blog/2025/06/reverb/feedback_comb.webp)

<figcaption>Feedback delay/comb filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Feedback_Comb_Filters.html">Julius O. Smith</a>)</figcaption>
</figure>

feedforward delay amplitude

<figure>

![feedforward comb filter amplitude plot](/media/blog/2025/06/reverb/feedforward_comb_amp.webp)

<figcaption>Feedforward comb filter amplitude plot (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp05/Feedforward_Comb_Filter_Amplitude.html">Julius O. Smith</a>)</figcaption>
</figure>

feedback delay amplitude

<figure>

![negative feedback comb filter amplitude plot](/media/blog/2025/06/reverb/feedback_comb_neg_amp.webp)

<figcaption>Negative feedback comb filter amplitude plot (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp05/Feedback_Comb_Filter_Amplitude.html">Julius O. Smith</a>)</figcaption>
</figure>

allpass filter

<figure>

![block diagram of an allpass filter](/media/blog/2025/06/reverb/allpass_from_2_combs.webp)

<figcaption>Allpass filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Allpass_Two_Combs.html">Julius O. Smith</a>)
</figure>

## Reverb Algorithms

### The Classic Schroeder Reverb

### Allpass Rings

### Feedback Delay Networks (FDNs)