---
title: Composition Journal, Feb. 27, 2024
description: Spectral compositing sound design from my work-in-progress “Forget your name”
date: 2024-02-27
tags: ["post", "music", "composition", "maxmsp", "sound-design"]
---

I'm currently working on a piece for (tentatively) B-flat clarinet; MIDI keyboard/Max; and a percussionist playing a mix of standard instruments, “junk,” and feedback setups.

One of the sound design techniques I've been enjoying lately is making a “spectral composite” of two sounds using Eric Lyon's “[FFTease](https://github.com/ericlyon/FFTease3.0-MaxMSP)” Max/MSP package. I'm using the `fftz.ether~` object, which:

- Takes the FFT of two sounds
- Compares the corresponding bin between the two FFTs
- Takes either the louder or quieter of the two, depending on the settings
- The choice can also be “weighted” toward one source or the other

I particularly like the effect of taking the quieter of the two. It's great for combining a more sustained sound and one with a percussive envelope. As the percussive sound decays, more and more of its bins “win out,” imparting a percussive envelope on the output.

## Sound 1: tonal/sustained

For today's sound, my sustained, tonal source was made with the open-source [Surge XT](https://surge-synthesizer.github.io) synthesizer. Surge XT contains an oscillator titled “Twist” that appears to be an implementation of Mutable Instruments' “[Plaits](https://pichenettes.github.io/mutable-instruments-documentation/modules/plaits/)” Eurorack module. I'm using one of the organ-like wavetables to create a sound that rapidly morphs between low and high harmonics. Additionally, Surge XT supports microtuning, and I'm using the 131313... mode of [20-edo](https://en.xen.wiki/w/20edo).

<audio controls>
    <source src="/media/blog/2024/02/plaits_organ_rand_sweeps_2.mp3" type="audio/mp3">
</audio>

I then used a trick I've discovered to make samples sound like they're played through an untuned FM radio. I have a collection of samples of just raw radio static. If I use those samples to modulate a delay on my source, the static convincingly changes in amplitude along with the sample.

<audio controls>
    <source src="/media/blog/2024/02/radio_synth_fft.mp3" type="audio/mp3">
</audio>

In addition to sounding cool, the static gives the next stage something to “chew on.” I used the phase vocoder from [Cycling '74's](https://cycling74.com/tutorials/the-phase-vocoder-–-part-i) tutorial to time stretch my staticky chords, and the static causes all kinds of nice artifacts in the phase vocoder. After this, I added a little bit of saturation because having `fftz.ether~` pick the quieter bin can sometimes sound a bit dull.

<audio controls>
    <source src="/media/blog/2024/02/radio_synth_fft_pvoc.mp3" type="audio/mp3">
</audio>

## Sound 2: noisy/rhythmic

On the other side, I started with a sine wave oscillator in gen~ frequency-modulating itself at a single-sample delay (it was this short delay that made me need to use gen~). I used the rand~ object to modulate a number of parameters, including the starting frequency and modulation depth. This produces some nice staticky, rhythmic noises that sound like a very light synthetic snare.

I then used Logic Pro's “flex time” feature to quantize the result to a 16th note grid (which also adds some nice time stretching artifacts!)

<audio controls>
    <source src="/media/blog/2024/02/fm-fb-osc-rand_bip.7.mp3" type="audio/mp3">
</audio>

I play two copies (one for left and one for right) of the sample with random modulation of the speed and direction.

<audio controls>
    <source src="/media/blog/2024/02/fm-fb-osc-rand_bip.7_proc.mp3" type="audio/mp3">
</audio>

## Sound 1 & 2 combined

Finally, when I put both the sustained and percussive sources into `fftz.ether~` the end result sounds like this:

<audio controls>
    <source src="/media/blog/2024/02/spectral_composite_dry.mp3" type="audio/mp3">
</audio>

I was going for something to fill out and add activity to the upper register, and I'm very happy with how it turned out.

## Conclusion

I want to give a shout out to [Nathan Ho](https://nathan.ho.name/archive.html). I appreciate his blogging about making sounds in SuperCollider, and it's inspired me to do write-ups of my own sound design.

Today's sounds will be combined with the chord synthesizer I mentioned on Mastodon [last month](https://hachyderm.io/@reillypascal/111773037885275169). All of this is played by the keyboardist, with today's sound (and variants of it using different chords) each being assigned to a single MIDI note. Ideally I would like to be composing more quickly, but I'm teaching a class I've never taught before (Intro to Music Business), in addition to other teaching, so that's been taking up a lot of my time.

If you'd like to try this for yourself, [here's](https://mega.nz/folder/cLVzHCBZ#SVlAyRb0RPL7sUwnXfke8A) a link to the patches and other materials. You'll need the FFTease package and Max 8.
