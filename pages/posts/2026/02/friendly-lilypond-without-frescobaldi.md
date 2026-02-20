---
title: "Friendly Lilypond without Frescobaldi"
description:
fedi_url:
og_image:
og_image_width:
og_image_height:
date: 2026-02-18T16:01:40-0500
tags:
  - composition
  - lilypond
  - post
  - programming
post_series:
draft: true
---

<!-- <link rel="stylesheet" type="text/css" href="/styles/notes-photos.css"> -->

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

example script, [pipe_test.py](https://github.com/audacity/audacity/blob/master/au3/scripts/piped-work/pipe_test.py)

```py
import argparse
# ...

parser = argparse.ArgumentParser()
parser.add_argument("input", help=".mid file to open")

args = parser.parse_args()
# ...

# https://manual.audacityteam.org/man/scripting_reference.html
def reload_file():
    do_command('SelAllTracks:')
    do_command('RemoveTracks:')
    do_command(f'Import2: Filename={args.input}')

reload_file()
```

[entr](https://eradman.com/entrproject/), which will run commands whenever a given file changes.

run `./watch <scorename>.ly` to watch both MIDI and PDF

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
		# 	# POSIX compatibility layer and Linux environment emulation for Windows
		echo "$pdfpath" | entr start "" /max "$pdfpath"
	elif [[ "$OSTYPE" == "msys" ]]; then
		# 	# Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
		echo "$pdfpath" | entr start "" /max "$pdfpath"
	else
		echo "Unknown OS: PDF not opened"
	fi
}
```
