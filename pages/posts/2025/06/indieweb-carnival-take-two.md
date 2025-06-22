---
title: "IndieWeb Carnival: Take Two"
description: I've been mostly making music tools rather than writing music. Today I'm talking about getting out of this rut with a “take two” on my current composition.
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-06-25T12:30:00-0400
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
  - music
draft: true
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

As I program and patch my own electronic music tools and setups, I find myself in the exact same position of making music tools instead of actually making music. For my “take two,” I'll discuss why I seem to have ended up here and some recent thoughts about composition that I'm hoping are taking me out of this rut.

## How Did I Get Here?

While I see some good things in my compositions from the past few years, I'm still not completely satisfied. The main area I'm dissatisfied with is [texture](https://musictheory.pugetsound.edu/mt21c/Texture.html). This is the sum of all elements occurring at a given moment: is there melody/accompaniment; multiple melodies; a “mass” of sound; unpitched percussion; or some other combination of musical elements? 

First the good. In (for example) the first few minutes of [*Afterimage from*](https://makertube.net/w/7Bux8qi7gh4bu8iJokmQPQ) I like the “databending” and radio sounds; the amplified cello feeding back through a “wah-wah” pedal and tiny amp; and the “junk” percussion, including jars and pieces of metal. I also (in general) like to write thin, pointillistic textures, with fine details of each element clearly audible. However, when I listen back to the result here, I feel something is missing. 

In contrast is [*If this reaches you*](https://applytriangle.bandcamp.com/track/if-this-reaches-you). I got this piece recorded much more recently than *Afterimage from* (despite the former being written first). *If this reaches you* came together much more quickly than many other compositiona, and upon hearing the recording, it's become one of my favorites. However, it's only recently that I realized what was working for me there that I was missing in other compositions. For a while I had been trying countless bits of sound design, beat sequencing, and audio coding to get another piece that worked, but to no avail. What changed?

## What Do I Want to Do?

I like when a composition seems to “float” rather than drilling a pulse into me. Even though (e.g.) Autechre's [*Tapr*](https://autechre.bandcamp.com/track/tapr) and [*qplay*](https://autechre.bandcamp.com/track/qplay) have drum machines, there is enough irregularity in the rhythm that I can relax and let go of pulse, while still enjoying the energy and character of the beat. 



<!-- [*Everything lost along the way*](https://makertube.net/w/pktRnMxDGUKC6XPtbKqmW4)

[*Outlive everything you know*](https://www.youtube.com/watch?v=2dz0iKwHrkI)

[*Reach Through*](https://makertube.net/w/9UxZA1pmirmKndWaFkqDzz) -->

<!-- First, I have a tension between some of the areas of music I like. I was trained in a “classical music” program, [^1] and I love experimental music that's made in both “classical” and ”popular”/dance music contexts. In terms of experimental music from a “popular music” background, I love Autechre (see [*Gantz Graf*](https://autechre.bandcamp.com/track/gantz-graf-1) or [*Tapr*](https://autechre.bandcamp.com/track/tapr)) and Fire-Toolz (see [*Clear Light*](https://fire-toolz.bandcamp.com/track/clear-light) or [*Soaked: Another Name For Everything*](https://fire-toolz.bandcamp.com/track/soaked-another-name-for-everything)). From a “classical music” background, I particularly like Kelley Sheehan ([*Talk Circus*](https://www.youtube.com/watch?v=gH3kxga4_JY)), Simon Steen-Andersen ([*on and off and to and fro*](https://www.youtube.com/watch?v=sYiG2DDVS7Y)), and Alexander Schubert ([*Serious Smile*](https://www.youtube.com/watch?v=VCVMHqzenMA)). 

There are numerous differences between all these artists' experimentalism, but as I've heard composer peers flippantly joke, in some ways the distinction comes down to “does it have a (drum) beat?” Most of my own work has fallen on the “no drum beat” side, and the main reasons are that 1\) drum beats are difficult to do “right” by my tastes, and 2\) drum beats (and other elements I like from dance music) are difficult to incorporate into the types of sound world that e.g., Kelley Sheehan might do. -->

<!-- These artists pull from dance music and hip-hop (Autechre) and metal/new age/jazz fusion/prog rock/glitchy sound collage/many other things (Fire-Toolz).  -->

<!-- [^1]: I make the distinction between “classical” and “popular” music knowing full well that it's a subjective, potentially problematic distinction. -->
