---
layout: blogpostlayout.liquid
root_folder: ../../../..
title: Static Site Generators Are Nice
description: Making it easier to blog, and to use my site instead of social media
canonical_url: https://reillyspitzfaden.com/posts/2024/11/ssgs-are-nice
url: posts/2024/11/ssgs-are-nice
date: 2024-11-23
categories: [ "webdev", "indieweb", "programming", "blog" ]
tags: post
---

I finally have a static site generator ([Eleventy](https://www.11ty.dev/)) set up for my site! I had taken a break from blogging as of mid June this year because my initial workflow was untenable.

I first published this site in 2022 as a simple portfolio of my work. At that point it had around six or seven pages, and it wasn't too hard for me to hand-write everything. At the end of 2023, I realized that I would like to start blogging, and out of inertia, I kept doing everything by hand. By mid June of 2024, however, I had something like 20 pages total in my website. By then it was extremely unpleasant to edit everything by hand, especially when I wanted to change anything in the header or footer, which required editing every single page again.

Now, I'm able to put a properly formatted post in the appropriate directory, and that's it! Eleventy adds the post link and description to the blog page and generates a full-text RSS feed. I've avoided frameworks (e.g., React) because I'd like to minimize client-side JS, and with SSGs, I hadn't realized how much control I could still have over the HTML, so this setup is a nice surprise.

### IndieWeb and the Social Web
I started the year hopeful for using IndieWeb architecture and my personal site to replace some of my social media interactions. However, I tend to make things part of my daily routine only if there's low friction. Having to hand-write HTML, add post links, add posts to my RSS feed, etc. made it much more appealing to just use existing social media. I'm hopeful that this new site setup can change that.

Thanks for reading! I'm planning to be much more active on here now.

<div class="email-reply">
    <a href="mailto:reillypascal@gmail.com?subject=Re: {{ title }}">Reply via email</a>
</div>
