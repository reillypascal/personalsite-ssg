---
title: "Reverb Part 3: Working with Delays in JUCE"
description: 
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-06-05T01:28:35-0400
octothorpes:
  - 
tags:
  - post
post_series: 
draft: true
indienews: true
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<link rel="stylesheet" type="text/css" href="/styles/math/katex.min.css" />

## Implementing Delays & Allpasses in JUCE

The [JUCE](https://juce.com/) C++ framework is a popular way to make audio plugins, and it's what I'll use today. I won't go into too much background on it; if you want a good introduction, I would start with [the official tutorials](https://juce.com/learn/tutorials/) and then look at [The Audio Programmer's YouTube channel](https://www.youtube.com/theaudioprogrammer) and/or [the books from that group](https://www.theaudioprogrammer.com/books). If you want to learn C++, I used [Sams Teach Yourself C++ in One Hour a Day](https://www.oreilly.com/library/view/sams-teach-yourself/9780137334674/) by Siddhartha Rao.

First, to make a basic delay, I use the class [`juce::dsp::DelayLine<float>`](https://docs.juce.com/master/classdsp_1_1DelayLine.html). Note that this class is part of the `dsp` module, which is not included by default. When making a new JUCE project using the Projucer, you will need to check the `juce_dsp` box in the “Modules” menu, on the first window you get when you make a new project.

The class `juce::dsp::DelayLine<float>` has methods [`pushSample()`](https://docs.juce.com/master/classdsp_1_1DelayLine.html#a5d07327abc2d6bcc69bb3d3eea488d8f) and [`popSample()`](https://docs.juce.com/master/classdsp_1_1DelayLine.html#afb9c3cadcd2a333a742aa86a97caf944). `pushSample()` takes two arguments—the channel and the input sample—and pushes the sample into the delay line for the appropriate channel. This is equivalent to the input of the delays (the $z^{-M}$ blocks) above. `popSample()` takes the channel and an optional delay argument, and it returns the next sample from the output of the delay.

You can find my full code for the Freeverb algorithm (explained a little later) in the [`Freeverb.cpp`](https://github.com/reillypascal/RSAlgorithmicVerb/blob/main/Source/Freeverb.cpp) and [`Freeverb.h`](https://github.com/reillypascal/RSAlgorithmicVerb/blob/main/Source/Freeverb.h) source files.

### JUCE Feedforward Delay

First we create a delay line: `juce::dsp::DelayLine<float> delayLine { 22050 };`. (For an explanation of some of the surrounding code, see footnote: [^5]) Notice how we initialize the delay with 22050 samples (usually equivalent to 0.5s) of maximum delay time. To make a feedforward delay with this, we:
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

In JUCE, I used the [`juce::dsp::FirstOrderTPTFilter< SampleType >`](https://docs.juce.com/master/classdsp_1_1FirstOrderTPTFilter.html) class for the damping filter in the feedback comb.

[^5]: In our reverb processor's `prepare()` function we call `delayLine.prepare(spec);`, with `spec` being a [`juce::dsp::ProcessSpec`](https://docs.juce.com/master/structdsp_1_1ProcessSpec.html). At some point—either here or in the `processBlock()` function—we need to set the delay time in samples: run e.g., `delayLine.setDelay(1617);`. Next, in the `processBlock()` function we run our delay. In JUCE, we can get a write pointer into a `juce::AudioBuffer<float>` (which contain's the audio input from our DAW) by writing e.g., `auto* channelData = buffer.getWritePointer (channel);`, with `channel` representing the current channel number.
