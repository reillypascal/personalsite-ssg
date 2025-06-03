---
title: "Reverb Part 1: Introduction and a VST/AU Plugin"
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

<link rel="stylesheet" type="text/css" href="/styles/math/katex.min.css" />

I started work on a [reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb) in C++/JUCE back in 2023, and I've slowly added to it since. Today, I'm going to discuss how algorithmic (i.e., delay-based) reverbs work and some different designs, as well as an overview of my plugin and some JUCE resources. Let's get started!

## How Reverb Works

There are two main categories of digital reverb: [convolution)](https://www.bhphotovideo.com/find/newsLetter/Convolution-Reverb.jsp/) and algorithmic, and today we will be discussing algorithmic reverb. An algorithmic reverb is based on a network of delays, with individual delays roughly corresponding to the sound reflections from individual walls or objects, and the network of connections between them simulating the way a reflection from one surface may bounce off many others.

Sean Costello of Valhalla DSP has a [series](https://valhalladsp.com/2021/09/22/getting-started-with-reverb-design-part-2-the-foundations/) of [posts](https://valhalladsp.com/2021/09/23/getting-started-with-reverb-design-part-3-online-resources/) giving [helpful resources](https://valhalladsp.com/2021/09/28/getting-started-with-reverb-design-part-4-books/) on reverb design, including influential papers, online resources, and books, and you can find many of the algorithms we'll discuss today in the papers he mentions.

### Delays and Allpasses

In the most basic form of delay, we take a copy of the incoming audio signal, delay it by a certain amount, and combine it with the original signal, usually with the option to adjust the proportions of original and delayed copies. To contrast with the other types of delay, this is often referred to as a “feedforward” delay—the delayed copy is simply recombined with the original without any “feedback,” which we will discuss in the next section. 

<!-- This delay configuration is also referred to as a “comb filter”; as we will see shortly, it produces an amplitude curve that resembles a comb. -->

In the diagram below, $x(n)$ represents the incoming signal; $z^{-M}$ is the delay; [^1] $b_0$ and $b_M$ represent the amount of gain applied to the original and delayed copies respectively; [^2] the $+$ symbol represents summing the two copies; and $y(n)$ is the output signal. 

<figure>

![block diagram of a feedforward delay/comb filter](/media/blog/2025/06/reverb/feedforward_comb.webp)

<figcaption>Feedforward delay/comb filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp04/Feedforward_Comb_Filters.html">Julius O. Smith</a>)</figcaption>
</figure>

Next, we have a “feedback” delay. Note how in the diagram below, the incoming signal is summed with the output of the delay *before* entering the delay; the gain $-a_M$ applied to the fed-back output of the delay is *negative*; and the output of the whole delay is taken from that sum of the input and feedback *before* it enters the delay.

<figure>

![block diagram of a feedback delay/comb filter](/media/blog/2025/06/reverb/feedback_comb.webp)

<figcaption>Feedback delay/comb filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Feedback_Comb_Filters.html">Julius O. Smith</a>)</figcaption>
</figure>

Below I have the amplitude curves from feedforward and feedback delays, caused by [constructive and destructive interference](https://www.phys.uconn.edu/~gibson/Notes/Section5_2/Sec5_2.htm). The curve of the feedforward delay is caused by destructive interference; adding the delay to the original signal causes certain frequencies to cancel out. In the feedback example, as the sound feeds back on itself, certain frequencies constructively interfere; they reinforce each other and create the “spikes” in the amplitude response.

<figure>

![feedforward comb filter amplitude plot](/media/blog/2025/06/reverb/feedforward_comb_amp.webp)

<figcaption>Feedforward comb filter amplitude plot (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp05/Feedforward_Comb_Filter_Amplitude.html">Julius O. Smith</a>)</figcaption>
</figure>

<figure>

![negative feedback comb filter amplitude plot](/media/blog/2025/06/reverb/feedback_comb_neg_amp.webp)

<figcaption>Negative feedback comb filter amplitude plot (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp05/Feedback_Comb_Filter_Amplitude.html">Julius O. Smith</a>)</figcaption>
</figure>

Notice how the feedforward and feedback amplitude responses are the inverse of each other. As [shown here](https://ccrma.stanford.edu/~jos/pasp05/Feedback_Comb_Filter_Amplitude.html), having a negative gain in the feedback loop of a feedback delay is necessary for the peaks to align with the troughs in a feedforward delay that has an equivalent delay time. This alignment is important for our next type of filter: the “allpass” filter. As shown below, we combine a feedforward delay with a feedback delay that has a negative gain on the feedback. As a result, our peaks and troughs in the frequency response cancel out. This kind of delay configuration has a “flat” frequency response; all frequencies pass through at the same loudness. 

<figure>

![block diagram of an allpass filter](/media/blog/2025/06/reverb/allpass_from_2_combs.webp)

<figcaption>Allpass filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Allpass_Two_Combs.html">Julius O. Smith</a>)</figcaption>
</figure>

In contrast to the frequency response, our time response is much more complex. An allpass filter delays the different frequencies in the signal by different amounts. As a result, a single impulse or “click” going through it would become multiplied and “smeared” in time, giving the effect of multiple clicks piling on top of each other, a very useful effect for creating a smooth- and dense-sounding reverb.

### Implementing Delays & Allpasses in JUCE

The [JUCE](https://juce.com/) C++ framework is a popular way to make audio plugins, and it's what I will use today. I won't go into too much background on it; if you want a good introduction, I would start with [the official tutorials](https://juce.com/learn/tutorials/) and then look at [The Audio Programmer's YouTube channel](https://www.youtube.com/theaudioprogrammer) and/or [the books from that group](https://www.theaudioprogrammer.com/books). If you want to learn C++, I used [Sams Teach Yourself C++ in One Hour a Day](https://www.oreilly.com/library/view/sams-teach-yourself/9780137334674/) by Siddhartha Rao.

First, to make a basic delay, I use 

```c++

```

## Reverb Algorithms

### The Classic Schroeder Reverb

### Allpass Rings

### Feedback Delay Networks (FDNs)

[^1]: This notation comes from the idea of the [Z-transform](https://en.wikipedia.org/wiki/Z-transform).

[^2]: Note that the triangle symbol is the standard DSP symbol for amplification/an amplifier.