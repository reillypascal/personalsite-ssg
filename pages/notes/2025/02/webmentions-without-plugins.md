---
title: Webmentions Without Plugins
description: At yesterday's Pacific Homebrew Website Club meeting, I got some great feedback and was able to figure out making my own code to bring in webmentions!
canonical_url: https://reillyspitzfaden.com/notes/2025/02/webmentions-without-plugins/
fedi_url: 
date: 2025-02-06T14:15:00-0500
tags:
  - note
  - indieweb
  - webmentions
  - webdev
  - 11ty
---

<!-- Code highlighting CSS -->
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
<noscript>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
</noscript>

I [recently wrote](/posts/2025/01/displaying-webmentions/) about bringing in [webmentions](https://indieweb.org/Webmention) from both other people's personal sites and from Fediverse/Bluesky interactions and displaying them on my posts. The only issue was that I relied on [a plugin](https://github.com/CodeFoodPixels/eleventy-plugin-webmentions) that hadn't been updated in a bit over 2 years, plus I like DIY-ing things. At yesterday's Pacific [Homebrew Website Club](https://indieweb.org/Homebrew_Website_Club) meeting, I got some great feedback and was able to figure out making my own code!

To fix the issues I mentioned in the previous post, all I had to do was change from [CommonJS](https://requirejs.org/docs/commonjs.html) to [ES Module syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). This meant changing the first line that imports the ”eleventy-fetch” package and the “export” line (see [previous post](/posts/2025/01/displaying-webmentions/) for the original code), and changing the [Eleventy data file](https://www.11ty.dev/docs/data-global/) from ”webmentions.js” to ”webmentions.mjs.” I still don't know *why* this worked — other attendees use CommonJS syntax and it works fine! — although one reason brought up was that it may relate to the version of Eleventy, with newer ones possibly needing ES Modules. At any rate, I'm glad to have it working!

_data/webmentions.mjs:
```js
// Fetch webmentions from webmention.io API
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
    console.log(e);
    return {
      mentions: [ "none" ]
    };
  }
};
```

<!-- basic, JS highlighting from "highlight.js" library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js"></script>

<script>hljs.highlightAll();</script>