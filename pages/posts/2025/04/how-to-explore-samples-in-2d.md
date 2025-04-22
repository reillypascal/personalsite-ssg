---
title: How to Explore Samples in 2D | Max/MSP & Pd
description: 
fedi_url: 
date: 2025-04-22T13:08:55-0400
octothorpes:
  - Audio
  - audio
  - Art
  - music
tags:
  - post
post_series: 
draft: true
---

in my “[Databending Part 1](/posts/2025/01/databending-part-1/)” post, I describe importing various files into Audacity as raw data, and treating this raw data as audio. In other words, the bits and bytes that make up (for example) a program executable file can be reinterpreted as the amplitudes in an audio file, creating fun glitchy digital noise.

In that post I noted that

> if I want to avoid repeating myself between compositions, at a certain point I need to come up with new ways of using these databending sounds

The first problem is that there are a limited number of ways the program file data will sound. As I mention in “Databending Part 1,” when I hunt through the program files on my Macintosh, I notice the same sounds cropping up again and again, likely due to re-use of code between programs. Even putting aside the literal repetition, at a certain level of sonic complexity, it can become difficult to track the individuality of a sound or pattern, and my ear tends to fall back on perceiving the overall “vibe.” 

Today, I'll talk about ways to change the quality of these databending sounds, pulling together segments with related characteristics to create something new. This is all possible to do yourself with either Max/MSP or Pure Data/plugdata. Let's get into it!

### The Tools


### Loading Externals

The FluCoMa externals for Pure Data/plugdata can be dowloaded [here](https://github.com/flucoma/flucoma-pd/releases). Externals go in the folder ~/Documents/Pd/externals/ (or ~/Documents/plugdata/externals/). In Pure Data, add an object (cmd + 1 or ctrl + 1) and type `declare -lib FluidCorpusManipulation -path FluidCorpusManipulation`. The \[declare] object makes a set of externals available in a given patch, and this syntax will bring in FluCoMa. The same method works in plugdata, or you can make externals always available without the \[declare] object. To do this, go to Settings > Paths > Add Search Path, and add the folder ~/Documents/plugdata/externals/FluidCorpusManipulation.

In Max/MSP, simply go to File > Show Package Manager, and search for “FluCoMa” or “MuBu.” Once you install a package via the manager, it is globally available.

### Exploring a Collection with FluCoMa



Mubu
- <https://github.com/ircam-ismm/catart-mubu>
	- <https://cycling74.com/packages/catart-mubu>
Flucoma
- <https://learn.flucoma.org/learn/2d-corpus-explorer/>
	- <https://github.com/flucoma/flucoma-pd>

Douglas McCausland
- Demo: <https://m.youtube.com/watch?v=qMozIczQj9g>
- Why do you distort your face, \[READACTED]
	- Mix of granular, duffing, 2 layers of x-faded 2d corpora

Started interest w vox 5

In his book <cite>Formalized Music</cite>, composer Iannis Xenakis quotes his earlier essay, “The Crisis of Serial Music,” arguing that in the total serial [^1] music of the era

> Linear polyphony destroys itself by its very complexity; what one hears is in reality nothing but a mass of notes in various registers. [^2]

In other words, while the serial compositional techniques of the era involved a great deal of order in the construction of musical lines and patterns, because of this complexity, Xenakis hears the net result as a probabilistic cloud of sounds, with the ordered structure not easily audible. [^3] In a similar way, even when the underlying code creating a databending sound varies, the complexity of the patterns can obscure this variation, and I often end up perceiving the statistical average of the sounds, with the general quality or ”vibe” prevailing over the specifics. 

[^1]: Explain total serialism, link to resource (either music theory site or wiki)

[^2]: Iannis Xenakis, <cite>Formalized Music</cite>

	- <https://monoskop.org/images/7/74/Xenakis_Iannis_Formalized_Music_Thought_and_Mathematics_in_Composition.pdf> (p. 8)

[^3]: Include Klavierstuck link