---
layout: blogpostlayout.liquid
root_folder: ../../../..
title: Connecting Notation Programs to Max/MSP
description: Getting Dorico and Max/MSP to talk via MIDI — it really helps my composition!
canonical_url: https://reillyspitzfaden.com/posts/2024/11/connecting-notation-programs-to-maxmsp
url: posts/2024/11/connecting-notation-programs-to-maxmsp
date: 2024-11-25
categories: [ "maxmsp", "music", "composition", "electronicmusic" ]
tags: post
---

## Connecting Notation Programs to Max/MSP

I like to compose music for a combination of acoustic instruments and a keyboardist playing a MIDI keyboard that's connected to [Max/MSP](). I'm not much of a pianist myself, plus it's nice to just watch and listen to MIDI playback when I'm composing, so earlier this year I thought to have my notation program send MIDI to Max just as the keyboardist would. I originally figured this out in [Finale](https://en.wikipedia.org/wiki/Finale_(scorewriter)), but with the recent [sunsetting](https://www.finalemusic.com/blog/end-of-finale-new-journey-dorico-letter-from-president/) of Finale, I've switched to [Dorico](https://en.wikipedia.org/wiki/Dorico) for notation, and there have been both some benefits and challenges in connecting Dorico to Max.

### Virtual MIDI Cables
On macOS, you can use the [IAC Driver](https://support.apple.com/guide/audio-midi-setup/transfer-midi-information-between-apps-ams1013/mac) to set up virtual MIDI buses between various devices. [^1]

[^1]: I haven't yet tried this on Linux/Windows. For Linux, it it looks like it's possible to do with Jack, or directly with ALSA. For Windows, it doesn't look like there's a built-in method, but [loopBe1](https://www.nerds.de/en/loopbe1.html) could be an option.

In Finale, I had the option to use either MIDI or Audio Units for sound, but not both. My temporary solution was to set IAC as the MIDI device and make a Max patch to run the virtual instruments I needed. Not very convenient! 

With Dorico, on the other hand, you can go to the Play view > VST and MIDI, and choose any number of both VST/AU and MIDI instruments. One issue that I (and it seems [other people](https://forums.steinberg.net/t/midi-instruments-and-mac-iac-brittle-setup/828392/3)) had was that Dorico defaults to enabling the IAC device as a MIDI input, so the MIDI signals feed back and/or end up playing other VST instruments. It took me a bit to figure out, but if you go to Preferences > Play > MIDI Input Devices, and uncheck IAC Driver Bus 1, that fixes the issue. A pretty simple setting, but since I only recently switched to Dorico, it was quite vexing for a while.

### Composing in Max
Until earlier this year, when I had music that uses a MIDI controller with Max, I composed by playing the part myself while Finale played back the other instruments. It's a pain keeping in sync and starting at the same time (there's usually a slight delay between pressing play and Finale starting, for example). 

Even with the IAC bus and Finale, the extra steps of opening the Max patch with the rest of the instruments was annoying when I had a quick idea to jot down. While I could temporarily switch back to using VST/AU instruments in Finale, doing so usually messed up the MIDI channel assignments, and made my Max VST/AU host patch stop working.

In Dorico, not only can I mix MIDI and VST/AU instruments, I can easily switch back and forth which one a given track uses with no issue. With the feedback issue sorted, it makes writing a lot nicer.

Here's a demo of that in action:
![]()
