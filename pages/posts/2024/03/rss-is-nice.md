---
layout: blogpostlayout.liquid
root_folder: ../../../..
title: RSS Is Nice
description: My process of adding RSS to my blog, my rediscovery of how nice RSS is, and some music blogs I've been enjoying
canonical_url: https://reillyspitzfaden.com/posts/2024/03/rss-is-nice
url: posts/2024/03/rss-is-nice
date: 2024-03-10
categories: ["rss", "webdev", "indieweb", "music", "blog"]
tags: post
---

## RSS Is Nice

This past week I added [RSS](https://en.wikipedia.org/wiki/RSS) to my blog! Here I'll talk about the process of doing that, my rediscovery of how nice RSS is, and some music blogs I've been enjoying. If you want to follow my blog, [here's the link](https://reillyspitzfaden.com/blog/feed.xml).

### RSS for my Blog

I started out by trying to make my blog automatically generate the RSS feed — all I would have to do is upload the files to Netlify as I normally do. The first place I looked was at this [article](https://www.contentful.com/blog/generate-blog-rss-feed-with-javascript-and-netlify/), with the [jsdom](https://www.npmjs.com/package/jsdom) NPM package to handle parsing my HTML files where this post used [Contentful](https://www.contentful.com/about-us/)'s built-in system. As I tried this and some related avenues out, I became unhappy with the number of steps involved, and auto-generating started to feel like more work than simply hand-writing an XML file.

When I looked into it, I found that hand-writing an RSS XML file was even easier than I assumed, and didn't hinder my wanting to make new posts. The [RSS specification](https://www.rssboard.org/rss-specification) is all clearly laid out, and the official page includes [sample files](https://www.rssboard.org/rss-specification#sampleFiles) for v0.91, v0.92, and v2.0. My current system is that I have a [template](https://github.com/reillypascal/personalsite/blob/main/reillyspitzfaden/blog/templates/template.xml) in my site files, and I can copy/paste the `<item>` section into the main feed file and fill in the blanks.

This method is still a little "rough-and-ready," what with the copy-pasting, but the important thing for me is that it *works*. After seeing Molly White [mention](https://hachyderm.io/@molly0xfff/111960696197094015) it, I have been eyeing the IndieWeb wiki's discussion of [making your own CMS](https://indieweb.org/content_management_system#Why_write_your_own), and I may try improving my system with something like that — not integrated with Netlify, but I could run a homemade static site generator before uploading my files. My best guess so far is I could use the [rss](https://www.npmjs.com/package/rss) NPM package as one way of handing the RSS part of a CMS, but if people have suggested tools, I would love to hear about them!

Side note: one final tweak I did outside of RSS is adding a typographical [asterism](https://en.wikipedia.org/wiki/Asterism_%28typography%29) to my blog posts, inspired by jamesg's recent "[100 things you can do on your personal website](https://jamesg.blog/2024/02/19/personal-website-ideas/)" post.

### Why RSS

For a while I would follow news outlets on social media and look for stories there, but I've found that this makes using social media feel like playing Russian roulette — I never know if I'm going to see something funny a friend posted, some cool new music, or an atrocity I have no control over. Separating out my news so I have more choice over what to read and when means I'm much less anxious, while still staying engaged with what's going on around me.

In addition to giving me more control over what I see and when, and helping me keep track of a large number of sites, one thing I especially like is how clean the interface can be, and how I get to decide how it looks. I use [NetNewsWire](https://netnewswire.com/), and when I open an article, it's just text and maybe a few images, and everything is formatted the same. The list of articles too — articles are linearly organized, rather than scattered around the page. The whole experience feels much quieter and more relaxed.

### Favorite Blogs

I follow a variety of things, but one area that's been especially nice is experimental music. I spent the past year or two listening to mostly the same music (such as [Autechre](https://autechre.bandcamp.com/album/draft-730), [Fire-Toolz](https://fire-toolz.bandcamp.com/album/rainbow-bridge), and [Magdalena Bay](https://magdalenabay.bandcamp.com/album/mercurial-world)), but being in Fediverse/IndieWeb circles, I've stumbled onto a bunch of blogs and artists that give me a huge amount of new music to explore. It took me a bit of time in these circles, but when I found the first few blogs or artists, I came across countless others in rapid succession, often as a result of previous blogs or artists. Here are some of my favorites:

- [a closer listen](https://acloserlisten.com/)
    - This site focuses on instrumental album reviews. I appreciate that the [writers](https://acloserlisten.com/staff/) are numerous and prolific — I get reviews in my inbox every day. [RSS](https://acloserlisten.com/rss)
- [Avant Music News](https://avantmusicnews.com/)
    - AMN has been a particularly helpful jumping-off point. They do a mixture of their own reviews and sharing reviews from other sites. They describe themselves as covering music that's "challenging, interesting, different, progressive, introspective, or just plain weird" — exactly what I like to hear. [RSS](https://avantmusicnews.com/rss)
- [Fringes of Sound](http://www.onthefringesofsound.com/)
    - A blog that covers "independent experimental, ambient, noise, and other music that falls well outside the mainstream." I haven't been able to find out as much as some of the others, but the Instagram page lists just one person, a [Lars Haur](https://www.instagram.com/lars_haur/), so this may be a single-person project. [RSS](https://www.onthefringesofsound.com/feeds/posts/default?alt=rss)
- [Outside Noise](https://www.outsidenoise.org/reviews/)
    - I had known about this blog for a while, but I found that keeping my news and blogs in a bookmarks folder and having to repeatedly check to see if anything new was posted discouraged me from reading. I also find managing bookmarks on my phone to be especially irritating, and unfortunately, if I don't have something on my phone I'm less likely to check it. [RSS](https://www.outsidenoise.org/reviews?format=rss)
- [Yeah I Know It Sucks](https://yeahiknowitsucks.wordpress.com/)
    - This one I had actually encountered back in 2018 when they did a [review](https://yeahiknowitsucks.wordpress.com/2018/01/04/how-things-are-made-with-reilly-spitzfaden-jamie-vandermolen-maurice-rickard-and-an-eel/) of an album that included one of my pieces! I was reminded of the blog when another blog (I feel like it was AMN, but I can't find the post) linked to a review by Yeah I Know It Sucks, and I saw that they have continued regular coverage of interesting music. [RSS](https://yeahiknowitsucks.wordpress.com/rss)

### Final Thoughts

That's all for today! I'm looking at adding some new features to my site ([Webmentions](https://en.wikipedia.org/wiki/Webmention) are high on my list), and I'm continuing to do sound design and composition. When I get more interesting sounds made or site features added, I'll definitely do a writeup of those here as well.

I've also been getting back into reading for fun, now that I'm out of school (finished my composition PhD in 2022), and I may discuss some of the books I'm reading. I recently got "[High Static; Dead Lines](http://www.kristengallerneaux.com/high-static-dead-lines)" by Kristen Gallerneaux, "[House of Leaves](https://en.wikipedia.org/wiki/House_of_Leaves)" by Mark Z. Danielewski, and "[This Is How They Tell Me the World Ends](https://en.wikipedia.org/wiki/This_Is_How_They_Tell_Me_the_World_Ends)" by Nicole Perlroth, and I'm excited for all of them.
