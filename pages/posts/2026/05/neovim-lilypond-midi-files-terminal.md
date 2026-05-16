---
title: "Neovim/Lilypond: MIDI Files in the Terminal and More"
description: More useful tricks for composing with Lilypond in Neovim, including playing MIDI files into Max/MSP using the terminal
fedi_url:
  - https://hachyderm.io/@reillypascal/116568110499925318
  - https://bsky.app/profile/reillypascal.bsky.social/post/3mlqolgpe2c2q
og_image: /media/blog/2026/05/nvim-ly-og-120526.jpg
og_image_width: 1200
og_image_height: 630
og_image_alt: A Neovim window on the left with Lilypond code, and a PDF of a trio for oboe, clarinet, and MIDI keyboard on the right
date: 2026-05-13T12:00:00-0400
tags:
  - composition
  - lilypond
  - midi
  - music
  - neovim
  - post
  - programming
post_series: lilypond
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

I [recently wrote about using Lilypond with Neovim](/posts/2026/02/friendly-lilypond-with-neovim-audacity/). My current composition has a mix of wind instruments and a MIDI keyboard controlling a Max/MSP patch. Crucially, the Max patch plays a variety of custom samples, sequencers, and other things that don't necessarily correspond to the pitch of the key being pressed. To accurately hear what I've written, I'm playing MIDI files over the [IAC bus on macOS](https://support.apple.com/guide/audio-midi-setup/transfer-midi-information-between-apps-ams1013/mac), sending the MIDI data into Max/MSP, where I have both the keyboard patch and another patch with virtual instruments for the winds.

The workflow I described worked OK, but there were a few issues with MIDI in Audacity. I had chosen to play the MIDI file from Audacity since I could conveniently script it to reload the MIDI file whenever the file updated, and Audacity works with IAC. Audacity [note tracks](https://manual.audacityteam.org/man/note_tracks.html) seem to internally convert MIDI to the [Allegro format](https://manual.audacityteam.org/man/glossary.html#allegro), and whether because of that or something else, I noticed that faster rhythms played back with some lag. I also wasn't able to place the cursor partway through the track and start there — I had to select a region in order to start later in the track.

Finally, I had never been fully satisfied having to use a GUI program for MIDI playback. I have joint pain, and I've found that working in the terminal using only the keyboard both helps with that and is faster for me at this point. Today I want to discuss what I've found about playing MIDI files from the terminal, as well as some Neovim setup tweaks I've found helpful. Let's get started!

## MIDI Playback with Max/MSP

I found a simple macOS command-line MIDI player, [mac-playmidi](https://ssb22.user.srcf.net/mwrhome/mac-midi.html). It comes as a tiny C file with 107 lines of code, including comments, so it should be easy to maintain myself if it ever gets abandoned. The instructions to compile it are in the code comments, rather than the post linked above. To compile it, run `cc -o playmidi mac-playmidi.c -framework CoreFoundation -framework AudioToolbox -framework CoreMIDI` — note that it needs the Apple CoreFoundation, AudioToolbox, and CoreMIDI frameworks, or it won't compile.

For listening to my composition, I have the following script (titled `play`) in my Lilypond project folder (replace `forget.midi` with the name of your score's MIDI file). Make sure to run `sudo chmod +x play` in order to make the script executable.

```bash
#!/usr/bin/env bash

if [ ${1+x} ]; then
	playmidi forget.midi 1 "$1"
else
	playmidi forget.midi
fi
```

The `playmidi` command uses the syntax `playmidi [deviceNo] file.mid [speed multiplier [start second [stop second]]]`, with everything except the MIDI file being optional. Since the start/stop arguments are read based on position, I use this script so I don't need to type the playback speed if I want to specify the start time.

If `deviceNo` is not specified, `playmidi` connects to the first MIDI device found. Since the IAC bus is the first device on my computer, I left the argument blank, but if specified, -1 will use the macOS internal synth, 0 will use the first MIDI device, 1 will use the second, and so on.

I've found this tool/script extremely convenient to play MIDI into Max/MSP, SuperCollider, and other such tools. Typing e.g., `./play 35` starts partway into the track, and `ctrl-C` exits.

Another useful thing I discovered that makes playing into Max even easier is that calling the Max executable followed by the absolute paths to one or more Max patches will open the patches. I have a `start` script in my project folder that looks like the following:

```bash
#!/usr/bin/env bash

/Applications/Max.app/Contents/MacOS/Max "/path/to/performance/patch.maxpat" "/path/to/sfz/instrument/patch.maxpat" "/path/to/midi/keyboard/patch.maxpat" &
```

This opens all the patches I need for composing — the patch that will be used in the performance, the patch with [SFZ](https://www.plogue.com/products/sforzando.html) sampler [instruments for oboe and clarinet](https://versilian-studios.com/vsco-community/), and a patch with [an electric piano instrument](https://sfzinstruments.github.io/pianos/jrhodes3d/) for me to compose on — and the `&` puts the process in the background so I can continue to use that terminal. Starting Max with this script is convenient so I don't have to manually open multiple patches.

## Building

I'm using [nvim-lilypond-suite](https://github.com/martineausimon/nvim-lilypond-suite/) to work with Lilypond files in Neovim. I have multiple files in my project: the score, one file for each instrument part, and a few smaller files with helper functions and definitions to include. With the [default configuration settings](https://github.com/martineausimon/nvim-lilypond-suite/wiki/2.-Configuration#customize-default-settings), pressing F5 will render the currently-open Lilypond file as a PDF, or if there is a file in the working directory called `main.ly`, it will render that.

I would prefer to be able to be in e.g., an instrument part and have a keymap to render the full score as a PDF without needing to go to the score file, with any arbitrary name for the main file, and with the ability to run more complex build commands, as is sometimes relevant. To do this, I have the following in `ftplugin/lilypond.lua`:

```lua
vim.keymap.set("n", "<leader>b", function()
	vim.system({ "./build" }, {}, function(obj)
		if obj.code == 0 then
			print("Lilypond: build success")
		else
			print("Lilypond: " .. obj.stderr)
		end
	end)
end, { desc = "Lilypond: run `build` script in current working directory" })
```

`vim.system()` takes three arguments: a table of shell commands to run, a table of options (empty here), and a function to run on job completion. The argument (`obj`) given to that function is a table of the exit code, stdout, stderr, and so on, and based on job success/failure, I print either “Lilypond: build success” or the stderr message.

The `build` script referenced just looks like this for now, but the nice thing about the keymap is I can have it look however I want without changing Neovim's setup; I can title files freely, use the `-dno-point-and-click` option to remove [point-and-click links](https://lilypond.org/doc/v2.26/Documentation/usage/point-and-click) from the PDF, change the output file name, run [`lilypond-book`](https://lilypond.org/doc/v2.26/Documentation/usage/lilypond_002dbook), or whatever I need.

```bash
#!/usr/bin/env bash

lilypond forget.ly
```

I also have the following options in `ftplugin/lilypond.lua`, which I find to be useful:

```lua
-- use spaces, not tabs
vim.cmd("set expandtab")
-- wrap at space between words — relevant for
-- frontmatter text, among other things
vim.opt.linebreak = true
-- enable commenting out lines with
-- https://github.com/numtostr/comment.nvim
vim.bo.commentstring = "% %s"
```

## More Features

I'm going to do a writeup soon of some further Lilypond editing tools. Neovim has a [remote plugin](https://neovim.io/doc/user/remote_plugin/) API that works with other languages than Lua, and I've used it to make some [Python commands](https://codeberg.org/reillypascal/nvim/src/branch/main/rplugin/python3) for transposing notes and manipulating rhythms using the [python-ly](https://python-ly.readthedocs.io/en/latest/) package. This package is based on the internals of the [Frescobaldi Lilypond editor](https://frescobaldi.org/), and provides a long list of useful tools. I'll write about how I did that soon, and I hope to see you then! &#x220e;
