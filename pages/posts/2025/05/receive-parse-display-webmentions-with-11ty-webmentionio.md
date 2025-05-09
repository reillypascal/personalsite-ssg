---
title: How to Receive, Parse & Display Webmentions with 11ty & Webmention.io
description: 
fedi_url:
  - 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-08T22:49:33-0400
octothorpes:
  - 
tags:
  - post
post_series: 
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

I've [written](/posts/2024/05/receiving-webmentions-part-1/) a [few](/posts/2025/01/displaying-webmentions/) times [before](/posts/2025/02/webmentions-without-plugins/) about setting up [webmentions](https://en.wikipedia.org/wiki/Webmention) on my site, and today I'm bringing all that information into one post and discussing some recent additions to my system.

Webmentions are a nice way to use personal websites to interact with other sites, and a popular tool for the [IndieWeb](https://indieweb.org/). With them enabled, you can notify another site when you link to them, and receive notifications when someone links to you. I'm going to explain a few levels of setting them up — you can do something very simple, with just a few links added to the ```<head>``` tag on your page, all the way up to something more complex where you automatically display the mentions like comments. Here are the tools we'll be using:

- [Webmention.io](https://webmention.io/) — this is the only strictly necessary one. It's a service by [Aaron Parecki](https://aaronparecki.com/) to receive and transmit webmentions so you don't have to run your own server.
- [Eleventy](https://www.11ty.dev/) — the static site generator I use to build my site, although you can do the basics of this on any site setup.
- [Netlify](https://www.netlify.com/) — the hosting service I use. I use their [build hooks](https://docs.netlify.com/configure-builds/build-hooks/) to instruct my site to rebuild nightly and pull in new mentions.

If you have any trouble, the folks on the [IndieWeb Chat](https://chat.indieweb.org/) are extremely helpful — you can ask them questions at the link above, and the link also includes Discord/Slack versions of the chatroom if that's more your style.

Let's get started!

### The Basics with Webmention.io

As I mentioned in my [first post](/posts/2024/05/receiving-webmentions-part-1/) on the topic, to start, go to [Webmention.io](http://webmention.io/) and sign in using your site URL. You'll need a tag in the ```<head>``` of your site that looks something like this: ```<link rel="me" href="https://github.com/reillypascal" />```. Substitute the URL in the ```href=""``` field with your own GitHub URL. This allows you to use a GitHub account to sign in to Webmention.io. 

Once you're logged in, you can go to the “sites” tab of your dashboard (<https://webmention.io/settings/sites>) and enter your site in the “Create a new Site” field. This tripped me up the first time through, but Aaron [mentioned](https://github.com/aaronpk/webmention.io/issues/182) he didn't want Webmention.io to automatically accept mentions for people who didn't want them, so you have to manually add the site after signing in.

Once you've added it, you can click “Get Setup Code” next to your site (should appear on your “sites” tab after adding the URL). This will generate a tag you can copy and paste into the `<head>` element of your page — something like `<link rel="webmention" href="https://webmention.io/reillyspitzfaden.com/webmention" />`. You can also just copy my example here, replacing “reillyspitzfaden.com” with your own URL. You're now ready to go! 

If you want to stop here, you can simply link to the endpoint for your site — should look like <https://webmention.io/reillyspitzfaden.com/webmention>, or in other words, the URL you put in the `href=""` field above. People can send you webmentions by putting their post link in the “Source URL” field and your post link in the “Target URL” one. If you want to validate that your mentions are working properly, you can use [webmention.rocks](https://webmention.rocks/), which has a list of tests you can run with helpful feedback.

### Making a Webmentions Form

One thing I haven't posted about at all is how to add a form to your site for people to send you mentions more easily. Below is the HTML I use. Notice the URL in the `action=""` field — that's the only thing you should have to change to make this work on your site. Replace “reillyspitzfaden.com” with your own URL and you should be set! 

```html
<form id="webmention-form" action="https://webmention.io/reillyspitzfaden.com/webmention" method="POST">
    <label for="webmention-form"><!-- insert any description for the form here --></label>

    <input id="webmention-source" type="url" autocomplete="url" required="" pattern="^https?:\/\/(.*)" name="source" placeholder="URL/Permalink of your article" class="error" aria-invalid="true">
    
    <input id="webmention-submit" type="submit" name="submit" value="Ping me!">

    <input id="webmention-format" type="hidden" name="format" value="html">
    <input id="webmention-target" type="hidden" name="target" value="">
</form>
```

One thing to note is that without some further JavaScript, the page will reload and you'll get a white page showing something like this:

```json
{
  "status": "pending",
  "source": "<source-url>",
  "target": "<target-url>",
  "private": false,
  "summary": "The webmention is currently being processed",
  "data": {
  }
}
```

I don't mind enough to bother changing this behavior, plus I prefer to minimize client-side JavaScript, but just something to be aware of.

### Accessing Mentions in Eleventy



<a href="https://news.indieweb.org/en" class="u-syndication indienews">
  Also posted on IndieNews
</a>
