---
title: "Reverb Part 1: Introduction and a VST/AU Plugin"
description: I discuss how several kinds of algorithmic reverb work, and I return to a VST/AU plugin I coded in C++/JUCE
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-06-09T12:30:00-0400
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

There are two main categories of digital reverb—[convolution](https://www.bhphotovideo.com/find/newsLetter/Convolution-Reverb.jsp/) and algorithmic—and today we will be discussing algorithmic reverb. An algorithmic reverb is based on a network of delays, with individual delays roughly corresponding to the sound reflections from individual walls or objects, and the network of connections between them simulating the way a reflection from one surface may bounce off many others.

Sean Costello of Valhalla DSP has a [series](https://valhalladsp.com/2021/09/22/getting-started-with-reverb-design-part-2-the-foundations/) of [posts](https://valhalladsp.com/2021/09/23/getting-started-with-reverb-design-part-3-online-resources/) giving [helpful resources](https://valhalladsp.com/2021/09/28/getting-started-with-reverb-design-part-4-books/) on reverb design, including influential papers, online resources, and books, and you can find many of the algorithms we'll discuss today in the papers he mentions.

### Delays and Allpasses

In the most basic form of delay, we take a copy of the incoming audio signal, delay it by a certain amount, and combine it with the original signal, usually with the option to adjust the proportions of original and delayed copies. To contrast with the other types of delay, this is often referred to as a “feedforward” delay—the delayed copy is simply recombined with the original without any “feedback,” which we will discuss in the next section. 

<!-- This delay configuration is also referred to as a “comb filter”; as we will see shortly, it produces an amplitude curve that resembles a comb. -->

In the diagram below, $x(n)$ represents the incoming signal; $z^{-M}$ is the delay; [^1] $b_0$ and $b_M$ represent the amount of gain applied to the original and delayed copies respectively; [^2] the $+$ symbol represents summing the two copies; and $y(n)$ is the output signal. 

<figure>

![block diagram of a feedforward delay/comb filter](/media/blog/2025/06/reverb/feedforward_comb.webp)

<figcaption>Feedforward delay/comb filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp04/Feedforward_Comb_Filters.html">Julius O. Smith</a>)</figcaption>
</figure>

Next, we have a “feedback” delay. Note how in the diagram below, the incoming signal is summed with the output of the delay *before* entering the delay; the gain $-a_M$ applied to the fed-back output of the delay is *negative*; and the output of the whole delay $y(n)$ is taken from that sum of the input and feedback *before* it enters the delay.

<figure>

![block diagram of a feedback delay/comb filter](/media/blog/2025/06/reverb/feedback_comb.webp)

<figcaption>Feedback delay/comb filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Feedback_Comb_Filters.html">Julius O. Smith</a>)</figcaption>
</figure>

Below I have the amplitude curves from feedforward and feedback delays, caused by [constructive and destructive interference](https://www.phys.uconn.edu/~gibson/Notes/Section5_2/Sec5_2.htm). The curve of the feedforward delay is caused by destructive interference; adding the delay to the original signal causes certain frequencies to cancel out. In the feedback example, as the sound feeds back on itself, certain frequencies constructively interfere—they reinforce each other and create the “spikes” in the amplitude response.

<figure>

![feedforward comb filter amplitude plot](/media/blog/2025/06/reverb/feedforward_comb_amp.webp)

<figcaption>Feedforward comb filter amplitude plot (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp05/Feedforward_Comb_Filter_Amplitude.html">Julius O. Smith</a>)</figcaption>
</figure>

<figure>

![negative feedback comb filter amplitude plot](/media/blog/2025/06/reverb/feedback_comb_neg_amp.webp)

<figcaption>Negative feedback comb filter amplitude plot (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp05/Feedback_Comb_Filter_Amplitude.html">Julius O. Smith</a>)</figcaption>
</figure>

Notice how the feedforward and feedback amplitude responses are the inverse of each other. Having a negative gain in the feedback loop of a feedback delay is necessary for the peaks to align with where the troughs would be in a feedforward delay that has the same delay time. As [shown here](https://ccrma.stanford.edu/~jos/pasp05/Feedback_Comb_Filter_Amplitude.html), if the feedback delay's gain were positive, the peaks would be at 0.2, 0.4, etc., instead of 0.1, 0.3, etc. 

This alignment is important for our next type of filter: the “allpass” filter. As shown below, we combine a feedforward delay with a feedback delay that has a negative gain on the feedback. As a result, our peaks and troughs in the frequency response cancel out. This kind of delay configuration has a “flat” frequency response; all frequencies pass through at the same loudness. 

<figure>

![block diagram of an allpass filter](/media/blog/2025/06/reverb/allpass_from_2_combs.webp)

<figcaption>Allpass filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Allpass_Two_Combs.html">Julius O. Smith</a>)</figcaption>
</figure>

In contrast to the frequency response, our time response is much more complex. An allpass filter delays the different frequencies in the signal by different amounts. As a result, a single impulse or “click” going through it would become multiplied and “smeared” in time, giving the effect of multiple clicks piling on top of each other, a very useful effect for creating a smooth- and dense-sounding reverb.

## Implementing Delays & Allpasses in JUCE

The [JUCE](https://juce.com/) C++ framework is a popular way to make audio plugins, and it's what I will use today. I won't go into too much background on it; if you want a good introduction, I would start with [the official tutorials](https://juce.com/learn/tutorials/) and then look at [The Audio Programmer's YouTube channel](https://www.youtube.com/theaudioprogrammer) and/or [the books from that group](https://www.theaudioprogrammer.com/books). If you want to learn C++, I used [Sams Teach Yourself C++ in One Hour a Day](https://www.oreilly.com/library/view/sams-teach-yourself/9780137334674/) by Siddhartha Rao.

First, to make a basic delay, I use the class [`juce::dsp::DelayLine<float>`](https://docs.juce.com/master/classdsp_1_1DelayLine.html). Note that this class is part of the `dsp` module, which is not included by default. When making a new JUCE project using the Projucer, you will need to check the `juce_dsp` box in the “Modules” menu, on the first window you get when you make a new project.

The class `juce::dsp::DelayLine<float>` has methods [`pushSample()`](https://docs.juce.com/master/classdsp_1_1DelayLine.html#a5d07327abc2d6bcc69bb3d3eea488d8f) and [`popSample()`](https://docs.juce.com/master/classdsp_1_1DelayLine.html#afb9c3cadcd2a333a742aa86a97caf944). `pushSample()` takes two arguments—the channel and the input sample—and pushes the sample into the delay line. This is equivalent to the input of the delay (the $z^{-M}$ block) above. `popSample()` takes the channel and an optional delay argument. 

You can find my full code for the Freeverb algorithm in the [`Freeverb.cpp`](https://github.com/reillypascal/RSAlgorithmicVerb/blob/main/Source/Freeverb.cpp) and [`Freeverb.h`](https://github.com/reillypascal/RSAlgorithmicVerb/blob/main/Source/Freeverb.h) source files.

### JUCE Feedforward Delay

First we create a delay line: `juce::dsp::DelayLine<float> delayLine { 22050 };`. Notice how we initialize it with 22050 samples (usually equivalent to 0.5s) of maximum delay time. In our reverb processor's `prepare()` function we call `delayLine.prepare(spec);`, with `spec` being a [`juce::dsp::ProcessSpec`](https://docs.juce.com/master/structdsp_1_1ProcessSpec.html). At some point—either here or in the `processBlock()` function—we need to set the delay time in samples: run e.g., `delayLine.setDelay(1617);`.

Next, in the `processBlock()` function we run our delay. In JUCE, we can get a write pointer into a `juce::AudioBuffer<float>` (which contain's the audio input from our DAW) by writing e.g., `auto* channelData = buffer.getWritePointer (channel);`, with `channel` representing the current channel number. To make a feedforward delay, we:
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
- Mix the incoming signal (multiplied by a gain value) with the feedback signal (multiplied by a negative gain)
- Write that signal to the delay line, to be fed back later
- Output that same signal we just wrote to the delay line

```cpp
float feedback = delayLine.popSample(channel) * -0.5 + channelData[sample] * 0.5;

delayLine.pushSample(channel, feedback);
channelData[sample] = feedback;
```

### JUCE Allpass

For the allpass, we:
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

## Reverb Algorithms: The Classic Schroeder Reverberator



<figure>

![DSP block diagram of 8 filtered-feedback comb filters summed in parallel, and feeding into four allpass filters in series](/media/blog/2025/06/reverb/freeverb.webp)

<figcaption>The “Freeverb” Schroeder reverberator (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Freeverb.html">Julius O. Smith)</a></figcaption>
</figure>

## Final Notes

That's all for today! My plan is to do a series of posts, each covering a class of reverb algorithms. For the next one, I'll be writing about rings of allpass filters—this is relevant to, for example, [Jon Dattorro's popular 1997 algorithm](https://ccrma.stanford.edu/~dattorro/EffectDesignPart1.pdf) that appears to be based on a plate reverb from [Lexicon's 224 and 480 reverb units](https://en.wikipedia.org/wiki/Lexicon_(company)#Reverb_and_effects). Until next time!

[^1]: This notation comes from the idea of the [Z-transform](https://en.wikipedia.org/wiki/Z-transform).

[^2]: Note that the triangle symbol is the standard DSP symbol for amplification/an amplifier.