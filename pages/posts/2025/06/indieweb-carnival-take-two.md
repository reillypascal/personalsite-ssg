---
title: "IndieWeb Carnival: Take Two"
description: I've been mostly making music tools rather than writing music. Today I'm talking about getting out of this rut with a “take two” on my current composition.
fedi_url:
  - https://hachyderm.io/@reillypascal/114732920215834609
  - https://bsky.app/profile/reillypascal.bsky.social/post/3lscevjshfs2d
date: 2025-06-23T08:16:00-0400
octothorpes:
  - Art
  - Audio
  - blogging
  - indieweb
  - music
tags:
  - post
  - composition
  - indieweb
  - indieweb-carnival
  - music
indienews: true
---

Nick Simson is hosting [this month's IndieWeb Carnival](https://www.nicksimson.com/posts/2025-indieweb-carnival-take-two.html) on the theme “take two.” After having needed to pick a new topic, he writes

> Ever wish for a do-over? “Take two!” (or three, four, etc.) might be shouted by a film director or audio engineer looking to get a somewhat different outcome from a group of actors or musical performers. Would you like a second shot at something that didn’t land?

I immediately thought of my current experience of composing when I read this. I have a composition that I started back in summer 2023 for which I still haven't written much in the way of notes on the page. I tend to start a composition by working in [Max/MSP](https://en.wikipedia.org/wiki/Max_(software)), usually using some combination of [databending](/posts/2025/01/databending-part-1) and [software-defined radio](/notes/2025/05/tracking-planes-with-a-raspberry-pi) (SDR) [samples](/posts/2024/04/new-album-announcement/); [sequenced/probabilistic sample/synth patterns](/posts/2024/05/composition-journal); and VST synths/electric pianos, with these different categories assigned to different regions of a MIDI keyboard.

In addition to patching in Max, this process requires composing samples (usually in Logic Pro) to “glitch up” or otherwise manipulate in Max; digging through large collections of “databending” files; sessions of scanning the airwaves on my SDR equipment and recording what I hear; and more recently, coding projects such as my [script to glitch up MP3s](/posts/2025/04/databending-part-3/), my [tool to automate the databending process](/posts/2025/05/databending-part-4/), or my [implementation of the VOX ADPCM codec](/posts/2025/05/databending-part-5/) to get more variety in databending.

Nathan Ho [describes what he calls “system-building syndrome”](https://nathan.ho.name/posts/system-building-syndrome/). For context, 

> Synthesizer forums have a long-running joke about “Gear Acquisition Syndrome” that pictures the stereotypical hobbyist with all their Hainbach-endorsed gear, seemingly oblivious to the fact that they’re intended for making music.

In using [SuperCollider](https://en.wikipedia.org/wiki/SuperCollider) and C++ to make his own versions of this kind of gear, he comments that

> I thought I was being clever circumventing \[Gear Acquisition Syndrome (GAS)] by building everything myself, but what really happened is that I had fallen into my own version of GAS: I had System-Building Syndrome.

As I program and patch my own electronic music tools and setups, I find myself in the exact same position of making music tools instead of actually making music. For my “take two” I'm throwing out a bunch of material (or rather putting it in a safe place to draw from later) and restarting this piece with a different approach. I'll discuss how I seem to have ended up here and some recent thoughts about composition that I'm hoping can take me out of this rut.

## Why Do I Keep Building Systems?

Two things I like that are challenging to do to my satisfaction are 1\) I like to write thin, pointillistic textures, and 2\) I like when a composition seems to “float” (rather than drilling a pulse into me) but at the same time has rhythmic energy. For both of these, see the opening of [*If this reaches you*](https://applytriangle.bandcamp.com/track/if-this-reaches-you). The bursts of clarinet and sampler float around a rhythmic “backbone” in the flute and sampler. This backbone consists of a clicking tremolo from using an [electromagnetic pickup](https://www.youtube.com/watch?v=iQKfKuEqyYs) on a wi-fi router, [^1] and a syncopated, metronome-like pattern of 8th and quarter notes in the flute, sitting on a single pitch for a while.

While I'm happy with *If this reaches you*, I've struggled for a while to write something else that satisfies me in the same way, and I've particularly struggled with creating the right rhythmic “backbone.” As further examples of what I like, Autechre's [*Tapr*](https://autechre.bandcamp.com/track/tapr) and [*qplay*](https://autechre.bandcamp.com/track/qplay) (among others) have drum machines, but there is enough irregularity in the rhythm that I can relax and let go of pulse, while still enjoying the energy and character of the beat. Despite how much I like Autechre, I have different goals that make things more complicated.

I'm writing something in between the experimentalism that comes out of dance or “popular” music and the experimentalism that comes out of “classical music” circles. [^2] As I've heard composer peers flippantly joke, in some ways the distinction comes down to “does it have a (drum) beat?” Drum sets/drum machines are very bold musical elements and require careful recording and sound design to sound right, and between that and my desire to work *between* “popular”/“classical” experimentalism, I have very exacting requirements for how the rhythmic backbone should sound. At the same time, because I want to make something that sounds “fresh” to my ears I don't even fully know what I'd like to hear. [^3]

## Take Two

Because I've tried so many different things, the Max patch and the surrounding file folders for my current project have become unworkable. It took a huge load off my shoulders to make a backup copy of the folder and then throw out most of the files and patching from the working copy. The couple of elements that were already working great stayed, and I got a nice blank slate to start again.

I'm still in the process of selecting samples for my Max patch, but instead of spending so much time designing sequencers and percussion patterns, I've been looking at the simple materials I used for *If this reaches you* and seeing what I can accomplish if I hold myself to that kind of simplicity this time around too. [^4]

I've reminded myself that this doesn't mean I've wasted my time. On the contrary, the time I've spent on this project has given me a lot of practice on audio programming, sound design, and Max/MSP drum sequencing. The things I played with in this time haven't gone away either; I can return to the backup folder at any time to borrow bits of what I worked on.

## Wrapping Up

Thanks to Nick for hosting this month's carnival! This topic helped me write about and think through something that's been percolating for a while, and I'm hopeful that it will help my composition process moving forward. Until next time!

[^1]: I've found that many routers make a similar sound, although I'm not sure what feature that is.

[^2]: For experimental music I like from “popular music” circles, see also Fire-Toolz (example tracks: [*Clear Light*](https://fire-toolz.bandcamp.com/track/clear-light) or [*Soaked: Another Name For Everything*](https://fire-toolz.bandcamp.com/track/soaked-another-name-for-everything)). From a “classical music” background, I particularly like Kelley Sheehan ([*Talk Circus*](https://www.youtube.com/watch?v=gH3kxga4_JY)), Simon Steen-Andersen ([*on and off and to and fro*](https://www.youtube.com/watch?v=sYiG2DDVS7Y)), and Alexander Schubert ([*Serious Smile*](https://www.youtube.com/watch?v=VCVMHqzenMA)).

[^3]: To some extent, I'm sure the desire for something new and previously unheard comes from my enjoyment of 20th century modernism, and from absorbing the ideas from those circles. It's a goal I've interrogated for a while, and I may move on from it at some point—at any rate, I realize it's someting worth questioning!

[^4]: In addition to what I described above, this piece was the first one I wrote with significant use of Max/MSP, and all it uses is a sampler of databending/radio sounds on the bottom keys, and an electric piano VST on the upper ones. I'm hoping that sticking to this kind of minimal setup may help focus my work.
