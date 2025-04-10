#!/bin/sh

if [ ${1+x} ]; then
    name=$1
else
    name="Note"
fi

# tr replace first w/ second; -c means "complement", -d "delete", -s "squeeze repeats"
slug=$(echo $name | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:] ' | tr -s " " "-")

isodate=$(date +"%Y-%m-%dT%H:%M:%S%z")
year=$(date +"%Y")
month=$(date +"%m")

if ! [ -d pages/notes/$year ]; then
    mkdir pages/notes/$year
fi

if ! [ -d pages/notes/$year/$month ]; then
    mkdir pages/notes/$year/$month
fi

fullpath=pages/notes/$year/$month/$slug.md

cat >> $fullpath << EOF && codium $fullpath
---
title: $name
canonical_url: https://reillyspitzfaden.com/notes/$year/$month/$slug/
fedi_url:
og_image: 
og_image_width: 
og_image_height: 
date: $isodate
tags:
  - note
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">
EOF