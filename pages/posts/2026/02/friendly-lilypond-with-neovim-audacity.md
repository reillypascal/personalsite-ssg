---
title: "Friendly Lilypond with Neovim & Audacity"
description: I made a nice setup to write Lilypond scores in Neovim, while still being able to conveniently view and listen to them
fedi_url:
og_image: /media/blog/2026/02/abide-with-me-ly-pdf.jpg
og_image_width: 1200
og_image_height: 630
og_image_alt: A Neovim window open on the left, showing Lilypond code, and a PDF score for the hymn “Abide with Me” open on the right
date: 2026-02-27T09:38:52-0500
tags:
  - bash
  - composition
  - lilypond
  - music
  - post
  - programming
  - python
post_series:
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

[Lilypond](https://lilypond.org/) is a program and language for writing musical scores using only text. The syntax is similar to [LaTeX](https://en.wikipedia.org/wiki/LaTeX), and this can be easily converted to nice-looking PDF scores, as well as MIDI files for previewing/making mockups. In addition, there are e.g., Python libraries such as [Abjad](https://abjad.github.io/) that allow for algorithmic manipulation of musical notation. [^1] I've found that I enjoy writing text files more than I enjoy using graphical programs such as Dorico/Sibelius/the late Finale, so I've recently been trying out Lilypond.

Part of what I've been enjoying about text files is that I've gotten [my Neovim setup](https://github.com/reillypascal/nvim) to a place that's very pleasant and smooth to work with. Additionally, I've developed joint issues, and even with a nice vertical mouse, typing exacerbates the joint issues much less.

For writing Lilypond, the IDE-like program [Frescobaldi](https://www.frescobaldi.org/) is popular. It bundles a text editor with tools for handling boilerplate code, transposing and other musical tasks, and a MIDI player and score viewer that make it easy to see and hear the results of the code. Since I prefer using my own Neovim setup, I decided to try getting as much of the convenience of Frescobaldi as possible with the tools I prefer. I think it turned out pretty well! Let's have a look at how it works.

## Neovim Setup

First (and easiest), there is a nice Neovim plugin [nvim-lilypond-suite](https://github.com/martineausimon/nvim-lilypond-suite). This adds syntax highlighting and PDF/playback keyboard shortcuts. I also use the [conform.nvim](https://github.com/stevearc/conform.nvim) plugin to perform automatic formatting (e.g., line breaks, spacing, etc.). This plugin communicates with existing formatting tools, and here I used the [python-ly](https://python-ly.readthedocs.io/en/latest/) command-line program. It has indentation/formatting options, and I made conform.nvim aware of these commands using [this configuration here](https://github.com/reillypascal/nvim/blob/0efaa3262aa483d052bbab00c2219893e2a2d8a1/lua/plugins/conform.lua#L72-L81).

This covers most of what Frescobaldi does, but for audio playback, there is one wrinkle that's specific to my needs that makes the provided playback not work. The nvim-lilypond-suite plugin uses [timidity](https://timidity.sourceforge.net/) or [fluidsynth](https://www.fluidsynth.org/) to convert MIDI files (which are just instructions to a synthesizer on the notes to play) to audio files. These two programs use a [SoundFont](https://en.wikipedia.org/wiki/SoundFont) — a predetermined collection of synthesizers — to convert the MIDI file to audio. In my compositions, I often like to have a [Max/MSP](https://en.wikipedia.org/wiki/Max_(software)) patch being controlled by e.g., a live MIDI keyboardist, and played alongside live instruments. This is unfortunately not compatible with timidity/fluidsynth.

## MIDI Playback

macOS provides the [IAC](https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus) virtual MIDI connection, which allows me to send MIDI data between programs, including sending it to Max. [^2] This means I just needed to find a program that can play the MIDI file that Lilypond generates into the IAC bus in order to hear my Max patches played as the keyboardist would play them.

I looked for a surprisingly long time before realizing that Audacity [can load MIDI files](https://manual.audacityteam.org/man/note_tracks.html) and can play them back over IAC. It would work OK to drag and drop the files in, but I would miss the convenience of Frescobaldi automatically updating the MIDI file, and having to manually load the file and delete the previous ones would partly defeat the purpose of using Neovim to get away from the mouse.

Fortunately, it turns out [Audacity can be scripted](https://manual.audacityteam.org/man/scripting.html)! First, go to Audacity > Preferences > Modules (Mac) or Edit > Preferences > Modules (Win), and make sure that “mod-script-pipe” is set to “Enabled.” The Audacity manual gives an [example Python script](https://github.com/audacity/audacity/blob/master/au3/scripts/piped-work/pipe_test.py) to confirm that the connection is now working. At the end of this file, note the line `do_command('Help: Command=Help')`. This sends the message `Help: Command=Help` to Audacity, and is a good template of how to send commands more generally.

What I wanted to accomplish was have my script select any previously-opened tracks, delete them, and then open the latest version of my MIDI file. From looking at the [scripting reference page](https://manual.audacityteam.org/man/scripting_reference.html), I concluded I would need the `SelAllTracks:`, `RemoveTracks:`, and `Import2:` commands. You can see my use of them below:

<span class="code-file">

[pipe.py](https://codeberg.org/reillypascal/forget/src/branch/main/pipe.py)

</span>

```py
#!/usr/bin/env python3

import argparse
# ...

parser = argparse.ArgumentParser()
parser.add_argument("input", help=".mid file to open")

args = parser.parse_args()
# ...

def reload_file():
    do_command('SelAllTracks:')
    do_command('RemoveTracks:')
    do_command(f'Import2: Filename={args.input}')

reload_file()
```

I've excerpted the sections that I needed to change from the example. I used the [argparse](https://docs.python.org/3/library/argparse.html) library to handle command-line arguments — in this case, the MIDI file name — which is stored in `args.input`. After that, I run the required Audacity scripting commands, and use a format string to send the name of the MIDI file to Audacity. Because of the “shebang” in the first line of the Python file, the script can be run like this: `./pipe.py <my-score>.midi`

## Automatically Reloading MIDI/PDFs

This is already nice, but I had also seen the utility [`entr`](https://eradman.com/entrproject/), which will run commands whenever a given file changes. The Bash script below runs two copies of `entr` to watch the PDF and MIDI files for changes, and then open each file when it changes.

<span class="code-file">

[watch](https://codeberg.org/reillypascal/forget/src/branch/main/watch)

</span>

```bash
#!/usr/bin/env bash
# run lilypond on score file to ensure MIDI/PDF are made
lilypond "$(realpath "$1")" && {
	# need to run `realpath` *after* MIDI/PDF generated
	midipath="$(realpath "${1%.ly}.midi")"
	pdfpath="$(realpath "${1%.ly}.pdf")"

	# run two separate `entr` processes, one each to watch & open MIDI/PDF
	echo "$midipath" | entr ./pipe.py "$midipath" &
	# different OSes need different actions to open PDF
	if [[ "$OSTYPE" == "linux-gnu"* ]]; then
		echo "$pdfpath" | entr evince "$pdfpath"
	elif [[ "$OSTYPE" == "darwin"* ]]; then
		echo "$pdfpath" | entr open "$pdfpath"
	elif [[ "$OSTYPE" == "cygwin" ]]; then
		# POSIX compatibility layer and Linux environment emulation for Windows
		echo "$pdfpath" | entr start "" /max "$pdfpath"
	elif [[ "$OSTYPE" == "msys" ]]; then
		# Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
		echo "$pdfpath" | entr start "" /max "$pdfpath"
	else
		echo "Unknown OS: PDF not opened"
	fi
}
```

You can run the script with `./watch <scorename>.ly`. First, the script runs `lilypond <scorename>.ly` to ensure that the required MIDI/PDF exist, even if I haven't remembered to generate them yet. I use `realpath` to get the full path of the files and avoid any potential issues loading them (Audacity was the main source of trouble with this).

The next block runs two copies of `entr`. In both cases we use the command format `echo <file-to-watch> | entr <run-on-file-change>`. For the PDF, we check the `$OSTYPE` variable, since different operating systems have different PDF viewers. On Linux, Evince is common; macOS provides the `open` command to open any file in the default program; and the Windows options are based on poking around the internet (note that I don't have a Windows machine to test them, so please check before using!)

## Listening in Max

Now that I can send MIDI messages between programs over a virtual MIDI device, it's pretty straightforward to use them in Max. Max has the `[notein]`, `[ctlin]` and `[bendin]` objects for note, CC, and pitch bend data respectively. MIDI files generated by Lilypond send MIDI data over different channels for each instrument, and these objects can take arguments to listen to only one specific channel. The [MIDI Monitor](https://www.snoize.com/MIDIMonitor/) app is useful to see which channels are which, but Lilypond seems to assign increasing channel numbers from top to bottom in the score.

In addition to running the Max patch for the keyboardist, Max is useful for hosting VST plugins to handle mockups for the other instruments. I found the `[midiselect]` object useful for handling MIDI input, then send that into `[midiformat]`. You can connect the right outlet of `[midiformat]` to the `[vst~]` object — this will give `[vst~]` the “midievent” message format it needs. Also note that `[vst~]` should have the `@autosave 1` attribute set — this will ensure your VST settings are saved.

If you don't use Max, note that most DAWs and other programs that can host virtual instruments (e.g., I've tried this with Logic Pro, REAPER, and Mainstage) can also take input over a virtual MIDI bus. You could also connect to SuperCollider, Pure Data, VCV Rack, and many others.

## Postscript

I've been having a ton of fun with Lilypond, including [microtones](https://en.wikipedia.org/wiki/Microtonality), algorithmic composition with Python/Abjad, and more. There's a lot of interesting stuff to discuss there, and I'm planning to write a few more posts about these topics sometime soon. I hope to see you then — until next time!

[^1]: I use “algorithmic” here in the sense of Iannis Xenakis' [_Formalized Music_](https://en.wikipedia.org/wiki/Formalized_Music) — i.e., handwritten algorithms without large, unethical datasets — not in the LLM sense.

[^2]: While I haven't tried this on Linux yet, [QJackCtl](https://qjackctl.sourceforge.io/qjackctl-screenshots.html) and [JACK](https://wiki.archlinux.org/title/JACK_Audio_Connection_Kit) should allow routing MIDI between programs. [This page section](https://wiki.archlinux.org/title/PulseAudio/Examples#PulseAudio_through_JACK) also discusses getting JACK to play nice with PulseAudio. [LoopBe1](https://www.nerds.de/en/loopbe1.html) looks like a possibility for Windows, but I haven't tried it.
