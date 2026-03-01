---
title: "Quarter & Eighth Tones in Lilypond"
description: I needed to write multiphonics in Lilypond, so today we're talking about notating and playing back microtones.
fedi_url:
og_image:
og_image_width:
og_image_height:
og_image_alt:
date: 2026-03-07T12:00:58-0500
tags:
  - post
post_series: lilypond
draft: true
---

<!-- <link rel="stylesheet" type="text/css" href="/styles/notes-photos.css"> -->

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

Multiphonics are a way of playing woodwind instruments (among others) that produces multiple frequencies at a time. Clarinetist Heather Roche has a [number](https://www.heatherroche.net/2018/09/13/27-easy-bb-clarinet-multiphonics) of [helpful](https://www.heatherroche.net/2019/09/24/dyad-multiphonics-for-bb-clarinet-part-ii-a-second-look-at-philip-rehfeldts-chart) [posts](https://www.heatherroche.net/2019/12/16/9-multiphonics-that-overblow-from-the-second-harmonic) demonstrating these effects. The frequencies in multiphonics are often [microtonal](https://en.wikipedia.org/wiki/Microtonality) — i.e., they are outside the 12 notes of the piano. While the exact interval between the pitches varies, it's common to notate them with quarter and eighth tones. Piano keys are spaced in semitones, so these are one half and one quarter of the interval on a piano, respectively.

In a project I'm currently working on, I need to write these techniques in [Lilypond](https://lilypond.org/). While the software includes quarter tones by default, it doesn't appear to include eighth tones, so I went ahead and defined my own. It's possible to extend the default capabilities of Lilypond using the Scheme programming language (a version of Lisp), and [this tutorial](https://extending-lilypond.gitlab.io/en/scheme/index.html) covers both the language and its integration into Lilypond. I also found [two](https://wiki.lilypond.community/wiki/Microtonal_notation_and_theory_of_harmony) [pages](https://wiki.lilypond.community/wiki/Arrow_notation_and_transposition_for_quarter_tones) on the Lilypond wiki that demonstrate slightly different uses of microtones.

My results are in [this Lilypond file](https://codeberg.org/reillypascal/forget/src/branch/main/include/eighth-quarter-tones.ly). Let's have a look at how it works!

## Defining the Frequency Intervals

page 749 (PDF page 762) of [the PDF version of the Lilypond docs](https://lilypond.org/doc/v2.24/Documentation/notation.pdf)
