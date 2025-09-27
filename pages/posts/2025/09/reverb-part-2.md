---
title: "Reverb Part 2: Sounding More Natural with Allpass Rings"
description: I discuss a lovely-sounding family of reverb algorithms that improve on the Schroeder designs from last time. They're available in my plugin, and I link to Max/MSP versions as well.
fedi_url:
og_image:
og_image_width:
og_image_height:
date: 2025-09-29T12:30:00-0400
octothorpes:
  - Audio
  - audio
  - music
tags:
  - post
  - reverb
  - audio
  - programming
  - dsp
  - maxmsp
  - plugin
  - cpp
  - juce
post_series: reverb
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

Continuing from [a previous post](/posts/2025/06/reverb-part-1), today we'll be looking at another collection of reverb algorithms that I've implemented in my [reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb/releases). With only a small increase in complexity over last time, we can get a reverb that grows in density over its duration, much as a real room would, and that sounds smoother and less metallic.

There are two key differences between the designs here and [the Schroeder reverb I discussed previously](/posts/2025/06/reverb-part-1/#the-classic-schroeder-reverberator): 1) in this design we will “nest” an allpass filter within another allpass filter, causing the echo density to grow over time, and 2) we will connects the ends of a chain of allpasses into one large “ring,” smoothing out the sound. Let's discuss how this all works!

## Nested Allpass Filters

As we [previously discussed](/posts/2025/06/reverb-part-1/#allpass-filters), an allpass filter is created by a feedforward and feedback delay in series, with the gain of one of them being negative. This lets all frequencies through at equal amplitude, but delays different frequencies by different amounts, “smearing” or “blurring” the rhythmic attacks of an incoming sound, which is excellent for simulating reverberation. For the diagrams below, note that both the feedforward and feedback can use the same delay line — the design we're using is equivalent to two separate delays in series.

Schroeder found that the “smearing” from allpass filters multiplies the number of echoes about threefold. However, the number of echoes is roughly constant over the duration of the reverberation. In a real room, echoes continually build up over the course of a reverb tail. To achieve this buildup, Barry Vercoe and Miller Puckette propose replacing the delay in an allpass filter with another allpass filter creating a “nested” structure. [^1] Since an allpass filter will multiply the echoes that pass through it, taking the output of the inner allpass and feeding it back to the input will cause that multiplication to compound, increasing the number of echoes over time.

Below are diagrams of this design. Note that in addition to using a single allpass filter as the delay, we can use series allpasses in this role as well. Gardner uses both designs in the reverb algorithms we'll discuss today. [^2]

<figure>

![](/media/blog/2025/09/reverb_2/single-nested-allpass.webp)

<figcaption>

A block diagram of a nested allpass filter [^3]

</figcaption>
</figure>

<figure>

![](/media/blog/2025/09/reverb_2/double-nested-allpass.webp)

<figcaption>

A block diagram of a double nested allpass filter [^3]

</figcaption>
</figure>

## Allpass Rings

To multiply the echoes even further, Gardner chains a mix of standard and nested allpass filters in series, and then feeds the end of that chain into the chain's input. [^4] Last time, we placed a low-pass filter in the feedback path of individual comb filters. This time, Gardner suggests placing a single low-pass filter in the feedback path for the entire chain. In both contexts, the purpose is to cause higher frequencies to decay faster, similar to the effect of the atmosphere in a real room.

Gardner also suggests taking the output sound from multiple points along the allpass chain. These must be _between_ allpass filters, rather than inside an allpass — taking it from inside an allpass will transform the allpass into a comb, producing an undesirable metallic quality. The output signals can be scaled in different proportions to customize the decay profile of the reverb, and the gain in the global feedback path can be used to scale the decay time overall.

Both the multiple outputs and the ring structure prevent this reverberator from being allpass. The ring structure in particular is a comb filter, which ([as we discussed previously](/posts/2025/06/reverb-part-1/#feedforward-and-feedback-delays)) introduces comb tooth-like peaks and valleys in the frequency spectrum. While Gardner does not go into depth about why the comb filtering is acceptable, my best understanding is that it's because the series allpasses add together to create a long delay time.

As I discussed [here](/posts/2025/06/reverb-part-1/#series-allpasses), and as the audio example below demonstrates, feedback combs with longer delay times create an audible “flutter,” and shorter times create a metallic sound. The long time in the allpass ring means no metallic sounds, and because the chain of nested allpasses multiplies the echo density so much, the flutter isn't meaningfully audible.

<audio controls src="/media/blog/2025/09/reverb_2/clap_comb_demo.mp3" title="feedback comb-filtered clap"></audio>

### Gardner's Reverb Designs

Below are the three designs Gardner gives. The small one is good for decay times between 0.38–0.57 seconds; the medium for 0.58–1.29 seconds; and the large for 1.30 seconds and above. Gardner does not find any particular rule for choosing decay times, noting that the process for designing the three topologies he describes next was “purely empirical.” [^5] As with designing Schroeder reverbs, a good starting point seems to be to avoid delay times that easily divide into each other; this ensures the delays do not rhythmically align.

<figure>

![](/media/blog/2025/09/reverb_2/small-room.webp)

<figcaption>

Small room reverberator [^6]

</figcaption>
</figure>

<figure>

![](/media/blog/2025/09/reverb_2/medium-room.webp)

<figcaption>

Medium room reverberator [^6]

</figcaption>
</figure>

<figure>

![](/media/blog/2025/09/reverb_2/large-room.webp)

<figcaption>

Large room reverberator [^6]

</figcaption>
</figure>

Note that these designs have a mix of delays, allpasses, nested allpasses, and double nested allpasses. The medium reverberator also has two inputs, and applies the gain both in the feedback loop and in the middle of the allpass chain, directly before the second input.

## Reverb Characteristics

Gardner describes these as “room” reverbs. The LedgerNote blog [describes of the features of reverbs labeled as “rooms” as follows](https://ledgernote.com/columns/studio-recording/types-of-reverb/)

- Often imitate bedroom–living room-sized rooms
- Short decay (0.75s)
- Heavy on early reflections
- Dense body
- Low to mid frequencies tend to build up, but can be EQ-ed out if necessary

Early reflections refer to sounds within the first 80 ms or so, followed by late reflections. Summarizing psychoacoustic research on the matter, Rungta et al. note that early reflections positively correlate with “the perception of auditory spaciousness,” are “very important in concert halls,” and can “improve speech clarity in rooms.” [^7]

Likely because these reflections have traveled a short distance to the listener, maybe only reflecting a single time, these help the listener hear the shape of the room. This implies for “room”-type reverbs that we get a particularly strong sense of the room's dimensions. In my next post, I'll describe Dattorro's 1997 “plate”-style reverb, and we'll hear how that reverb sounds more amorphous, with less sense of space.

<figure>

![](/media/blog/2025/09/reverb_2/early-late-reflections.webp)

<figcaption>

Direct sound, early reflections, and late reflections/reverberation [^7]

</figcaption>
</figure>

## Postscript

These algorithms are all available in [my algorithmic reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb/releases) via the dropdown menu at the bottom. I also have Max/MSP abstractions of them [available on my Codeberg](). I would love to hear if you try them out!

As I mentioned, in my next post I'll cover the famous 1997 Dattorro plate algorithm that also uses an allpass ring structure. This is in Max/MSP as the \[yafr2\] abstraction, and in the [Valley Audio “Plateau” module](https://library.vcvrack.com/Valley/Plateau) for VCV Rack, among numerous other places, and is likely based on an algorithm from the Lexicon 224/480 reverb units. I hope to see you then!

[^1]: Unfortunately this paper is unpublished, and I was only able to find William Gardner's description of it, but here is the full citation: Vercoe, B. and M. Puckette. 1985. Synthetic Spaces — Artificial Acoustic Ambiance from Active Boundary Computation. unpublished NSF proposal . Boston, MA. Music and Cognition Office at MIT Media Lab.

[^2]: W. G. Gardner, “A realtime multichannel room simulator,” _J. Acoust. Soc. Am_, vol. 92, no. 4, p. 2395, 1992. Available: https://pubs.aip.org/asa/jasa/article/92/4_Supplement/2395/646024/A-real-time-multichannel-room-simulator

[^3]: H. Mikelson, “A Csound Multi-Effects Processor.” Accessed: Sept. 26, 2025. \[Online\]. Available: https://www.eumus.edu.uy/eme/ensenanza/electivas/csound/materiales/book_chapters/24mikelson/24mikelson.html

[^4]: Gardner 1992, p. 13

[^5]: Gardner 1992, p. 14

[^6]: Gardner 1992, p. 16

[^7]: A. Rungta, N. Rewkowski, R. Klatzky, and D. Manocha, “P-Reverb: Perceptual Characterization of Early and Late Reflections for Auditory Displays,” in 2019 IEEE Conference on Virtual Reality and 3D User Interfaces (VR), Mar. 2019, pp. 455–463. doi: 10.1109/VR.2019.8797914. Available: https://arxiv.org/pdf/1902.06880

<!-- Classic Lexicon Units & -->
<!-- appears in the classic Lexicon 224/480 units, among many other places -->
<!-- ## Dattorro, Griesinger, and the Lexicon LX244/LX480 -->
<!-- Gardner takes this idea a step further.  -->
<!-- looking to combine the allpasses “in a way that will lead to an exponential buildup of echoes as occurs in real rooms.” To do this, Gardner  -->

<!-- My reference for the theory behind this is the article “[A Realtime Multichannel Room Simulator](https://pubs.aip.org/asa/jasa/article/92/4_Supplement/2395/646024/A-real-time-multichannel-room-simulator)” by Bill Gardner. [^1] Gardner makes  -->

<!-- Gardner notes that real rooms give an “exponential buildup” of echoes over time, and to mimic this, he replaces the delay inside an allpass filter with another allpass filter, creating a nested structure. He confirms that this will not spoil the flat frequency response, finding that if the inner delay unit is allpass, the entire configuration is also allpass. With this out of the way, he then notes that

> The echoes generated by the inner allpass filters will be recirculated to their inputs via the outer feedback path. Thus, the number of echoes generated in response to an impulse will increase over time rather than remaining constant as with a standard allpass filter. [^2] -->

<!-- Rather than a single straight chain of single and nested allpasses, Gardner finds that taking the end of that chain and feeding it back into the input of the entire chain produces better-sounding results. He comments that -->

<!-- > The harshness, buzziness, and metallic sound of the allpass system is smoothed out, possibly as a result of the increase in echo density caused by the outermost feedback path. [^3] -->

<!-- <figure>

![A DSP block diagram. Input is fed forward around a delay G(z) with negative gain, and fed back into G(z) with positive gain. G(z) must be allpass.](/media/blog/2025/09/reverb_2/nested-allpass.webp)

<figcaption>Nested allpass block diagram (Gardner, p. 10)</figcaption>
</figure> -->

<!-- https://ccrma.stanford.edu/~jos/pasp/Nested_Allpass_Filters.html -->

<!-- With regards to early vs. late reflections, [this post from Aural Exchange](https://www.auralexchange.com/knowledgebase/understanding-sound-reflections/) -->

<!-- In my next post, I'll describe Dattorro's 1997 “plate”-style reverb -->
<!-- ### Implementing Nested Allpasses

Take all allpass filters from different “taps” in a single delay line

<figure>

![](/media/blog/2025/09/reverb_2/tapped-delay-allpass-reverb.webp)

<figcaption>Reverberator with nested and series allpasses, all tapped from a single delay line (Gardner, p. 12)</figcaption>
</figure> -->

<!-- In contrast, Rungta et al. note that late reflections decrease localization ability and speech clarity, but provide cues for the distance of a sound from the listener.  -->
