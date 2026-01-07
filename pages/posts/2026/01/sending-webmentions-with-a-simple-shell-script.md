---
title: "Sending Webmentions with a Simple Shell Script"
description: I came across a convenient way to send webmentions from my terminal using a simple Bash script.
fedi_url:
  - https://hachyderm.io/@reillypascal/115855402070350924
  - https://bsky.app/profile/reillypascal.bsky.social/post/3mbu6dve5wk2r
date: 2026-01-07T13:25:04-0500
tags:
  - post
  - indieweb
  - webmentions
  - programming
indienews: true
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

I came across a convenient way to send webmentions from my terminal using a simple Bash script. [This page on the IndieWeb wiki](https://indieweb.org/webmention-implementation-guide#One-liner_webmentions) includes a shell script one-liner. It references an older version of the webmention standard, but I was able to figure it out and get it working with my setup. I have the following in [a file titled `send-wm`](https://github.com/reillypascal/personalsite-ssg/blob/main/send-wm):

```bash
#!/usr/bin/env bash

my_url="$1"
target_url="$2"

curl -i -d "source=$my_url&target=$target_url" $(curl -i -s "$target_url" | grep 'rel="webmention"' | grep -o -E 'https?://[^ ">]+' | sort | uniq)
```

The example had `rel="http://webmention.org/"` instead of `rel="webmention"`, which is the current standard. It also included an extra step — `sed 's/rel="webmention"//'`. I assume this was originally supposed to read something like `sed 's/rel="http:\/\/webmention.org\/"//'`, which would be necessary to make sure there is only one "http(s)" to `grep` for. At any rate, that part doesn't appear to be currently necessary. (UPDATE: I edited the IndieWeb wiki to reflect the current version of this script!)

This script can be used as follows. Note that to do this, you will first need to run `sudo chmod +x send-wm` to make the script executable:

```sh
./send-wm <your_url> <target_url>
```

The basic command to send a webmention using cURL looks like this:

```sh
curl -i -d "source=$your_url&target=$target_url" $targets_webmention_endpoint
```

This script inserts the provided source/target URLs into the statement, and the part inside the parentheses evaluates to the webmention endpoint from the target page.

I also added this to [my webmentions tutorial](https://reillyspitzfaden.com/wiki/tutorials/webmention-tutorial/#sending-webmentions-(command-line)) — I like to do that so all my webmention info is in one place. I regularly update this, and there's a table of contents to jump to specific sections.

## Future Plans

I imagine it's possible to make a version of this that only needs the URL for the post sending the mention, and can parse out a list of URLs linked from that page and try sending webmentions to each, handling any failure gracefully. If I get around to doing that, I'll write another post and add it to the tutorial. Until next time!
