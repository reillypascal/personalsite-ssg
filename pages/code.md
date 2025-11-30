---
title: Reilly Spitzfaden, Composer | Code
description: My code, including sound design tools, VST/AU plugin programming, and web development
---

<link rel="stylesheet" type="text/css" href="/styles/onecolumn.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<h1 id="maxmsp" class="sectionHeader">Max/MSP Tools and Externals</h1>

<article>

## [rs.max](https://github.com/reillypascal/rs.max/)

\[rs.psk~\]: import any file as raw binary data and play this data back as a control signal for synthesizing [PSK](https://en.wikipedia.org/wiki/Phase-shift_keying) (phase-shift keying) telecommunications signals. See [Nathan Ho's post](https://nathan.ho.name/posts/dm-synthesis/) on using digital modulation modes for synthesis to hear the kinds of sounds this produces.

## [rs.reverb](https://codeberg.org/reillypascal/rs.reverb)

A collection of Max/MSP algorithmic reverb abstractions, based on classic DSP papers and software.

</article>

<h1 id="plugins" class="sectionHeader">Plugins</h1>

<article>

## [RS Algorithmic Verb](https://github.com/reillypascal/RSAlgorithmicVerb)

Retro algorithmic reverb plugin in [JUCE](https://juce.com/) with multiple algorithms (including emulations of classic hardware) and more to come.

Includes plate and hall reverbs from Dattorro; Gardner's 1992 room reverbs; 4 feedback delay network reverbs using the "[FDN Toolbox](https://www.researchgate.net/publication/344467473_FDNTB_The_Feedback_Delay_Network_Toolbox)"; and two experimental/special-effect reverbs. Recently updated for code clarity and maintainability.

</article>

<article>

## [RS Broken Media](https://github.com/reillypascal/RSBrokenMedia)

Stereo glitch plugin that records a buffer of recent audio and mangles it, giving tape-warping effects, CD skips, bitcrushing, cell phone codecs, and more.

</article>

<article>

## [RS Telecom](https://github.com/reillypascal/RSTelecom)

Lo-fi plugin with options of various telecommunications codecs including Mu-Law and A-Law 8-bit, and GSM 06.10. Work in progress&mdash;more codecs and glitching effects coming soon.

</article>

<h1 id="cli-tools" class="sectionHeader">Command-Line Tools</h1>

<article>

## [data2audio](https://github.com/reillypascal/data2audio)

Rust tool to import a folder of files, convert to audio, and normalize/filter out sub-audible frequencies. Processes files in parallel (using `rayon`), so it's extremely fast even with large batches of files.</p>

This is the same process described in [this post](/posts/2025/01/databending-part-1/), but automated to be much less time-consuming.

</article>

<article>

## [mp3glitch](https://github.com/reillypascal/mp3glitch)

Python tool for glitching MP3s while leaving them playable. Includes many options to shape glitching amount, character, and timbre, and a shell script to automate converting batches of WAV files to MP3 with FFmpeg before glitching.

The mechanics behind this are described in [this post](/posts/2025/02/databending-part-2/), and I discuss using Python to do the glitching in [this post](/posts/2025/04/databending-part-3/).

</article>

<h1 id="grimoire" class="sectionHeader">Grimoire</h1>

A [grimoire](https://en.wikipedia.org/wiki/Grimoire) is a book of spells or incantations. This one is my place to keep shell scripts and other short snippets of code I find useful.

<article>

## Neovim

I do most of my coding/text editing in the Neovim text editor. Here are my [dotfiles/configuration files](https://github.com/reillypascal/nvim) for it.

</article>

<article>

## Tea/Coffee Timer

I love tea (my favorite is Bigelow's Vanilla Chai) and I prefer it steeped for a precise length of time. However, I find alarms extremely irritating, with the worst part being that many of them keep going until you turn them off. This script lets me type e.g., `./timer.sh 4m` to get a timer that chimes once and then stops.

This is inspired by [bashbunni's CLI pomodoro timer](https://gist.github.com/bashbunni/f6b04fc4703903a71ce9f70c58345106). Note that it requires [`timer`](https://github.com/caarlos0/timer), and is specific to macOS. You could try adapting [this Linux version](https://gist.github.com/bashbunni/3880e4194e3f800c4c494de286ebc1d7), although I was having some trouble getting it working.

<div class="code-file">timer.sh</div>

```sh
#!/usr/bin/env zsh

if [ ${1+x} ]; then
time=$1
else
time="4m"
fi

timer $time && afplay /System/Library/Sounds/Glass.aiff
```

</article>
<article>

## Format Images for Website

This line is what I use to apply EXIF rotation data to photos from my phone, resize them, and convert to .webp for use on my website. It uses [jhead](https://www.sentex.ca/~mwandel/jhead/), [imagemagick](https://imagemagick.org/index.php), and `zsh`.

```sh
jhead -autorot *.jpg && for file in ./**/*(.); magick $file -quality 65 -resize 35% ${file%.*}.webp
```

</article>

<article>

## Make New Post

This [script](https://github.com/reillypascal/personalsite-ssg/blob/main/post) generates a new post file with the correct file name, directory, title, description, and date; and then opens it in VSCodium. Equivalent versions are included in my site files for notes and interactions. Run the following line from the root folder:

```sh
./post "<post-title>" "<post-description>"
```

My [script](https://github.com/reillypascal/personalsite-ssg/blob/main/interaction) for creating an [interaction](/interactions) post (e.g., likes, RSVPs, etc. using [Microformats](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Microformats)) is able to take in a flag to indicate the type of interaction and the URL of the post with which I'm interacting and 1); retrieve the target post's title and 2); create the correct title/tags/etc. (e.g., "Liked | Example Post" for the title).

```sh
./interaction -r "<target-url>"
```

</article>

<article>

## Filter Webmentions

This [Python script](https://github.com/reillypascal/personalsite-ssg/blob/main/webmentions.py) gets my webmentions, filters out all mentions received over Bridgy (which I use to pull in Mastodon/Bluesky interactions as webmentions), and writes the rest to a file `webmentions.json`. This is nice because non-Mastodon/Bluesky webmentions are much more interesting to me, but they're much more rare than social media interactions, and tend to get lost in the shuffle. I run this from my root folder to get the mentions and open the file in my editor.

```sh
./webmentions.py && codium webmentions.json
```

</article>
