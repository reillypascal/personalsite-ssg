---
title: Radio — Listening Musically, Being Haunted
description: Listening to radio signals, allowing them to haunt me, and composing music with them
canonical_url: https://reillyspitzfaden.com/posts/2024/12/radio-listening-musically
date: 2024-12-14
octothorpes:
  - Audio
  - music
tags:
  - post
  - hobbies
  - music
  - radio
  - sdr
---

In around 2019 I stumbled across the [Wide-band WebSDR](http://websdr.ewi.utwente.nl:8901/) ^[ A [software-defined radio](https://en.wikipedia.org/wiki/Software-defined_radio) (SDR) system often looks like a simple radio receiver and analog-to-digital converter connecting to a computer, with the tuning, filtering, demodulation, and most other features handled by software. This "WebSDR" consists of a receiver in the Netherlands that makes the signals it receives available to stream over the web. ] at the [University of Twente](https://en.wikipedia.org/wiki/University_of_Twente) in the Netherlands. I was hooked. The cold, alien tones of the many data signals ([clock synchronization](https://www.sigidwiki.com/wiki/DCF77), [pagers](https://www.sigidwiki.com/wiki/POCSAG), [modems](https://www.sigidwiki.com/wiki/STANAG_4285), and more) were unlike anything I'd heard before. Many voice signals sound otherworldly as well — shrouded in noise, filtered to a narrow band, and often automated to read data such as [weather information for pilots](https://www.sigidwiki.com/wiki/Single_Sideband_Voice#Hear_RAF_Volmet_.28USB_Voice.29_Live_at_WebSDR_Univ._of_Twente_.28Alternate_Frequency.29). 

There's also the awareness that the sounds I'm hearing are at a vast distance, both from me to the receiver in the Netherlands, and often from the receiver to the signals. In the [shortwave](https://en.wikipedia.org/wiki/Shortwave_radio) bands (~3–30 MHz), "[skywave](https://en.wikipedia.org/wiki/Skywave)" or "skip" propagation occurs. Radio waves at those frequencies bounce off the ionosphere, traveling much further than the distance to the horizon. Using my own receiver ^[ For the curious, I used an [RTL-SDR](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/) USB dongle and a Nooelec "[Balun](https://www.nooelec.com/store/balun-one-nine.html)" to [match the antenna and receiver impedance](https://en.wikipedia.org/wiki/Impedance_matching), with two long pieces of wire for the antenna. ] which I acquired in early 2020, I once heard a station in Japan from my home in upstate New York. When I listen, I feel deeply aware of the vast gulf between me and the signal, and in the interference the signal has gathered on its way to me, this gulf is present in the sound in a very tangible way.

When listening, I still struggle to fully encapsulate my emotive response to the sounds, but from the beginning I knew I had to connect this to my composition somehow.

### The "Sonic Spectre" — Allowing Our Media to Haunt Us
Around the same time I discovered the Twente WebSDR, I read Kristen Gallerneaux's book "[High Static, Dead Lines](https://mitpress.mit.edu/9781907222665/high-static-dead-lines/)," which was equally as impactful to me. As she weaves together spurious radio signals during a [1934 high altitude balloon test](https://en.wikipedia.org/wiki/Jeannette_Piccard#Flight); the [Max Headroom signal hijacking](https://en.wikipedia.org/wiki/Max_Headroom_signal_hijacking); and the eerie voices of the [Votrax](https://en.wikipedia.org/wiki/Votrax) speech synthesizer, Gallerneaux calls on us to “allow our media to haunt us," and finds these moments of haunting to be “crucial to understanding” sonic media.

As an example of this haunting, she gives the anecdote of being awake at night as a child, roaming the house alone, and trying out a 45 RPM record she had discovered, accidentally playing it back at 33 &frac13; RPM. The resulting sound was "demonic" and terrifying on its own, and coupled with her young age, solitude, the late hour, and the element of surprise, this moment became a much deeper experience than a simple playback error might seem.

As I scan through the shortwave bands, I notice feelings of loneliness and the sense of being in a wide-open space as I ponder the vast distances involved. I feel as if I'm hearing something that wasn't meant for my ears. And the crackles, the rushing, ringing sound of the narrow filter on the sound, and the buzz of machines communicating sends a chill down my spine, much like I truly am being haunted.

### Telecommunications Sounds in Music
I'll now discuss some compositions (both others' and my own) that incorporate radio signals as an illustration of how these sounds can be heard as musical. 

John Cage, *Imaginary Landscape, No. 4* (8)

William Basinski, *Shortwavemusic*
(also known for disintegration loops, the river) (4)

Nicolas Collins, *Devil's Music* (11)

Anna Friz, *Respire* (17)

Sawako Kato, *2.4GHz Scape* (20)

Finally, as I wrote in a [blog post](https://reillyspitzfaden.com/posts/2024/04/new-album-announcement/), my piece [*If this reaches you*](https://applytriangle.bandcamp.com/track/if-this-reaches-you) for flute, clarinet, and MIDI keyboard incorporates a number of radio signals. The keyboard is connected to a computer running [Max/MSP](https://en.wikipedia.org/wiki/Max_(software)), which allows the upper part of the keyboard to play electric piano sounds, and the lower octave or so to play radio samples, one to a key. These samples include [pagers](https://www.sigidwiki.com/wiki/POCSAG), [trunking control channels](https://www.sigidwiki.com/wiki/Project_25_(P25)#Audio_Samples), [clock synchronization signals](https://www.sigidwiki.com/wiki/Primex_Wireless_Time_Sync), and home [weather sensors](https://www.sigidwiki.com/wiki/ISM_Band_Weather_sensor), among other data signals, as well as emergency and aviation voice channels. 

By having these samples assigned to keys on a keyboard, I can quickly toggle between them. Since the data signals include pitched components, the rapid switching between these samples sounds almost like a melody. 

### Challenges
One of the biggest challenges I've run into in using this material is the small pool of sounds. With [*If this reaches you*](https://applytriangle.bandcamp.com/track/if-this-reaches-you), I already covered a significant portion of the available sound palette, and [after](https://www.youtube.com/watch?v=2dz0iKwHrkI) [four](https://makertube.net/w/pktRnMxDGUKC6XPtbKqmW4) [subsequent](https://makertube.net/w/7Bux8qi7gh4bu8iJokmQPQ) [pieces](https://www.youtube.com/watch?v=YtSerbT7C5A), I'm starting to feel at a loss as to how to go forward. 

I've found that the way data is encoded in a signal has much more impact on the resulting sound than the exact data itself. As a result, each individual transmission of (for example) a [pager](https://www.sigidwiki.com/wiki/POCSAG) sounds quite similar. Since there are only so many ways used to encode data into radio signals (especially when restricted to the signals audible from either my house or the University of Twente), at a certain point, it becomes difficult not to repeat myself when composing using these sounds. However, I do still love them and want to use them.

Another challenge is time. The act of scanning through the radio spectrum (as in Cage's *Imaginary Landscape, No. 4*) is relatively slow, and slower still if I wait for anything specific to happen. While I enjoy the Cage piece, in my own work I prefer to have things more "event-dense" — rather than slow, spacious exploration of a sound, I like to write more rhythmic energy and more variety in a given time span. This means that when I write, I'm often trying to compress the "vibe" or "feeling" of a session of shortwave listening into a much different time frame while still keeping the essence of the "vibe" intact. It's a skill I'm still working to refine.

### Final Notes
That's all for today! I've been interested in writing about electronic music and sound design from the angle of aesthetics and experience — [my](https://reillyspitzfaden.com/posts/2024/02/composition-journal/) [previous](https://reillyspitzfaden.com/posts/2024/05/composition-journal/) [posts](https://reillyspitzfaden.com/posts/2024/11/connecting-notation-programs-to-maxmsp/) on electronic music have tended toward technical rather than aesthetic discussions. I plan to write more like this in the near future. I hope to see you then!

{% postfooter title, canonical_url %}