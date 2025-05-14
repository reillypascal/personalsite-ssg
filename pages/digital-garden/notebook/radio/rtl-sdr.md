---
title: RTL-SDR Software-Defined Radios
description: Notes on the RTL-SDR software-defined radio dongle, a low-cost radio receiver capable of HF, VHF, and UHF reception
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-14T03:15:00-0400
octothorpes:
  - 
tags:
  - digital-garden
  - notebook
  - radio
  - sdr
---

The [RTL-SDR](https://en.wikipedia.org/wiki/Software-defined_radio#RTL-SDR) is a ~$25 [software-defined radio](https://en.wikipedia.org/wiki/Software-defined_radio) device based on [DVB-T](https://en.wikipedia.org/wiki/DVB-T) dongles. In the most popular form, it uses the RTL2832U and Rafael Micro R820T chips to handle tuning and reception, then sends [IQ data](https://en.wikipedia.org/wiki/In-phase_and_quadrature_components#I/Q_data) over USB, usually over a span of 2.56 MHz at a time, although this can be widened and narrowed a bit in the software.

The [RTL-SDR.COM](https://www.rtl-sdr.com/) blog regularly posts interesting material on using this and similar software-defined radios, and they sell a popular [version](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/) of the tuner dongle. 

By default, the dongle can tune between about 28.8 MHz and 1.7 GHz — roughly the VHF and UHF ranges. However, it is popular to make a “[direct sampling](https://www.rtl-sdr.com/rtl-sdr-direct-sampling-mode/)” modification (or include it with many dongles, including the RTL-SDR blog units) that allows tuning between about 500 kHz and 28.8 MHz. The [instructions](https://www.rtl-sdr.com/rtl-sdr-blog-v-3-dongles-user-guide/) for the blog v3 dongle (the one I use) describe how to enable this in most programs (e.g., the cross-platform [SDR++](https://www.sdrpp.org/) or the Windows-only [SDR#](https://airspy.com/download/)). Enable the feature via a switch and select the “Q” branch. Note that I vs. Q branch depends on the hardware — the description [here](https://www.rtl-sdr.com/rtl-sdr-direct-sampling-mode/) says that 

> The I branch corresponds to pin one/pin two, and the Q branch corresponds to pin four/pin five

implying that the blog dongles use pin four/pin five.

### Hardware
- Nooelec
	- [Balun One Nine (Barebones)](https://www.nooelec.com/store/balun-one-nine-v2-barebones.html)
		- This is a [balun](https://en.wikipedia.org/wiki/Balun) (balanced-unbalanced converter) for impedance-matching large antennas with the SDR (e.g., for HF reception via direct sampling).
	- [Flamingo+ FM](https://www.nooelec.com/store/flamingo-plus-fm.html)
		- This is a bandstop filter targeting the FM broadcast band. This is useful because many signals of interest are much quieter than FM broadcast, and amplifying the full spectrum would “overdrive” the receiver and cause spurious “images” of the FM broadcast signals.
	- [LaNa](https://www.nooelec.com/store/lana.html)
		- This is an LNA ([low-noise amplifier](https://en.wikipedia.org/wiki/Low-noise_amplifier)) for boosting the incoming signal to receive faint sources. Put the FM bandstop filter in front of this to avoid amplifying FM broadcast stations.
- RTL-SDR Blog
	- [RTL-SDR V3 kit with dipole antenna](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/)
		- This includes the receiver as well as a [dipole antenna](https://www.rtl-sdr.com/using-our-new-dipole-antenna-kit/) and mount. The antenna link above includes instructions on the length of antenna to use for different frequencies.

### Raspberry Pi
- [These instructions](https://gist.github.com/floehopper/99a0c8931f9d779b0998) are working for me — left off after making/installing `rtl-sdr`
	- `git-core` [appears](https://forums.raspberrypi.com/viewtopic.php?t=88655) to be obsolete — just use `git`
	- Previously had issues with requirement for `libusb-1.0-0-dev` on macOS (dev version hardcoded in), but seemed to work fine on RPi as of May 14, 2025

### Software
- 433 MHz [ISM band](https://en.wikipedia.org/wiki/ISM_radio_band) devices, such as home weather stations, tire pressure gauges, etc.
	- rtl_433 
		- Install on macOS: `brew install rtl_433`
		- Source: <https://github.com/merbanan/rtl_433>
		- Google Groups discussion: <https://groups.google.com/g/rtl_433/>
- ADS-B
	- dump1090 — see [[ads-b#Software|ADS-B]]
- RTL-SDR: 
	- rtl-sdr/librtlsdr 
		- Install on macOS: `brew install librtlsdr`
		- Source: <https://github.com/osmocom/rtl-sdr>
	- SDR++
		- Install: download nightly release at <https://github.com/AlexandreRouma/SDRPlusPlus/releases>
			- See [[macos-terminal-commands#Gatekeeper|Gatekeeper]] notes for Gatekeeper issues
		- Source: <https://github.com/AlexandreRouma/SDRPlusPlus>