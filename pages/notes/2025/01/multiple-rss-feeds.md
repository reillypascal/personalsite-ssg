---
title: Adding multiple RSS feeds
description: Manually generating RSS feeds so I can have separate ones for different kinds of posts
canonical_url: https://reillyspitzfaden.com/notes/2025/01/multiple-rss-feeds
fedi_url: https://hachyderm.io/@reillypascal/113884630531813259
date: 2025-01-24T00:00:00-0500
tags:
  - note
  - 11ty
  - webdev
---

I finally have [multiple RSS feeds](https://reillyspitzfaden.com/feeds/) on my site! I previously used Eleventy to [auto-generate](https://www.11ty.dev/docs/plugins/rss/#virtual-template) the feed, but that method only works to make a single feed, and I wanted to have a separate one for my new [notes feed](https://reillyspitzfaden.com/notes/).

I ended up having to make an [explicit template](https://github.com/reillypascal/personalsite-ssg/blob/main/pages/_includes/rss.njk) for how the feeds should look, and then I can [apply that template to each feed](https://github.com/reillypascal/personalsite-ssg/tree/main/pages/feeds) that I need to generate. I'd been wanting to do this for a while, but had seriously struggled. Eventually [this writeup](https://michaelharley.net/posts/2020/12/31/rss-a-love-letter-and-walkthrough-for-my-eleventy-site/) helped me figure it out, and I borrowed from [how Benji imported a template](https://github.com/benjifs/benji/blob/main/src/feeds/rss/feed.njk) to avoid repeating the same code for each feed. I'm very happy to have this working!