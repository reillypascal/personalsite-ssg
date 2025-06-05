---
title: "Reverb Part 1: “Freeverb”"
description: I discuss how algorithmic reverbs work using the popular “Freeverb.” I give details on feedforward/feedback delays and allpass filters, and I include a Max/MSP patch to play with.
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
  - plugin
  - dsp
  - reverb
  - schroeder
  - maxmsp
post_series:
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<link rel="stylesheet" type="text/css" href="/styles/math/katex.min.css" />

I started work on a [reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb/releases) in C++/JUCE back in 2023, and I've slowly added to it since. Today, I'm going to discuss how algorithmic (i.e., delay-based) reverbs work using the “Freeverb” algorithm that's available in that plugin. I've included a Max/MSP version of the reverb, and in a later post, I will discuss getting our hands dirty with the code in C++/JUCE, as well as a number of other cool algorithms. Let's get started!

## How Reverb Works

There are two main categories of digital reverb—[convolution](https://www.bhphotovideo.com/find/newsLetter/Convolution-Reverb.jsp/) and algorithmic—and today we will be discussing algorithmic reverb. An algorithmic reverb is based on a network of delays or “echoes,” with individual delays roughly corresponding to the sound reflections from individual walls or objects, and the network of connections between them simulating the way a reflection from one surface may bounce off many others.

Sean Costello of Valhalla DSP has a [series](https://valhalladsp.com/2021/09/20/getting-started-with-reverb-design-part-1-dev-environments/) of [posts](https://valhalladsp.com/2021/09/22/getting-started-with-reverb-design-part-2-the-foundations/) giving [helpful resources](https://valhalladsp.com/2021/09/23/getting-started-with-reverb-design-part-3-online-resources/) on [reverb design](https://valhalladsp.com/2021/09/28/getting-started-with-reverb-design-part-4-books/), including influential papers, online resources, and books, and you can find the type of algorithm we'll discuss today among the papers he mentions.

### Feedforward and Feedback Delays

In the most basic form of delay, we take a copy of the incoming audio signal, delay it by a certain amount, and combine it with the original signal, usually with the option to adjust the proportions of original and delayed copies. To contrast with the other types of delay, this is often referred to as a “feedforward” delay—the delayed copy is “fed forward” and recombined with the original without any “feedback,” which we will discuss in the next section. 

In the diagram below, $x(n)$ represents the incoming signal; $z^{-M}$ is the delay; [^1] $b_0$ and $b_M$ represent the amount of gain applied to the original and delayed copies respectively; [^2] the $+$ symbol represents summing the two copies; and $y(n)$ is the output signal. 

<figure>

![block diagram of a feedforward delay/comb filter](/media/blog/2025/06/reverb_1/feedforward_comb.webp)

<figcaption>Feedforward delay/comb filter (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp04/Feedforward_Comb_Filters.html">Julius O. Smith</a>)</figcaption>
</figure>

Next, we have a “feedback” delay. Note how in the diagram below, the incoming signal is summed with the fed-back output of the delay *before* entering the delay; the gain $-a_M$ applied to the fed-back output of the delay is *negative*; and the output of the whole delay $y(n)$ is taken from that sum of the input and feedback *before* it enters the delay.

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

In *“Colorless” Artificial Reverberation*, [^3] Schroeder and co-author B.F. Logan note six features that they seek from a delay-based reverberator:

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

Below I have a synth riff: first the dry signal, then a mix of the dry signal with a “wet” signal through 8 series allpasses. For the allpass example, I increase the feedforward/feedback parameter from about 0.1 up to 1, then back to 0.1 again. 

<audio controls src="/media/blog/2025/06/reverb_1/pck_supersaw_dry.mp3" title="synth riff: dry"></audio>

<audio controls src="/media/blog/2025/06/reverb_1/pck_supersaw_allpass_med.mp3" title="synth riff through series allpasses"></audio>

As mentioned, this doesn't sound as natural as we'd like, as well as not being super flexible. It's a start though, and our next version will sound much nicer.

### Parallel Combs into Series Allpasses

In *Natural Sounding Artificial Reverberation*, [^4] Schroeder proposes the class of algorithm shown below. Comb filters create a nice exponential amplitude decay (unlike the allpass chain in which, as mentioned above, both attack and decay depend on the same parameter). In response to the problem of “coloration” in the frequency spectrum, Schroeder notes that

> extreme response irregularities are imperceptible when the density of peaks and valleys on the frequency scale is high enough

In other words, if we combine several comb filters in parallel, the “comb teeth” in their frequency spectra will tightly “interlock,” creating what *sounds like* a flat frequency response. 

The next problem after the comb's frequency response is the “flutter” effect. Schroeder gives the goal of around 1000 echoes per second to make a “natural”-sounding reverb. Assuming 4 parallel comb filters with delays that don't easily divide into each other, but are in the neighborhood of 40ms (25 echoes per second), we get only about 100 echoes per second. Assuming (as Schroeder does) that a single allpass multiplies the number of echoes by about 3, two series allpasses after 4 parallel combs is enough to meet the minimum requirement.

<figure>

![DSP block diagram of 8 filtered-feedback comb filters summed in parallel, and feeding into four allpass filters in series](/media/blog/2025/06/reverb_1/freeverb.webp)

<figcaption>The “Freeverb” Schroeder reverberator (diagram from <a href="https://ccrma.stanford.edu/~jos/pasp/Freeverb.html">Julius O. Smith)</a></figcaption>
</figure>

The combination of parallel combs into series allpasses (or sometimes vice versa) is often referred to as a “Schroeder reverb.” The “Freeverb” algorithm shown above is one popular Schroeder reverb. The delays are given in samples, with the floating point values representing the delay feedback coefficients. In the combs, there are two values, and as far as I can tell, the first is the feedback coefficient, and the second is the lowpass filtering (more details in a moment).

Below I have first the dry synth riff, followed by the riff through the “Freeverb” algorithm on [my algorithmic reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb/releases). This time it sounds much more natural, and if you play around with the Max patch (see below) or my plugin, there's much more flexibility.

<audio controls src="/media/blog/2025/06/reverb_1/pck_supersaw_dry.mp3" title="synth riff: dry"></audio>

<audio controls src="/media/blog/2025/06/reverb_1/pck_supersaw_freeverb.mp3" title="synth riff through 'Freeverb' algorithm"></audio>

One additional feature of this particular version is that there is a first-order (i.e., 6dB/octave) low-pass filter in the feedback loop of the combs. This causes higher frequencies to decay faster. While Schroeder and Logan seek to make all frequencies decay at an equal rate, the most important aspect seems to be to prevent individual frequency bands from ringing and standing out. Reverberations in the physical world decay more quickly at higher frequencies, due (at least in my understanding) to the sound absorbency of building materials, as well as the fact that [the atmosphere can be approximated with a low-pass filter](https://computingandrecording.wordpress.com/2017/07/05/approximating-atmospheric-absorption-with-a-simple-filter/).

Some final design notes: First, we have the stereo spread. The right channel has a slightly longer delay time than the left, with a default value of 23 samples added to each delay value, according to [Julius O. Smith](https://ccrma.stanford.edu/~jos/pasp/Freeverb.html). This simulates the effect of different physical environments to the right and left of the listener. Second, in my JUCE implementation I have a [low-frequency oscillator (LFO)](https://en.wikipedia.org/wiki/Low-frequency_oscillation) slowly modulating the first and third allpass filter delay times longer and shorter, giving a [chorusing effect](https://en.wikipedia.org/wiki/Chorus_(audio_effect)) and making the sound richer.

If you want to play with this reverb algorithm in Max/MSP, you can use the patch below. Note that this is just the “wet” sound; you'll need to mix the output with the “dry” (unprocessed) signal. The \[M4L.cross2~] object is useful for this.

<div class="maxmsp-clipboard">
<details>
  <summary>“Freeverb” using gen~ objects. Copy code and select <i>New From Clipboard</i> in Max.</summary>
<pre class="language-max"><code class="language-max">----------begin_max5_patcher----------
6889.3oc6c1zchijzEdcU+JXXY2UWS9cJ8tpd2OqlssmScv1XWLCF7AvcW0L
md9sOHkBPBzGYn1NUJ7sWztDXvQbSoLjx6iT7e93Gld65uOe6zI+eS90Ie3C
+mO9gOj+RYuvGJ19CSeZ12ua4rs4+ZSWM+2We6+b5mbu0t4eeW9K+37U+2Ie
Y2hcKmO4gMym+ay2b6geomms6tusX0iecy76149aIzrOy9zDgH+Gbt0s0mYS
9GEenUu7z5W1+ssK+Oqn3Ucuzte77b22yzsKdb0rkS+zw+0wufE2mGX6C1eg
qld5acwpCeolxw27MEIcQV+goOrXYVZrcw5UYuE+SEu9rmetzK+gRejLo5et
N+KJ4SGeoEqbuj43KsY9us3vmWe7UmsYuJsauD8xl7ra52MGh6rul02OeypW
VjGJtW7O93gPJe3Y0rmlu84Y249v2u84OueP4vWvzSZepJWyY4RepHW50oxS
Z+9cAdb4569WyyUP1gWb8yyWsX0yaluc9pcy1UD+Ge66m+vrWVt6qOrd0tsK
924QAe+HZcu+CEQYsuYVdjmB++aVjMzV7q73lE2udUVPTYzH6kO7m6Wmv044
ltbxj+arZ1y07g2uywdYog2b69j7ks2NaS1f0sKmWZ+v863ud8xpu0wO2x4O
rq3sedwpUmoh6V+byu4lEO9sV9r2td+a9Tae24uy1u9xJ269086Wr6qam8aU
U6cyVtr333pe8ee1pEOMa27cKbCAB1w2b9pY6Szus8tMqWtrR95dmeql2498
6me27eew869V9enx6Lr+WewyG1IZ5wQ46W737s6p9Z6l831pux1c+vI5kdoW
ts333uta9SOubeVT8WX+QHK1ta62V+6aK9EOriVYA3zjgkOtt7jhUd81lbr5
DjKVMQL4K2s9om1ezyjal92mr+XoW1cyzx+10LSIW4NbMaxw8+PIOelxZlsj
W5ctXFyoU9fklkTNs5W3oIJYGd8+3ie7v+3Su9Rz9oqNTB4loGJhL4u2oDIr
4G0KslbIRxe6jnl0H84w3oBJUkiFKrzTwky930UjogBMMWro6BNMUzoRgGOK
9bVAHtf6p5m5Fuz4kfRDoUGwpuLjGkh7obTmkj7rrTKkl7q7TGkn5rLUmkp5
nbU2kr5rrkGkt7o7EkRXsTFqyRYsWNq8RZsWVq0RaMUdq9RbMTlyqRcdVtq9
RdmOay4yqew62076Umi+mmHjm+l0LktTlOmPZ9QrSjh5lQu8Y08Xl8Klc2L8
xu8SyvyK+dGqDVsZXTod1DYHUO80k5YLrPpdpqK0SqBp5IuRTOtkmeRrhDcH
kOw0h7oYJm7YBn7ItVN1kWraWXkO9UyAuL6.r2G+Z4f2Dib.TO9Uh5Yz7vqd
WKS7ojICPYiqDwSHF.wK5Or8mlHUb+Oe4DahaMLCywsl3W9TTjOqJMjxmN9k
Os1P3ZcElPJep3W9DBMgK1kICo7E8mubIiblsb4yYeJOJijlesGoNx.3LYXD
y1qBKqKtq5rykZUqN7zlKO07U0jaOs33S6t93myOs49yEN.QvEnVcBx3VsWS
1IRb9XVylA4ogP9ZJjWFCQvbnNLHxeSh7vnHuLKxKCi7vzH+LNxKyi7z.IeM
QhpQRcXljWFJ0soRcarT2lK0oASsYxTyFM0hYSda3DASmZ13o5l.rtZS0964
SMpyKyew0Qz7hS7Yc1Ak4STIZrPe20m7rFUm9CzQg+KJ9e4I.DXw9m8ToM5L
kVl5p+mlsQXUZYmJsHtU5exSklmZykZNanjZ96Eo1luSMOMYfTZQ5XWooM8g
n3ZwF.k1N1U56mub1Ol7kGlO+9amc2+ZBm1D27Bjt4AuFovL1k9EqlvOAIZN
fnzDeSIVQC6T45N0dVzq8xSZ+8Kd3gWxt.5IeYeJLgs+Gy9d1fSwU8s+Dy0d
NzHXItUzvsBuLc3GbLWACNknmtXFprAFembhqyOWGqa8FrrvOFXG6iA6yYh0
BTEfYSYOdVGxXxqx0Ac4JqrbwJeudz77M622Ocd65W1b2g8SNTmZR8Zw9qse
2hUGW.qe8zYu0vG3oE2+75Eq1s834YlI3N3qz77ZBk2f6.7v8+y2n1u00at2
sHmuN6RFbAK6Z3lzQpwiiTyRceAyUapkc4fSFG6PlRcTKSK3S9GQQz2hN2xg
SQSzKoF8ItOPbD8p9L2ezn859reezn8l9LgDeLLgD8TSMVJiH6UER+Nh4reo
p+FiOuyS3IA06bN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24
v6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cdj4ctw8if4cNCdmCuyg24
v6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7NG
dmCuyg24v6b3cN7NOx7NWaSCo24xT3cN7NGdmCuyg24v6b3cN7NGdmCuyg24
v6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v672.uy8z
s7zhSzy59QP7J+x1XeD2r3eXwxcy2L+9udXcr959qd7VOTVtQmTRa4ogADAg
rUwUAPDBHHBtUO1n3.DA.h..Q.fHDI1HJrNaszhAxcKN68hisBmAVbiYfj5z
2q9H5VbRoXv7QL4c193C2zIidux+K+h26VK4tqRi6lB2D7cqMicBx919R5q2
7Ch6b69gREb8VO106pzHrcwiqt7JJZcN7hovG.bI4WYNdeSQ0zry4+loDs91
cRiNquErvef.2dcwFxwynoBZH9NsjvYDq6hqExjvObjbELbnJQCxrm1eg0O1
qQihhxG35VFd1b3oum3BwUWP4pI+ZxEhfM94BI6hqI4zQLYrI2LlCdaOB9Xw
TVdBwfOlbTlSkjByXgQDxYlsQylOCxKoPlek5EmJW0SrqXKky0J4osFCd8p6
gjEKygPc9u7Y6ikCCsi3IuoN8mfMVPenOSr6ElnopbxPcq6WwsNP4M35hqRj
cbqwvTto84PPuDrCJQp65DJtaPy15ZTWzuNGfD2OYJ5OfHJkdH.DQ..Q.fH.
PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.
h..Q.fH.PD.HB.DA.h..Q.fH.Pj.AHhPJFB.QX.PD.HB.DA.h..Q.fH.PD.H
B.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q
.fH.PD.HB.DIP.hvbTBDX.Qt3BEAfH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..
Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.H
xaDfHILyPvGRB3CA7g.9P.eHfODvGB3CA7g.9P.eHfODvGB3CA7g.9P.eHfO
DvGB3CA7g.9P.eHfODvGB3CA7g.9P.eHfODvGB3CA7g.9PBCeHZGQHglODK3
CA7g.9P.eHfODvGB3CA7g.9P.eHfODvGB3CA7g.9P.eHfODvGB3CA7g.9P.e
HfODvGB3CA7g.9P.eHfODvGB3CA7g.9P5lOjeJyPAiOcQFK2T5RBU7v.AhoU
HP3wg.lj3i.pYxxBnHLBndDHfRsW6AJJVD0BALPXHoFABnvZ8pQPYUCf.xFA
BnRH74AkjQT5ZIBj9kF6x2echWS+YYNamXGTs.ncIwt18ZfmoLgM.3YB5LAc
lfNSPmInyDzY1n0tfNy.StFnyr2JMnybjrONnyr2JMnyDzY1jdC5LAcl+oDe
PmYDMX.5LipgCPmYzLZ.5Les34BzYB5L6QvC5LiQjX.clz0LPmInyjbrC5LA
clfNyWSc4plNSUJ2CFPLZWkSYZ.ISZLvlog6CYbph00Hnx2XfLSs1G4SHF.4
S9dfsqBp4BLaWBNf6BvcA3t.bW.tK.2Ef6BvcA3t.bW.tK.2Ef6BvcA3t.bW
.tK.2Ef6BvcA3t.bW.tK.2Ef6BvcA3t.bW.tK.2Ef6BvcA3t5lOjrUUwe3Z3
ZWUzjvP.R6rcwhB0i6O.MAV8ri.0S5OWblzPJdIi.wS4CSlN6ZCq3kNBDOsO
8bVS9ArZoHfpmjE6pWcquUsEMRc7RwXIsu5VsuxVUDGduAtrxez5WEqpZVSm
jwYJ2kWmacmrPSm5M+xq4w6A0dGfLBQHWb4U171GgTzPdxPngBJQX5PDgRJ6
GxFhHTQQCkCw9gZJZnZHhPCgHTNHGKaIDgICQ.lD6AXZjGfTlKzN.SzHXwt.
xi8.TD6AnL1CPJE6xk6feTBkhcp506yVkPNKecUUIotafHywst3SdbgzjQbR
qHjzFGPKEIsot6ZjSIsHhSZMgj1JJORmuUyIMOhSZCgjNQmTJoy2p4jlE1jl
xoG1v0Ed9J+KsNrnEtKtOQdbyn4fZRYspGYsvYXTGYsHhyZcOxZMW3QVyi3r
1zir1Jzdj0Q7w0MLy2wPOIdCcY6QtMdibZGe4n.TcZqlyYS7lyF54rwv7Hm0
waNmROmSrbOxYUXyYJqRSCKoy4mcjM+9mRJyMQwvDG2JZFnsTWlYhIcBW6QR
GyizozSZNSj3QVKi2rVv5QVKTbOxZQDm07npXqk55kPc.SoUdLfwi3rV1ir1
Xrdj0r3Mq6QsGYRpG4bfOwpDpEbEckzEm+HO03t81RNtUzTvMgZAWhIcpj6Q
Rqh3jNkdRy4JkGYsLdy57BtTyZo15QVKh3rlSOqyXpo6j1FwIsnGC0ZKyirl
GwYsrGYs0szpcj0r3Mq6QUKMym8uCbo5TpkpkckzFqKMc2NRVq43VQSo5Tpk
pIlzotSJqijVEwIcJ8jlKbKCRGYsLdy57R0TyZEW6QVKh3rlSOqkZoGIsMhS
ZQOFpMtE+oirlGwYsrGYchawe5HqYwaV2ipVYzw2cNG1R0Tn.hO.T.IoPhlr
9qEbfpRPJzUr1CcQDG571CcdDG5h1C8vN+iTPcV2PS7lTR8nwfGgJpGzE7HT
S8XqfGgFpGBE7HLk5nbnqaondEvgVBUjmhO3RHm5tgAOBoLgsbPzPRSXOD2w
PJJGoHGh6XHEkIrOL6dXiPRDhYFfHjzsE1.Dejp3M.wWreKgkP87BCc.RZcJ
6dl5Ru4o243+5TBbLrN6FJ+T31wMRdsMllal9vl4Yckkam72tobqKn1mkFta
Ceo0T.hcc2T4MeC42wMiek607xOXTpdelqOOFq13YJM50VCmoolMS4A+FZxL
MzfYZt4xzcikoolJSkFJimMSlRMRlTUwy..mmsI4alnN+djnwlHiGMPFeZdL
c13X7rowzRCiwulESGMJlNaRLc1fX5n4vzcigoylBiGMDFeZFLTZDLszDX5r
Avzdyeo8F+R6M8kVa3KM0rWpuQuzPSdwqF7hmM2k5arKuostMoxmmSHRW2kx
5dVhIsA4wrhZDz3.UjjO2TrgR9FAMNPs13u7YbOtPCk7ohe4SHz9Ke5vt22X
puKtux0yYeJuefIk3TQNKLMZQknUwThFsX.azhb2CczDCZzhnQKhFsHZzhMU
ap1eudzYzl7Kd2pJbPJVzYPBeKLRpF68Ope1Skt3APcQiVN7cgNo78RC+im5
tan3rgRp4uWj5B1wRSFHkVL56enzl9PTbsXCfRaeu1oVKl3lOXcpUgYrK8U6
wh6uflW1QS7K7ERD9yOQec0U+tewCO7R1EPWsQxM4KEW029SLW6aO9y8DflW
7fflE9tJm7Jq+WVLCEo1do69kz0OjJZIAgcLv9dpy94lNRY0u1c1OYx3uy9I
n1bnDd2JeJDbU992Z2yjixavcsbQ2+OeiwPGqgrfUOayUSs3noNIn1qsDlq1
TSxGKcyOA0dnjvFQs2sVz4VNbJZhdI0nOlZOc0eOMz0b+Qi1q6y98Qi1a5yD
R7wvDRzSM0XoLhrWUH86HlHrmz8mw6baw0+GJuy4v6b3cN7NGdmCuyg24v6b
3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7NGdmC
uyg24Ql24F2YZGLuyYv6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7N
GdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24Ql24ZoJjdmKSg24v6
b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7NGdmCuyg24v6b3cN7NGdm
Cuyg24v6b3cN7NGdmCuyeC7N2S2xclkKYB246EDuxurM1GwMK9GVrb27Myu+
qGVGqut+pGu0CkkazIkzVdZX.QPHaUbU.Dg.Bhfa0iMJN.Q.fH.PD.HBQhMh
BqyVKsXfb2hydu3XqvYfE2XFHoN88pOhtEmTJFLeDSdmsO9vMcxn2q7+xu38
t0Rt6pz3tovMAe2ZyXmfrusuj95M+f3N2tenTAWu0ic8tJMBaW73pKuhhVmC
uXJ7A.WR9Uli22TTMM6b9uYJQqucmzny5aAK7GHvsWWrgb7LZpfFhuSKIbFw
5t3ZgLI7CGIWACGpRzfL6o8WX8i8Zznnn7AttkgmMGd56ItPb0ETtZxulbgH
XietPxt3ZRNcDSFaxMi4f21ifOVLkkmPL3iIGk4TIovLVXDgblYazr4yf7RJ
j4WodwoxU8D6J1R4bsRdZqwfWu5dHYwxbHTm+Ke19X4vP6HdxapS+IXiEzG5
yD6dgIZpJmLT259UbqCTdCtt3pDYG2ZLLkaZeNDzKA6fRj5tNgh6FzrstF0E
8qyAHw8Slh9CHhRoGB.QD.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.H
B.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DIP.hHj
hg.PDF.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA
.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..QBDfHLGk.AFPjKtPQ.HB.D
A.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH.PD.HB.DA.h..Q.fH
.PD.HB.DA.h..Q.fH.PD.HB.DA.h7FAHRByLD7gj.9P.eHfODvGB3CA7g.9P
.eHfODvGB3CA7g.9P.eHfODvGB3CA7g.9P.eHfODvGB3CA7g.9P.eHfODvGB
3CA7g.9P.eHfOjvvGh1QDRn4CwB9P.eHfODvGB3CA7g.9P.eHfODvGB3CA7g
.9P.eHfODvGB3CA7g.9P.eHfODvGB3CA7g.9P.eHfODvGB3CA7g.9P.eHfOj
t4C4mxLTv3SWjwxMktjPEOLPfXZEBDdbHfII9HfZlrr.JBi.pGABnT60dfhh
EQsP.CDFRpQf.JrVuZDTV0.HfrQf.pDBedPIYDktVh.oeowt78Wm30ze1buO
joGWiq.ncIwt18ZfmoLgM.3YB5LAclfNSPmInyDzY1n0tfNy.StFnyr2JMny
bjrONnyr2JMnyDzY1jdC5LAcl+oDePmYDMX.5LipgCPmYzLZ.5Les34BzYB5
L6QvC5LiQjX.clz0LPmInyjbrC5LAclfNyWSc4plNSUJ2CFPLZWkSYZ.ISZL
vlog6CYbph00Hnx2XfLSs1G4SHF.4S9dfsqCTyEV1tDb.2Ef6BvcA3t.bW.t
K.2Ef6BvcA3t.bW.tK.2Ef6BvcA3t.bW.tK.2Ef6BvcA3t.bW.tK.2Ef6Bvc
A3t.bW.tK.2Ef6Bvc0MeHYqph+v0v0tpnIgg.j1Y6hEEpG2e.ZBr5YGApmze
t3LogT7RFAhmxGlLc10FVwKcDHdZe54rF2yXuDa.UOIK1Uu5VeqZKZ3dL6k5
XHq4E2p8E1ph1v6MukU9iV+hXUUxZ5bLNS37bQqZ5DtpYoG7dPs2QnhPDJXC
QDpoDghgHBMThP4PDgVBQXMW95ae.lD6AXZjGfBVrGf7XO.Ewd.Ji8.jxT0p
5ylyVaANKe0XTI4m5pTYNt0EexiW9sLhSZEgjVmxKkz4a0bRKh3jVSHoMtSv
tHoy2p4jlGwIsgPRaqr6ss8cuYgMoobxMMb9tmudgRqClR28PDKQdbyn4fZR
YspGYsvsLycj0hHNq08Hq0bgGYMOhyZSOxZqP6QVGwGW2vLeGC8j3MzksG41
3Mxoc7kicH0osZNmMwaNanmyFCyibVGu4bJ8bNwx8HmUgMmorFCMrfDme1QV
2ccQhaQ+YhiaEMCzjR5D5IcBW6QRGyizozSZNSj3QVKi2rVv5QVKTbOxZQDm
07npXqk5BGSc.SoUdLfwi3rV1ir1Xrdj0r3Mq6QsGYRpG4bfOwpDpEbEckzE
m+HO03toXRNtUzTvMgZAWhIcpj6QRqh3jNkdRy4JkGYsLdy57BtTyZo15QVK
h3rlSOqybhu6j1FwIsnGC0ZKyirlGwYsrGYs0szpcj0r3Mq6QUKMym8uCbo5
TpkpkckzFqKMc2DCVq43VQSo5TpkpIlzotSJqijVEwIcJ8jlKbKCRGYsLdy5
7R0TyZEW6QVKh3rlSOqkZoGIsMhSZQOFpMtE+oirlGwYsrGYchawe5HqYwaV
2ipVYL01cNG1R0RpGSGZV9jT.8RV+ECNPkIHE5JV6gtHhCcd6gNOhCcQ6gdX
m.RlRcGlPi7lh79EAOB4TG9CdDRA7R4fngRpy4F5pBJE0iTBdDpodjRviPC0
iTBcDpId9XgN9LTWliPGfw98AQB04YBc.RdMcZeDtzad5cN9uNk.GCqyt60N
EtcbWqU8NVq7s4b8OJgc3TIa4tUq46TsJ2+ikuwLa3NT6sMeWrZhozyCrEO7
vKYOx4q9DAaxWJdNoOg8YcGhiJ0cyOZbNix7QcJcaP1ws.YkG+WxFEOVvDOc
GOL0lbR45Z2JUwC6Q2MAYwsD4aixIh.kq7igt42k83Ntjtw9b59+q79cIpNj
Ooo..A2Qkhz2N4iGAxGu7S3x+1jEqd9kc2LsCMx8zEvVvmB6sSgh.ARV94u5
+ddwtWelKztcwRNs2EuqcsXV2hqKdqOxbvOv776X6ZeHU3t+1eEp+Qq72wu+
KuorOo.0cpKkzgKu0MO+TVZ57oN6ZeacXfbPPJJpr.L0rtQCTnIaNzXuMglf
hpICppInnZxfpZRJplJnpljhpoBopQZWMdHEMR6owColQZz7sZpUou5i5sLH
7UJDMGEEun6Ux++EUDOuSjkEHm0wwNqKicYmEq4tI14cPr7tFVccJrrS83i+
wG+e.nn5Y2B
-----------end_max5_patcher-----------
</code></pre>
</details>
</div>

## Final Notes

That's all for today! My plan is to do a series of posts, each covering a class of reverb algorithms. For the next one, I'll be writing about rings of allpass filters—this is relevant to, for example, [Jon Dattorro's popular 1997 algorithm](https://ccrma.stanford.edu/~dattorro/EffectDesignPart1.pdf) that appears to be based on a plate reverb from [Lexicon's 224 and 480 reverb units](https://en.wikipedia.org/wiki/Lexicon_(company)#Reverb_and_effects). Until next time!

[^1]: This notation comes from the idea of the [Z-transform](https://en.wikipedia.org/wiki/Z-transform).

[^2]: Note that the triangle symbol is the standard DSP symbol for amplification/an amplifier.

[^3]: M. R. Schroeder and B. F. Logan, “‘Colorless’ artificial reverberation,” *IRE Transactions on Audio*, vol. AU-9, no. 6, pp. 209–214, Nov. 1961, doi: [10.1109/TAU.1961.1166351](https://doi.org/10.1109/TAU.1961.1166351).

[^4]: M. R. Schroeder, “Natural sounding artificial reverberation,” in *Audio Engineering Society Convention 13*, Audio Engineering Society, 1961. Accessed: Dec. 29, 2024. \[Online]. Available: [https://www.aes.org/e-lib/download.cfm?ID=343](https://www.aes.org/e-lib/download.cfm?ID=343)
