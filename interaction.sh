#!/bin/sh

if [ ${1+x} ]; then
    name=$1
else
    name="Interaction"
fi

slug=$(echo $name | tr '[:upper:]' '[:lower:]' | tr " " "-")

isodate=$(date +"%Y-%m-%dT%H:%M:%S%z")
year=$(date +"%Y")
month=$(date +"%m")

if ! [ -d pages/interactions/$year ]; then
    mkdir pages/interactions/$year
fi

if ! [ -d pages/interactions/$year/$month ]; then
    mkdir pages/interactions/$year/$month
fi

cat >> pages/interactions/$year/$month/$slug.md << EOF
---
title: $name
canonical_url: https://reillyspitzfaden.com/interactions/$year/$month/$slug/
fedi_url:
date: $isodate
tags:
  - interaction
rsvp_value:
target_url:
target_title:
draft: true
---
EOF