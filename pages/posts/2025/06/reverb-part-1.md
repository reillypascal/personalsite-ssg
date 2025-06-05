---
title: "Reverb Part 1: Introduction and a VST/AU Plugin"
description: I discuss how algorithmic reverbs work, and I return to a VST/AU plugin I coded in C++/JUCE
fedi_url: 
og_image: /media/blog/2025/06/reverb_1/freeverb_og.jpg
og_image_width: 1200
og_image_height: 630
date: 2025-06-05T11:30:00-0400
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
  - schroeder
  - freeverb
post_series: 
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<link rel="stylesheet" type="text/css" href="/styles/math/katex.min.css" />

I started work on a [reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb) in C++/JUCE back in 2023, and I've slowly added to it since. Today, I'm going to discuss how algorithmic (i.e., delay-based) reverbs work and some different designs, as well as an overview of my plugin and some JUCE resources. Let's get started!

## How Reverb Works

There are two main categories of digital reverb—[convolution](https://www.bhphotovideo.com/find/newsLetter/Convolution-Reverb.jsp/) and algorithmic—and today we will be discussing algorithmic reverb. An algorithmic reverb is based on a network of delays or “echoes,” with individual delays roughly corresponding to the sound reflections from individual walls or objects, and the network of connections between them simulating the way a reflection from one surface may bounce off many others.

Sean Costello of Valhalla DSP has a [series](https://valhalladsp.com/2021/09/22/getting-started-with-reverb-design-part-2-the-foundations/) of [posts](https://valhalladsp.com/2021/09/23/getting-started-with-reverb-design-part-3-online-resources/) giving [helpful resources](https://valhalladsp.com/2021/09/28/getting-started-with-reverb-design-part-4-books/) on reverb design, including influential papers, online resources, and books, and you can find the algorithms we'll discuss today among the papers he mentions.

### Feedforward and Feedback Delays

In the most basic form of delay, we take a copy of the incoming audio signal, delay it by a certain amount, and combine it with the original signal, usually with the option to adjust the proportions of original and delayed copies. To contrast with the other types of delay, this is often referred to as a “feedforward” delay—the delayed copy is “fed forward” and recombined with the original without any “feedback,” which we will discuss in the next section. 

In the diagram below, $x(n)$ represents the incoming signal; $z^{-M}$ is the delay; [^1] $b_0$ and $b_M$ represent the amount of gain applied to the original and delayed copies respectively; [^2] the $+$ symbol represents summing the two copies; and $y(n)$ is the output signal. 

<figure>

![block diagram of a feedforward delay/comb filter](/media/blog/2025/06/reverb_1/feedforward_comb.webp)

<figcaption>Feedforward delay/comb filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp04/Feedforward_Comb_Filters.html">Julius O. Smith</a>)</figcaption>
</figure>

Next, we have a “feedback” delay. Note how in the diagram below, the incoming signal is summed with the output of the delay *before* entering the delay; the gain $-a_M$ applied to the fed-back output of the delay is *negative*; and the output of the whole delay $y(n)$ is taken from that sum of the input and feedback *before* it enters the delay.

<figure>

![block diagram of a feedback delay/comb filter](/media/blog/2025/06/reverb_1/feedback_comb.webp)

<figcaption>Feedback delay/comb filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Feedback_Comb_Filters.html">Julius O. Smith</a>)</figcaption>
</figure>

### Allpass Filters

Below I have the amplitude curves from feedforward and feedback delays, caused by [constructive and destructive interference](https://www.phys.uconn.edu/~gibson/Notes/Section5_2/Sec5_2.htm). The repeated notches in the feedforward delay frequency plot are caused by destructive interference; adding the delay to the original signal causes certain frequencies to cancel out. In the feedback example, as the sound feeds back on itself, certain frequencies constructively interfere—they reinforce each other and create the “spikes” in the amplitude response. Both of these delay configurations are also referred to as “comb filters,” due to the shape of the spikes and notches.

<figure>

![feedforward comb filter amplitude plot](/media/blog/2025/06/reverb_1/feedforward_comb_amp.webp)

<figcaption>Feedforward comb filter amplitude plot (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp05/Feedforward_Comb_Filter_Amplitude.html">Julius O. Smith</a>)</figcaption>
</figure>

<figure>

![negative feedback comb filter amplitude plot](/media/blog/2025/06/reverb_1/feedback_comb_neg_amp.webp)

<figcaption>Negative feedback comb filter amplitude plot (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp05/Feedback_Comb_Filter_Amplitude.html">Julius O. Smith</a>)</figcaption>
</figure>

Notice how the feedforward and feedback amplitude responses are the inverse of each other. Having a negative gain in the feedback loop of a feedback delay is necessary for the peaks to align with where the troughs would be in a feedforward delay that has the same delay time. As [shown here](https://ccrma.stanford.edu/~jos/pasp05/Feedback_Comb_Filter_Amplitude.html), if the feedback delay's gain were positive, the peaks would be at 0.2, 0.4, etc., instead of 0.1, 0.3, etc. 

This alignment is important for our next type of filter: the “allpass” filter. As shown below, we combine a feedforward delay with a feedback delay that has a negative gain on the feedback. As a result, our peaks and troughs in the frequency response cancel out. This kind of delay configuration has a “flat” frequency response; all frequencies pass through at the same loudness. 

<figure>

![block diagram of an allpass filter](/media/blog/2025/06/reverb_1/allpass_from_2_combs.webp)

<figcaption>Allpass filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Allpass_Two_Combs.html">Julius O. Smith</a>)</figcaption>
</figure>

In contrast to the frequency response, our time response is much more complex. An allpass filter delays the different frequencies in the signal by different amounts. As a result, a single impulse or “click” going through it would become multiplied and “smeared” in time, giving the effect of multiple clicks piling on top of each other, a very useful effect for creating a smooth- and dense-sounding reverb.

Now let's put these all together to make a reverb!

## The Classic Schroeder Reverberator

### Series Allpasses

Manfred Schroeder has two papers from 1961 that introduce the idea of allpasses and using them for reverberators.

In *“Colorless” Artificial Reverberation*, [^4] Schroeder and co-author B.F. Logan note six features that they seek from a delay-based reverberator:

1. There should be a flat frequency response
2. Normal modes (i.e., resonant emphases on specific frequencies) “must overlap and cover the entire audio frequency range”
3. Different frequencies should decay at the same or similar rate
4. There should be high echo density within a short period after an impulse
5. Echoes must be non-periodic (i.e., no “flutter echoes”)
6. “Periodic or comb-like” frequency responses must be avoided

Below, I have an 808 drum machine clap played through a feedback comb filter. The delay is set at successively shorter lengths, from 50ms down to 5ms. Notice how at longer delay times, there is a “fluttering” tremolo effect. This is similar to the echoes with two walls directly facing each other, as in a long, narrow hall. At shorter lengths, there is an audible tone created by the repeated echoes. Both of these features are undesirable in a reverb effect. 

<audio controls src="/media/blog/2025/06/reverb_1/clap_comb.mp3" title="feedback comb-filtered clap"></audio>

In *“Colorless” Artificial Reverberation*, Schroeder and Logan propose a chain of allpass filters as an answer to this issue. The allpass filter is already better than the feedback comb at creating smooth-sounding results, and to improve on this further, the authors suggest “incommensurate” delay times. In other words, the delay times do not easily divide into each other, preventing the echoes from one allpass from lining up with another. The result of the incommensurate delay times is something more like the random tapping of rain, rather than any periodic rhythm.

On this algorithm, [Sean Costello comments that](https://valhalladsp.com/2021/09/22/getting-started-with-reverb-design-part-2-the-foundations/)

> The resulting reverberator structure is a bit hard to tune, as both the reverb attack and decay are controlled by the feedforward/feedback allpass coefficient, and is less “general purpose” than the structure discussed in Schoeder’s next paper.

As Costello then mentions, some reverbs such as the [Eventide Blackhole](https://store.eventideaudio.com/products/blackhole) make artistic use of the weirdness of this structure. However, it would be helpful to have a more general-purpose algorithm. 

### Parallel Combs into Series Allpasses

In *Natural Sounding Artificial Reverberation*, [^5] Schroeder proposes the class of algorithm shown below. Comb filters create a nice exponential amplitude decay (unlike the allpass chain in which, as mentioned above, both attack and decay depend on the same parameter). In response to the problem of “coloration” in the frequency spectrum, Schroeder notes that

> extreme response irregularities are imperceptible when the density of peaks and valleys on the frequency scale is high enough

In other words, if we combine several comb filters in parallel, the “comb teeth” in their frequency spectra will tightly “interlock,” creating what *sounds like* a flat frequency response. 

The next problem after the comb's frequency response is the “flutter” effect. Schroeder gives the goal of around 1000 echoes per second to make a “natural”-sounding reverb. Assuming 4 parallel comb filters with delays that are incommensurate, but in the neighborhood of 40ms (25 echoes per second), we get only about 100 echoes per second. Assuming (as Schroeder does) that a single allpass multiplies the number of echoes by about 3, two series allpasses after 4 parallel combs is enough to meet the minimum requirement.

<figure>

![DSP block diagram of 8 filtered-feedback comb filters summed in parallel, and feeding into four allpass filters in series](/media/blog/2025/06/reverb_1/freeverb.webp)

<figcaption>The “Freeverb” Schroeder reverberator (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Freeverb.html">Julius O. Smith)</a></figcaption>
</figure>

The combination of parallel combs into series allpasses (or sometimes vice versa) is often referred to as a “Schroeder reverb.” The “Freeverb” algorithm shown above is one popular Schroeder reverb. The delays are given in samples, with the floating point values representing the delay feedback coefficients. In the combs, there are two values, and as far as I can tell, the first is the feedback coefficient, and the second is the lowpass filtering (see next paragraph).

One additional feature of this particular version is that there is a first-order (i.e., 6dB/octave) low-pass filter in the feedback loop of the combs. This causes higher frequencies to decay faster. While Schroeder and Logan seek to make all frequencies decay at an equal rate, the most important aspect seems to be to prevent individual frequency bands from ringing and standing out. Reverberations in the physical world decay more quickly at higher frequencies, due (at least in my understanding) to the sound absorbency of building materials, as well as the fact that [the atmosphere can be approximated with a low-pass filter](https://computingandrecording.wordpress.com/2017/07/05/approximating-atmospheric-absorption-with-a-simple-filter/). In JUCE, I used the [`juce::dsp::FirstOrderTPTFilter< SampleType >`](https://docs.juce.com/master/classdsp_1_1FirstOrderTPTFilter.html) class for this purpose.

Some final design notes: First, we have the stereo spread. The right channel has a slightly longer delay time than the left, with a default value of 23 samples added to each delay value, according to [Julius O. Smith](https://ccrma.stanford.edu/~jos/pasp/Freeverb.html). This simulates the effect of different physical environments to the right and left of the listener. Second, in my implementation I have a [low-frequency oscillator (LFO)](https://en.wikipedia.org/wiki/Low-frequency_oscillation) slowly modulating the first and third allpass filter delay times longer and shorter, giving a [chorusing effect](https://en.wikipedia.org/wiki/Chorus_(audio_effect)) and making the sound richer.

## Implementing Delays & Allpasses in JUCE

The [JUCE](https://juce.com/) C++ framework is a popular way to make audio plugins, and it's what I'll use today. I won't go into too much background on it; if you want a good introduction, I would start with [the official tutorials](https://juce.com/learn/tutorials/) and then look at [The Audio Programmer's YouTube channel](https://www.youtube.com/theaudioprogrammer) and/or [the books from that group](https://www.theaudioprogrammer.com/books). If you want to learn C++, I used [Sams Teach Yourself C++ in One Hour a Day](https://www.oreilly.com/library/view/sams-teach-yourself/9780137334674/) by Siddhartha Rao.

First, to make a basic delay, I use the class [`juce::dsp::DelayLine<float>`](https://docs.juce.com/master/classdsp_1_1DelayLine.html). Note that this class is part of the `dsp` module, which is not included by default. When making a new JUCE project using the Projucer, you will need to check the `juce_dsp` box in the “Modules” menu, on the first window you get when you make a new project.

The class `juce::dsp::DelayLine<float>` has methods [`pushSample()`](https://docs.juce.com/master/classdsp_1_1DelayLine.html#a5d07327abc2d6bcc69bb3d3eea488d8f) and [`popSample()`](https://docs.juce.com/master/classdsp_1_1DelayLine.html#afb9c3cadcd2a333a742aa86a97caf944). `pushSample()` takes two arguments—the channel and the input sample—and pushes the sample into the delay line for the appropriate channel. This is equivalent to the input of the delays (the $z^{-M}$ blocks) above. `popSample()` takes the channel and an optional delay argument, and it returns the next sample from the output of the delay.

You can find my full code for the Freeverb algorithm (explained a little later) in the [`Freeverb.cpp`](https://github.com/reillypascal/RSAlgorithmicVerb/blob/main/Source/Freeverb.cpp) and [`Freeverb.h`](https://github.com/reillypascal/RSAlgorithmicVerb/blob/main/Source/Freeverb.h) source files.

### JUCE Feedforward Delay

First we create a delay line: `juce::dsp::DelayLine<float> delayLine { 22050 };`. (For an explanation of some of the surrounding code, see footnote: [^3]) Notice how we initialize the delay with 22050 samples (usually equivalent to 0.5s) of maximum delay time. To make a feedforward delay with this, we:
- Write the current sample to the delay line.
- Get the next delayed sample from the delay line.
- Mix the original and delayed signals, each multiplied by a gain value.

```cpp
delayLine.pushSample(channel, channelData[sample]);
float feedforward = delayLine.popSample(channel);
channelData[sample] = channelData[sample] * 0.5 + feedforward * 0.5;
```

### JUCE Feedback Delay

For our feedback, we prepare the delay line in the same way. As we previously discussed, our steps for each sample are as follows:
- Mix the incoming signal (multiplied by a gain value) with the fed-back delay output (multiplied by a negative gain)
  - Note that if this delay is not forming part of an allpass filter, it's more common to have the feedback gain be positive.
- Write that signal to the delay line, to be fed back later
- Output that same signal (the one we wrote to the delay line)

```cpp
float feedback = delayLine.popSample(channel) * -0.5 + channelData[sample] * 0.5;
delayLine.pushSample(channel, feedback);
channelData[sample] = feedback;
```

### JUCE Allpass

Finally, for the allpass, we:
- Get the delay output.
- Get the feedback signal by multiplying that output by a negative gain.
- Get the input to the delay (labeled $v(n)$ in the block diagram) by adding the incoming signal and the feedback; push this into the delay.
- Get the output of the allpass, $y(n)$, by combining the delay output with the delay input, $v(n)$, multiplied by a positive gain value.

```cpp
float delayOutput = delayLine.popSample(channel);
float feedback = delayOutput * -0.5;
float vn = channelData[sample] + feedback;

delayLine.pushSample(channel, vn);
channelData[sample] = delayOutput + (vn * 0.5);
```

## Final Notes

That's all for today! My plan is to do a series of posts, each covering a class of reverb algorithms. For the next one, I'll be writing about rings of allpass filters—this is relevant to, for example, [Jon Dattorro's popular 1997 algorithm](https://ccrma.stanford.edu/~dattorro/EffectDesignPart1.pdf) that appears to be based on a plate reverb from [Lexicon's 224 and 480 reverb units](https://en.wikipedia.org/wiki/Lexicon_(company)#Reverb_and_effects). Until next time!

[^1]: This notation comes from the idea of the [Z-transform](https://en.wikipedia.org/wiki/Z-transform).

[^2]: Note that the triangle symbol is the standard DSP symbol for amplification/an amplifier.

[^3]: In our reverb processor's `prepare()` function we call `delayLine.prepare(spec);`, with `spec` being a [`juce::dsp::ProcessSpec`](https://docs.juce.com/master/structdsp_1_1ProcessSpec.html). At some point—either here or in the `processBlock()` function—we need to set the delay time in samples: run e.g., `delayLine.setDelay(1617);`. Next, in the `processBlock()` function we run our delay. In JUCE, we can get a write pointer into a `juce::AudioBuffer<float>` (which contain's the audio input from our DAW) by writing e.g., `auto* channelData = buffer.getWritePointer (channel);`, with `channel` representing the current channel number.

[^4]: M. R. Schroeder and B. F. Logan, “‘Colorless’ artificial reverberation,” *IRE Transactions on Audio*, vol. AU-9, no. 6, pp. 209–214, Nov. 1961, doi: [10.1109/TAU.1961.1166351](https://doi.org/10.1109/TAU.1961.1166351).

[^5]: M. R. Schroeder, “Natural sounding artificial reverberation,” in *Audio Engineering Society Convention 13*, Audio Engineering Society, 1961. Accessed: Dec. 29, 2024. \[Online]. Available: [https://www.aes.org/e-lib/download.cfm?ID=343](https://www.aes.org/e-lib/download.cfm?ID=343)