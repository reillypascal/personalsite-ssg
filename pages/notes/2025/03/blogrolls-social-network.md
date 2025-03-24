---
title: Blogrolls as a Social Network
description: I added an OPML file of my blogroll, and I talk about some really cool ideas from around the IndieWeb for using blogrolls as social web infrastructure
canonical_url: https://reillyspitzfaden.com/notes/2025/03/blogrolls-social-network/
fedi_url:
date: 2025-03-24T13:37:00-0500
tags:
  - note
  - fediverse
  - indieweb
  - webdev
---

I was pointed toward a fascinating article via a [post by Shellsharks](https://shellsharks.com/scrolls/scroll/2025-02-04) (thanks for the mention, btw!). In [this post](https://alexsci.com/blog/blogroll-network/), Robert Alexander proposes using blogrolls/[OPML files](https://en.wikipedia.org/wiki/OPML) as part of a [federated](https://en.wikipedia.org/wiki/Fediverse) social network. This could work by having a feed reader be able to pull in the blogroll from a site you follow and discover new sites right in the reader — I love this idea!

In a similar vein, James created a [link graph extension](https://jamesg.blog/2025/03/17/artemis-link-graph) that works with his very nice [Artemis](https://artemis.jamesg.blog/) web reader. The extension shows any pages from blogs you follow that link to the current page opened in your browser.

These ideas are still in the early stage, but this all inspired me to add an [OPML version](https://reillyspitzfaden.com/blogroll.opml) of my [blogroll](https://reillyspitzfaden.com/blogroll) — you can import it into your RSS reader if you want to follow these blogs! I also added the following to my page headers, as suggested in Robert Alexander's post above: `<link rel="blogroll" type="text/xml" href="https://reillyspitzfaden.com/blogroll/blogroll.xml">`. I'll be experimenting with the proposed [`<source:blogroll>` element](https://source.scripting.com/#1710035563000) too as I read more about this.
