---
title: Code
description: My code, including sound design tools, VST/AU plugin programming, and web development
layout: toclayout.liquid
---

<link rel="stylesheet" type="text/css" href="/styles/onecolumn.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<h2 id="plugins" class="sectionHeader">Plugins</h2>

<article>

### [RS Algorithmic Verb](https://github.com/reillypascal/RSAlgorithmicVerb)

Retro algorithmic reverb plugin in [JUCE](https://juce.com/) with multiple algorithms (including emulations of classic hardware) and more to come.

Includes plate and hall reverbs from Dattorro; Gardner's 1992 room reverbs; 4 feedback delay network reverbs using the "[FDN Toolbox](https://www.researchgate.net/publication/344467473_FDNTB_The_Feedback_Delay_Network_Toolbox)"; and two experimental/special-effect reverbs. Recently updated for code clarity and maintainability.

</article>

<article>

### [RS Broken Media](https://github.com/reillypascal/RSBrokenMedia)

Stereo glitch plugin that records a buffer of recent audio and mangles it, giving tape-warping effects, CD skips, bitcrushing, cell phone codecs, and more.

</article>

<article>

### [RS Telecom](https://github.com/reillypascal/RSTelecom)

Lo-fi plugin with options of various telecommunications codecs including Mu-Law and A-Law 8-bit, and GSM 06.10. Work in progress — more codecs and glitching effects coming soon.

</article>

<h2 id="maxmsp" class="sectionHeader">Max/MSP Tools and Externals</h2>

<article>

### [rs.max](https://github.com/reillypascal/rs.max/)

\[rs.file2sig~\]: import any file as raw binary data and play this data back as a control signal for synthesizing [PSK](https://en.wikipedia.org/wiki/Phase-shift_keying) (phase-shift keying)/ASK/FSK/etc. telecommunications signals. See [Nathan Ho's post](https://nathan.ho.name/posts/dm-synthesis/) on using digital modulation modes for synthesis to hear the kinds of sounds this produces.

### [rs.reverb](https://codeberg.org/reillypascal/rs.reverb)

A collection of Max/MSP algorithmic reverb abstractions, based on classic DSP papers and software.

</article>

<h2 id="cli-tools" class="sectionHeader">Command-Line Tools</h2>

<article>

### [data2audio](https://github.com/reillypascal/data2audio)

Rust tool to import a folder of files, convert to audio, and normalize/filter out sub-audible frequencies. Processes files in parallel (using `rayon`), so it's extremely fast even with large batches of files.</p>

This is the same process described in [this post](/posts/2025/01/databending-part-1/), but automated to be much less time-consuming.

</article>

<article>

### [mp3glitch](https://github.com/reillypascal/mp3glitch)

Python tool for glitching MP3s while leaving them playable. Includes many options to shape glitching amount, character, and timbre, and a shell script to automate converting batches of WAV files to MP3 with FFmpeg before glitching.

The mechanics behind this are described in [this post](/posts/2025/02/databending-part-2/), and I discuss using Python to do the glitching in [this post](/posts/2025/04/databending-part-3/).

</article>

<h2 id="grimoire" class="sectionHeader">Grimoire</h2>

A [grimoire](https://en.wikipedia.org/wiki/Grimoire) is a book of spells or incantations. This one is my place to keep shell scripts and other short snippets of code I find useful.

<article>

### Neovim

I do most of my coding/text editing in the Neovim text editor. Here are my [dotfiles/configuration files](https://github.com/reillypascal/nvim) for it.

</article>

<article>

### Watch Lilypond Output and Open

[This Python script](https://codeberg.org/reillypascal/forget/src/commit/22ff2db95082abb8f683e39e2d1e09d7fd322525/pipe.py) and [this Bash script](https://codeberg.org/reillypascal/forget/src/commit/22ff2db95082abb8f683e39e2d1e09d7fd322525/watch) allow me to watch the MIDI and PDF files generated from Lilypond and open them in Audacity and the default viewer, respectively every time they change.

</article>

<article>

### Make New Post

This [script](https://github.com/reillypascal/personalsite-ssg/blob/main/post) generates a new post file with the correct file name, directory, title, description, and date. Run `./post "<post-title>" "<post-description>"` from the root folder to use, and optionally use `-d` flag to set a date (YYYY-MM-DD) in the future. A similar [script](https://github.com/reillypascal/personalsite-ssg/blob/main/interaction) will create an [interaction](/interactions) post (e.g., likes, RSVPs, etc.), with flags for different types of interaction.

```sh
#!/usr/bin/env bash

isodate=$(date +"%Y-%m-%dT%H:%M:%S%z")
year=$(date +"%Y")
month=$(date +"%m")

while getopts ":d" option; do
	case "${option}" in
	d)
		isodate="${2}T12:30:00$(date +%z)"
		year=$(echo "${isodate}" | cut -c1-4)
		month=$(echo "${isodate}" | cut -c6-7)
		;;
	*)
		echo "Error: invalid flag ${option}"
		;;
	esac
	shift $((OPTIND))
done

if [ ${1+x} ]; then
	name=$1
else
	name="Post"
fi

if [ ${2+x} ]; then
	description=$2
else
	description=""
fi

# tr replace first w/ second; -c means "complement", -d "delete", -s "squeeze repeats"
slug=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:] ' | tr -s " " "-")

# -p: make intermediate directories and don't complain if the full path already exists
mkdir -p "pages/posts/$year/$month"

fullpath=pages/posts/$year/$month/$slug.md

cat >>"$fullpath" <<EOF
---
title: "$name"
description: $description
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
og_image_alt: 
date: $isodate
tags:
  - post
post_series: 
draft: true
indienews: true
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />
EOF
```

</article>

<article>

### Send Webmentions

Send webmentions from your page to a URL it mentions.

```sh
#!/usr/bin/env bash

source_url="$1"
target_url="$2"
endpoint_url=$(curl -i -s "$target_url" | grep 'rel="webmention"' | grep -o -E 'https?://[^ ">]+' | sort | uniq)
curl -i -d "source=$source_url&target=$target_url" "$endpoint_url"
```

</article>

<article>

### Filter Webmentions

This [Python script](https://github.com/reillypascal/personalsite-ssg/blob/main/webmentions.py) gets my webmentions, filters out all mentions received over Bridgy (which I use to pull in Mastodon/Bluesky interactions as webmentions), and writes the rest to a file `webmentions.json`. This is nice because non-Mastodon/Bluesky webmentions are much more interesting to me, but they're much more rare than social media interactions, and tend to get lost in the shuffle. I run `./webmentions.py` from my root folder to get the mentions, after which they can be viewed by opening `webmentions.json` in an editor.

</article>

<article>

### Tea/Coffee Timer

I love tea (my favorite is Bigelow's Vanilla Chai) and I prefer it steeped for a precise length of time. However, I find alarms extremely irritating, with the worst part being that many of them keep going until you turn them off. This script lets me type e.g., `./timer.sh 4m` to get a timer that chimes once and then stops. Note that this depends on [timer](https://github.com/caarlos0/timer).

<div class="code-file">timer.sh</div>

```sh
#!/usr/bin/env bash

if [ ${1+x} ]; then
    time="$1"
else
    time="4m"
fi

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # /usr/share/sounds/gnome/default/alerts/string.ogg may be available on GNOME
    # may also look on freesound.org
    # `play` command requires SoX
    timer "$time" && play "/path/to/sound/file"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    timer "$time" && afplay "/System/Library/Sounds/Glass.aiff"
else
    echo "Unknown OS: no ending sound will be played"
    timer "$time"
fi
```

</article>

{%- comment %}<article>

### Format Images for Website

This line is what I use to apply EXIF rotation data to photos from my phone, resize them, and convert to .webp for use on my website. It uses [jhead](https://www.sentex.ca/~mwandel/jhead/), [imagemagick](https://imagemagick.org/index.php), and `zsh`.

```sh
jhead -autorot *.jpg && for file in ./**/*(.); magick $file -quality 65 -resize 35% ${file%.*}.webp
```

</article> {%- endcomment %}
