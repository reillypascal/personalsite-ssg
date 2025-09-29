---
title: Tracking Planes with a Raspberry Pi
fedi_url:
og_image: /media/blog/2025/05/dump1090-net-debian-screenshot-051525.jpg
og_image_width: 1200
og_image_height: 630
date: 2025-05-15T15:56:12-0400
tags:
  - note
  - radio
  - sdr
  - adsb
  - raspberry-pi
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

I'm tracking airplanes by listening to their [ADS-B](https://en.wikipedia.org/wiki/Automatic_Dependent_Surveillance%E2%80%93Broadcast) transponders over the airwaves! I have [dump1090](https://github.com/antirez/dump1090) running on a Raspberry Pi, sending the aircraft data over my local network, and an [RTL-SDR](https://en.wikipedia.org/wiki/Software-defined_radio#RTL-SDR) receiver (silver dongle in the Pi in the second photo) picking up the signal.

<!-- [notes on ADS-B transponders](/digital-garden/notebook/radio/ads-b) -->
<!-- [using an RTL-SDR receiver more generally](/digital-garden/notebook/radio/rtl-sdr) -->

I've started some notes on ADS-B transponders as well as on using an RTL-SDR receiver more generally in the new [digital garden](/digital-garden) section of my site. I've started putting project notes from my [Obsidian](<https://en.wikipedia.org/wiki/Obsidian_(software)>) notebook on my site — I like the idea of thinking through things in public.

If you want to track planes yourself, you can also use [ADS-B Exchange](https://globe.adsbexchange.com/) — it takes in data from a bunch of volunteers doing similar stuff to what I'm doing here.

![A screenshot of a terminal window and Firefox. There is a table of aircraft data (flight codes, heading, altitude, speed, etc.) in the terminal, and a map of the airplanes in Firefox.](/media/blog/2025/05/dump1090-net-debian-screenshot-051525.webp)

![A Raspberry Pi with a small silver dongle, connected to a dipole antenna suctioned to a window.](/media/blog/2025/05/rtl-sdr-raspberry-pi-window-adsb-051525.webp){.img-vertical}

