---
layout: blogpostlayout.liquid
root_folder: ../../../..
title: Receiving Webmentions, Part 1
description: Setting up my blog to receive Webmentions
canonical_url: https://reillyspitzfaden.com/posts/2024/05/receiving-webmentions-part-1
url: posts/2024/05/receiving-webmentions-part-1
date: 2024-05-21
categories: ["webdev", "indieweb", "programming"]
tags: post
---

Hi everyone! I recently set up my blog to receive [Webmentions](https://en.wikipedia.org/wiki/Webmention), which means that if somebody wants to link to one of my posts from their website, I can get a notification about their post. I like this because it allows people in the [IndieWeb](https://indieweb.org) community to use our websites kind of like social media — to have conversations with each other — but outside of the silos of social media.

I got the basics taken care of for now, and in a future update I will make it easier for people to send them to me, as well as adding a way to display them as comments on the appropriate post.

### How I Did It

I used [Webmention.io](https://webmention.io) for my Webmentions, which made the whole process pretty simple on my end. First I went to Webmention.io and signed in with my website. When you type your website URL into the sign in field, it looks for a `rel="me"` link. In my case, I have the following HTML tag in the `<head>` of my page:

`<link rel="me" href="https://github.com/reillypascal" />`

In other words, I'm using my GitHub account to sign in to Webmention.io. This is called [RelMeAuth](https://microformats.org/wiki/RelMeAuth), and if you don't want to use a silo website such as GitHub, you can also use [IndieAuth](https://indieweb.org/IndieAuth), which I will likely set up in the future.

If I type my URL into the login bar now, Webmention.io will redirect me to a login page where I can approve the sign-in via GitHub. Once I've logged in, I can simply place the following tag in the `<head>` of my homepage:

`<link rel="webmention" href="https://webmention.io/reillyspitzfaden.com/webmention" />`

The general format is as follows (this is also given on Webmention.io once you've logged in):

`<link rel="webmention" href="https://webmention.io/<username>/webmention" />`

Where "`<username>`" is usually the URL of your site.

### One More Thing

At this point you could previously go [here](https://webmention.io/dashboard) and see any Webmentions that came in. However, there is one new feature to be aware of. I tested out my site using the "[Receiver Test #1](https://webmention.rocks/receive/1)" at [webmention.rocks](https://webmention.rocks), and it was giving me a 404 error. When I talked to Webmention.io's creator Aaron Parecki in the [IndieWeb chat](https://chat.indieweb.org/), I learned that there are some new updates. As discussed in [this](https://github.com/aaronpk/webmention.io/issues/182) GitHub issue, Aaron wants to prevent Webmention.io from automatically accepting mentions for anybody who does not explicitly  ask for it. As a result, one final step is that you need to go [here](https://webmention.io/settings/sites) after signing into Webmention.io, and enter your site URL in the box. At this point, the receiver test worked flawlessly for me.

### Going Forward

If you have Webmentions set up, please send me one if you link to my blog posts! I always appreciate connecting with other IndieWeb people. If you're just getting started with Webmention.io, you should be able to go to `https://webmention.io/<username>/xmlrpc`, where `<username>` is your site URL, and send me one. Soon I will be adding a field to my blog posts so you can submit the URL of your post right on my site. I will also make it so when you click the button to load comments, Webmentions I've received for the post will be displayed alongside the comments.

### Fun Fact of the Day

Speaking of blogs, "blog" comes from "web-log," but did you know that "log" (in the sense of "log-book") comes from "log" as in a log from a tree? I like to browse [Etymonline](https://etymonline.com) for fun, and the page for [log](https://www.etymonline.com/word/log#etymonline_v_43590) (as in "log-book") explains that sailors would place a chip of a tree log in the water on the end of a rope with knots at regular intervals, and used the rate at which the knots passed by to tell the ship's speed. Isn't etymology great?

<div class="email-reply">
    <a href="mailto:reillypascal@gmail.com?subject=Re: {{ title }}">Reply via email</a>
</div>
