---
title: How to Set Up, Parse, and Display Webmentions
description: Comprehensive tutorial on webmentions using Webmention.io, Eleventy, and Netlify. Addresses many different levels of complexity — you can get up and running with only two lines of HTML!
fedi_url:
  - 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-08T22:49:33-0400
octothorpes:
  - 
tags:
  - digital-garden
  - 11ty
  - indieweb
  - tutorial
  - webdev
  - webmentions
draft: true
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<nav class="table-of-contents" aria-label="table-of-contents">
  <details>
    <summary>Table of Contents</summary>

- [The Basics with Webmention.io](#the-basics-with-webmentionio)
- [Making a Webmentions Form](#making-a-webmentions-form)
- [Accessing Mentions in Eleventy](#accessing-mentions-in-eleventy)
- [Automatically Bringing in New Mentions](#automatically-bringing-in-new-mentions)
- [Sending Webmentions](#sending-webmentions)
- [Fediverse Interactions as Webmentions with Bridgy](#fediverse-interactions-as-webmentions-with-bridgy)

  </details>
</nav>

I've [written](/posts/2024/05/receiving-webmentions-part-1/) a [few](/posts/2025/01/displaying-webmentions/) times [before](/posts/2025/02/webmentions-without-plugins/) about setting up [webmentions](https://en.wikipedia.org/wiki/Webmention) on my site, and today I'm bringing all that information into one post and discussing some recent additions to my system.

Webmentions are a nice way to use personal websites to interact with other sites, and a popular tool for the [IndieWeb](https://indieweb.org/). With them enabled, you can notify another site when you link to them, and receive notifications when someone links to you. I'm going to explain a few levels of setting them up — you can do something very simple, with just a few links added to the ```<head>``` tag on your page, all the way up to something more complex where you automatically display the mentions like comments. Here are the tools we'll be using:

- [Webmention.io](https://webmention.io/) — this is the only strictly necessary one. It's a service by [Aaron Parecki](https://aaronparecki.com/) to receive and transmit webmentions so you don't have to run your own server.
- [Eleventy](https://www.11ty.dev/) — the static site generator I use to build my site, although you can do the basics of this on any site setup.
- [Netlify](https://www.netlify.com/) — the hosting service I use. I use their [build hooks](https://docs.netlify.com/configure-builds/build-hooks/) to instruct my site to rebuild nightly and pull in new mentions.
- [Bridgy](https://brid.gy/) — if you share a post from your site on Mastodon/Bluesky/etc., this service can turn interactions with that post into webmentions that go to your site. You can then display these as comments on your blog.

If you have any trouble, the folks on the [IndieWeb Chat](https://chat.indieweb.org/) are extremely helpful — you can ask them questions at the link above, and the link also includes Discord/Slack versions of the chatroom if that's more your style.

Let's get started!

### The Basics with Webmention\.io{#the-basics-with-webmentionio}

As I mentioned in my [first post](/posts/2024/05/receiving-webmentions-part-1/) on the topic, to start, go to [Webmention.io](http://webmention.io/) and sign in using your site URL. You'll need a tag in the `<head>` of your site that looks something like this: `<link rel="me" href="https://github.com/reillypascal" />`. Substitute the URL in the `href=""` field with your own GitHub URL. This allows you to use a GitHub account to sign in to Webmention\.io.

Once you're logged in, you can go to the “sites” tab of your dashboard (<https://webmention.io/settings/sites>) and enter your site in the “Create a new Site” field. This tripped me up the first time through, but Aaron [mentioned](https://github.com/aaronpk/webmention.io/issues/182) he didn't want Webmention\.io to automatically accept mentions for people who didn't want them, so you have to manually add the site after signing in.

Once you've added it, you can click “Get Setup Code” next to your site (should appear on your “sites” tab after adding the URL). This will generate a tag you can copy and paste into the `<head>` element of your page — something like `<link rel="webmention" href="https://webmention.io/reillyspitzfaden.com/webmention" />`. You can also just copy my example here, replacing “reillyspitzfaden.com” with your own URL. You're now ready to go! 

If you want to stop here, you can simply link to the endpoint for your site — should look like <https://webmention.io/reillyspitzfaden.com/webmention>, or in other words, the URL you put in the `href=""` field above. People can send you webmentions by putting their post link in the “Source URL” field and your post link in the “Target URL” one. If you want to validate that your mentions are working properly, you can use [webmention.rocks](https://webmention.rocks/), which has a list of tests you can run with helpful feedback.

In summary: two lines of HTML in the `<head>` tag, plus a link to your endpoint on each post is plenty to get up and running!

```html
<link rel="me" href="https://github.com/reillypascal" />
<link rel="webmention" href="https://webmention.io/reillyspitzfaden.com/webmention" />
```

### Making a Webmentions Form{#making-a-webmentions-form}

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

### Accessing Mentions in Eleventy{#accessing-mentions-in-eleventy}

Eleventy lets you use [JavaScript data files](https://www.11ty.dev/docs/data-js/) which will run when the site builds and make the resulting data globally available. These files go in the `_data` subfolder in your site publish directory, and the data is available as an object with the same name as the file (e.g., the file `webmentions.mjs` will make the data available as the `webmentions` object globally).

To get the API [^1] key for Webmention\.io, go to <https://webmention.io/settings> after signing in. In the section “API Key,” there is a value you  can copy. You can add this key as an [environment variable in Netlify](https://docs.netlify.com/environment-variables/get-started/#import-variables-with-the-netlify-ui) to keep it private. Note in `index.js`, I'm importing the [`dotenv`](https://www.npmjs.com/package/dotenv) Node package, which allows my site to access these variables. If you substitute your key into the line `https://webmention.io/api/mentions.jf2?token=${process.env.WEBMENTION_IO_TOKEN}&per-page=1000`, you get all webmentions available as an object, with the list of mentions in the `children` field. 

<div class="code-file">index.js</div>

```js
require("dotenv").config();
```

Note that this file is `webmentions.mjs`, rather than using the `.js` extension, and it uses [ES Modules](https://flaviocopes.com/es-modules/) syntax. As I mentioned [here](/posts/2025/02/webmentions-without-plugins/), while some tutorials/documentation show CommonJS syntax and the `.js` extension, I could never get it to work like that. I'm not 100% sure, but it seems to be a difference with Eleventy version 3.

<div class="code-file">_data/webmentions.mjs</div>

```js
import EleventyFetch from "@11ty/eleventy-fetch";

export default async function () {
	const url = `https://webmention.io/api/mentions.jf2?token=${process.env.WEBMENTION_IO_TOKEN}&per-page=1000`;
	try {
		const webmentions = await EleventyFetch(url, {
			duration: "1h",
			type: "json",
		});
		return {
			mentions: webmentions.children,
		};
	} catch (e) {
		return {
			mentions: [ "none" ]
		};
	}
};
```

Below is the Liquid template I use to import these mentions. 



Possible values for “wm-property” are `in-reply-to`, `like-of`, `repost-of`, `bookmark-of`, `mention-of`, and `rsvp`. 


```liquid
{% raw %}{% assign pageUrl = "https://reillyspitzfaden.com" | append: page.url %}
{% assign web_mentions = webmentions.mentions | webWebmentions: pageUrl %}

{% for mention in web_mentions reversed %}
    <div class="webmention-comment">
        {%- if mention.author.name and mention.author.name != "" %}
            {{ mention.author.name }}
        {%- else %}
            Someone
        {%- endif %}

        <a href="{{ mention.url }}">
            {%- if mention["wm-property"] == "like-of" -%}
                liked
            {%- elsif mention["wm-property"] == "in-reply-to" -%}
                replied to
            {%- else -%}
                mentioned
            {%- endif -%}
        </a> this post
        {%- if mention.content.text %}
            <blockquote>{{ mention.content.text | truncate: 175 }}</blockquote>
        {%- endif %}
    </div>
{% endfor %}{% endraw %}
```

### Automatically Bringing in New Mentions{#automatically-bringing-in-new-mentions}

Because the `_data/webmentions.mjs` script brings in new mentions when the site builds, rebuilding the site is a good way to bring in mentions without client-side JavaScript. My site is hosted on [Netlify](https://www.netlify.com/), and a simple way to make the site automatically rebuild is to use [build hooks](https://docs.netlify.com/configure-builds/build-hooks/). This is a URL and when you send an HTTP POST request to it, the site will build. You can do this with cURL: `curl -X POST -d {} "https://api.netlify.com/build_hooks/<your-hook-here>"`. 

I send out these POST requests from my home server. The server is a 2015 ASUS laptop running Ubuntu Server, which I set up according to [this guide](https://chriskalos.notion.site/The-0-Home-Server-Written-Guide-5d5ff30f9bdd4dfbb9ce68f0d914f1f6). [^2] GitHub actions are also another good way of scheduling this — Benji links to how he does that [here](https://www.benji.dog/notes/1738091887/). I actually tried doing it with GitHub actions first, but for some reason, I couldn't get scheduled actions with [`cron`](https://en.wikipedia.org/wiki/Cron). to work for me. 

On my home server, however, `cron` was super easy to use. `cron` syntax has 5 fields: minute, hour, day (month), month, day (week). You can give them a value, or use an asterisk (“*”) to allow all values. `0 2 * * *` in the example below means “run every day at 2:00 GMT, regardless of month or day.” This [crontab.guru](https://crontab.guru/) tool may be helpful in figuring out the syntax. Note that the times are in GMT, rather than the local time zone, so you would need to convert to local time. To set up a `cron` job, type `crontab -e` (i.e., “edit the crontab file”) into your server's terminal, and add a line like the following to the file that opens:

```sh
0 2 * * * curl -X POST -d {} "https://api.netlify.com/build_hooks/<your-hook-here>"
```

### Sending Webmentions{#sending-webmentions}

### Fediverse Interactions as Webmentions with Bridgy{#fediverse-interactions-as-webmentions-with-bridgy}

[Bridgy](https://brid.gy/)

Thanks for reading! Hopefully this can be of assistance to someone.

<a href="https://news.indieweb.org/en" class="u-syndication indienews">
  Also posted on IndieNews
</a>

[^1]: You can find more information about the complete Webmention\.io API [here](https://github.com/aaronpk/webmention.io#api).

[^2]: I use this server for a ton of things, including a [Jellyfin](https://jellyfin.org/) home streaming server — instructions included in the [server guide]() linked above — and a copy of [Syncthing](https://syncthing.net/) so my devices are always synced, even if only some are active at any given time. It's very nice, and I'll definitely do a tutorial about some of that later!