---
layout: blogpostlayout.liquid
root_folder: ../../../..
title: New Album Announcement
description: My trio "If this reaches you" is on Apply Triangle's new album, out on April 12!
canonical_url: https://reillyspitzfaden.com/posts/2024/04/new-album-announcement
url: posts/2024/04/new-album-announcement
date: 2024-04-05
categories: ["music", "composition", "maxmsp"]
tags: post
---

One of my compositions is on an upcoming album! It's performed by [Apply Triangle](https://applytriangle.com/), a NYC-based electroacoustic trio comprising Yoshi Weinberg (flutes), Tyler Neidermayer (clarinets), and Jixue Yang (piano/keyboards).

The album is a [3-disc set](https://applytriangle.bandcamp.com/album/oxalis-triangularis-complete-volumes-1-3), and my piece — "If this reaches you" — will be on [volume 2](https://applytriangle.bandcamp.com/album/oxalis-triangularis-vol-2).  
It comes out on April 12, and you can pre-order in digital and CD format now!

### Composing *If this reaches you*

When I wrote the piece, I had recently discovered [software-defined radio](https://en.wikipedia.org/wiki/Software-defined_radio). I use an [RTL-SDR](https://www.rtl-sdr.com/about-rtl-sdr/) receiver — a small USB dongle that contains a tuner and ADC chip — and the tuning and demodulation is handled in the computer, using software like [SDR++](https://www.sdrpp.org/) or [SDRSharp](https://airspy.com/download/).

The receiver can pick up analog voice communication (e.g., ambulances, air traffic controllers, etc.), and digitally-encoded transmissions such as pagers, clock synchronization signals, and weather map faxes. Fun fact: the background image for my site is one such weather fax! The digital communications sound something like a [dial-up modem](https://freesound.org/people/wtermini/sounds/546450/), and work in a similar way. The analog voice sounds crackly and staticky, and I can often hear sounds in the background, giving fascinating, but extremely limited glimpses into what's happening on the other end.

Especially in [shortwave bands](https://en.wikipedia.org/wiki/Shortwave_bands), the signals I picked up often came from great distances — at one point, I picked up a station from Japan. As I listened, I felt both connected to all the signals' sources, but also a great sense of distance and loneliness. As I found ways to combine the radio sounds with unusual and experimental sounds from the instruments, the radio sounds strongly evoked memory, loss, nostalgia, and distance for me.

### Technical Notes

To play the radio sounds, I made a Max/MSP patch for the pianist that assigns radio samples to the lower keys, and has a bright, electric piano sound on the higher ones. The clarinetist plays a variety of [multiphonics](https://heatherroche.net/category/multiphonic/) and other extended techniques, and the flutist also has a cardboard box to scrape with a cello/bass bow.

### Program Note

I wrote a short poem as a program note for the piece:

> I watched the space between the houses undergo a sea change  
> Into something slippery and strange  
> Though it wasn’t mine to hold, I still carry it with me

> I walked as far as daylight would take me  
> The wires stayed the same  
> I brought them back anyway to show that I had done my due diligence

> A satellite floated overhead today and reminded me of home

> I can hear it now  
> I am not the only one left to tell the tale

> A letter came, but the sky had already touched the ground behind me, so I kept walking

### The Project

Here's the announcement from the ensemble:

> Announcing "Oxalis Triangularis" - a triple album of thirty-three new works from thirty-three composers recorded in a fully remote setting by Apply Triangle. The project was developed through a call for scores in the summer of 2020 and stems from the resilience of artists to continue to create through a global pandemic. It is a testament to the flexibility and creativity possible through electroacoustic composition.

> Oxalis Triangularis refers to the scientific name for a purple “false shamrock” due to its triangle-like leaves. Throughout three albums Apply Triangle not only showcases the innovative techniques of 33 living composers but also highlights the embodied cultural nuances inherent in each composer’s style.

Thanks for reading, and I would love if you check out the album!

{% postfooter title, canonical_url %}

<style>
    blockquote {
        margin-left: 0;
        color: hsla(208, 15%, 67%, 1); /* hue from aliceblue */
        border-left: 1px solid hsla(208, 15%, 67%, 1);
        padding-left: 12px;
    }
    /* blockquote > p {
        border-left: 1px solid hsla(208, 15%, 67%, 1);
        padding-left: 12px;
    } */
    @media screen and (min-width: 480px){
        blockquote {
            margin-left: 12px;
        }
    }
</style>
