#!/bin/sh

if [ ${1+x} ]; then
    name=$1
else
    name="Blog Post"
fi

if [ ${2+x} ]; then
    description=$2
else
    description=""
fi

slug=$(echo $name | tr '[:upper:]' '[:lower:]' | tr " " "-")

isodate=$(date +"%Y-%m-%dT%H:%M:%S%z")
year=$(date +"%Y")
month=$(date +"%m")

if ! [ -d pages/posts/$year ]; then
    mkdir pages/posts/$year
fi

if ! [ -d pages/posts/$year/$month ]; then
    mkdir pages/posts/$year/$month
fi

fullpath=pages/posts/$year/$month/$slug.md

cat >> $fullpath << EOF && codium $fullpath
---
title: $name
description: $description
canonical_url: https://reillyspitzfaden.com/posts/$year/$month/$slug/
fedi_url:
og_image: 
og_image_width: 
og_image_height: 
date: $isodate
octothorpes:
  - 
tags:
  - post
post_series: 
draft: true
---
EOF