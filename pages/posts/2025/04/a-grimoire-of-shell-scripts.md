---
title: A Grimoire of Shell Scripts
description: Today I'm discussing my thoughts on “home-cooked” and “situated” software, and how that's inspired me to start a collection of useful script tools for myself.
canonical_url: https://reillyspitzfaden.com/posts/2025/04/a-grimoire-of-shell-scripts/
fedi_url: 
  - https://hachyderm.io/@reillypascal/114316315194731170
  - https://bsky.app/profile/reillypascal.bsky.social/post/3lmiomk7bns2h
date: 2025-04-10T18:35:00-0400
octothorpes:
  - web
  - web-development
tags:
  - post
  - programming
  - webdev
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

I added a “[grimoire](https://reillyspitzfaden.com/code/#grimoire)” [^1] section to my site to hold shell scripts and other short pieces of code I find useful. I was inspired by the blog [Some Natalie's corner of the internet](https://some-natalie.dev/), [^2] as well as a few others whose names escape me at the moment. A few things spurred me to do this (beyond the coolness of the name “grimoire”).

First, when I wrote about my trip with my partner to [Watkins Glen and Seneca Lake State Parks](/notes/2025/03/watkins-seneca-daytrip/), I had a large number of photos, all of which were 4032x3024 pixels, all of which I wanted to convert to the more efficient .webp format, and many of which had EXIF rotation data. I would usually use the [GNU Image Manipulation Program](https://www.gimp.org/) to do this, but I was not looking forward to repeating the process for each image, and in keeping with my [desire to make posting on this site closer in ease to social media](/posts/2024/11/ssgs-are-nice/), I wanted to automate the process.

A second reason connects to some writing I've seen recently about “[situated](https://web.archive.org/web/20050120085129/http://www.shirky.com/writings/situated_software.html)” or “[home-cooked](https://www.robinsloan.com/notes/home-cooked-app/)” [software](https://maggieappleton.com/home-cooked-software). Robin Sloan [writes](https://www.robinsloan.com/notes/home-cooked-app/) about this idea that

> People don’t only learn to cook so they can become chefs. Some do! But many more people learn to cook so they can eat better, or more affordably. Because they want to carry on a tradition. Sometimes they learn because they’re bored! Or even because they enjoy spending time with the person who’s teaching them.

> The list of reasons to “learn to cook” overflows, and only a handful have anything to do with the marketplace.

I think the idea of not worrying about “scalability” or something needing to be used by a wider audience sounds very nice, both in terms of my values for society, and in terms of my personal enjoyment when coding. Especially because I'm self-taught and haven't been coding very long, it's nice to have low-stress projects that (bonus) also fit my political values.

Working on an [MP3 glitching tool in Python](/posts/2025/04/databending-part-3/) recently gave me a nice idea about this. Most of my software engineering projects have been [VST/AU plugins](/code/#plugins), which are fun and useful, but since they're in C++ with a GUI, they're a lot more work than a script that runs in the terminal. While GUI programs are more accessible in terms of non-programmer *users*, I also like the idea of making the *creation* of useful things more accessible and situated. All of this inspired me to start getting better at shell scripting to create some simple-to-make tools for myself.

### My Scripts

For automating my photo resizing/transcoding, [imagemagick](https://imagemagick.org/index.php) plus a bit of shell script to loop over the files turned out to get me most of the way there, but unfortunately some were still rotated when I displayed them on my site. So far, I'm using [jhead](https://www.sentex.ca/~mwandel/jhead/), which has the `-autorot` command to losslessly apply the EXIF rotation data. This only works on JPEGs, and my partner (who takes some of our pictures) uses an iPhone, which usually does .HEIC, so if someone has a better, more file-agnostic solution I'm interested to hear it!

```sh
for file in ./**/*(.); jhead -autorot $file && magick $file -quality 65 -resize 35% ${file%.*}.webp
```

While this is quite short, learning a few things about shell scripting beyond the basics I'd done before gave me some confidence to try more things. Yesterday I realized that setting up a Markdown file for a new post was another annoyingly repetitive task that seemed amenable to scripting. The finished script is [here](https://github.com/reillypascal/personalsite-ssg/blob/main/post), and I'll walk through how it works. First, to create a new post and open it in VSCodium, I simply type this (from the root folder for my site files):

```sh
./post "<post-title>" "<post-description>"
```

First, I check if the title and description arguments exist and if so, assign them to the `name` and `description` variables. Since there is a default post title and description, the arguments are optional — I could just type `./post` and get a file. The square brackets are a shorthand for the `test` command. `$1` and `$2` are the two optional arguments, and writing `${1+x}` is a [parameter expansion](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_06_02) that evaluates to null if the argument is unset. 

```sh
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
```

To convert the title to a post slug/filename, I use the following line. `tr` replaces the first option with the second. The `-c` flag takes the complement of an argument and the `-d` flag means “delete,” so `tr -cd '[:alnum] '` takes the complement of the set of alphanumeric characters plus the space and deletes that complement. I also use `tr` to replace all uppercase characters with lowercase, and replace spaces with dashes. The `-s` option means to “squeeze repeats,” so when I type a title such as ”Liked | Some Post,” the two spaces I'm left with after removing the vertical pipe are collapsed to only one dash.

```sh
slug=$(echo $name | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:] ' | tr -s " " "-")
```

I put my posts in the folder `posts/<year>/<month>/`, and for that I need the year and date. Getting the date is pretty simple — just use the `date` command. Creating the variables just requires the formatting strings described [here](https://ss64.com/bash/date.html) to get ISO format (for the post frontmatter date tag), and the year and month (for the folders). I use the same syntax as above with the brackets substituting for the `test` command to check if the required file path exists, and create the necessary folders if not. The `-d` flag for `test` [checks if the file exists and is a directory](https://www.man7.org/linux/man-pages/man1/test.1.html).

```sh
isodate=$(date +"%Y-%m-%dT%H:%M:%S%z")
year=$(date +"%Y")
month=$(date +"%m")

if ! [ -d pages/posts/$year ]; then
    mkdir pages/posts/$year
fi

if ! [ -d pages/posts/$year/$month ]; then
    mkdir pages/posts/$year/$month
fi
```

After that, here's how I write to a file.

```sh
fullpath=pages/posts/$year/$month/$slug.md

cat >> $fullpath << EOF && codium $fullpath
# post draft contents here
EOF
```

`$fullpath` contains the desired Markdown file name plus the path at which to put it. Since it doesn't look like you can write any further commands after the `EOF` file end marker, it took me a bit to figure out how to open the file after creating it, but it turns out I can just add `&& codium $fullpath` on the `cat` line, instead of needing to put it after the block of text to write.

### Fun Fact of the Day

It [turns out](https://www.etymonline.com/word/grimoire) that the word “grimoire” is a cognate with “grammar.” Etymonline's [entry](https://www.etymonline.com/word/grammar) on the word “grammar” comments that

> For the “magic” sense, compare [gramary](https://www.etymonline.com/word/gramary). The evolution is characteristic of the Dark Ages: [^3] “learning in general, knowledge peculiar to the learned classes,” which included astrology and magic; hence the secondary meaning of “occult knowledge” (late 15c. in English)…

[^1]: A [grimoire](https://en.wikipedia.org/wiki/Grimoire) is a book of spells or incantations.

[^2]: I had originally come across Natalie's site when I was setting up a Raspberry Pi as a [Kodi](https://kodi.tv/) TV streamer — [her post](https://some-natalie.dev/blog/kodi-setup/) explains how to do this with the stock Raspberry Pi OS, rather than assuming a custom version based around Kodi as most tutorials seem to do.

[^3]: It's my understanding that medieval scholars don't really like the phrase “Dark Ages” — my inclusion of the phrase here doesn't reflect my own views, just those of the source.