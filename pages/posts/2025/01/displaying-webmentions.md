---
title: Displaying Webmentions
description: I finally figured out displaying webmentions on my site without any client-side JavaScript!
fedi_url: 
  - https://hachyderm.io/@reillypascal/113907004496812260
  - https://bsky.app/profile/reillypascal.bsky.social/post/3lgsvxvnopk2o
date: 2025-01-28T00:55:00-0500
tags:
  - post
  - 11ty
  - indieweb
  - webdev
---

<!-- Code highlighting CSS -->
<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

I got [webmentions](https://en.wikipedia.org/wiki/Webmention) displaying on my [Eleventy](https://en.wikipedia.org/wiki/Eleventy_(software)) site! If you look below this post you can see how it looks. I've seen a number of different ways of displaying them—Tracy Durnell displays them as [comments alongside “native” blog comments](https://tracydurnell.com/2025/01/21/guiding-principles-for-my-website/), [^1] and Benji shows [Mastodon interactions in a similar way to how I'm doing mine](https://www.benji.dog/notes/1733601983/). I've also seen someone (I'm forgetting who) show the profile photos of people who interact with the post on the Fediverse, categorized into “likes,” reposts, and replies/comments. I ended up displaying the number of each of those categories from both Fediverse interactions and people sharing my links on their blogs all in one. I like having a minimalist display while still showing when people interact with something.

I originally tried to DIY it, following along with [Bob Monsour's post here](https://bobmonsour.com/blog/adding-webmentions-to-my-site/), but for some reason, no matter what I did, the Eleventy ```webmentions``` data always returned the following:

```bash
{
  default: [AsyncFunction (anonymous)],
  'module.exports': [AsyncFunction (anonymous)]
}
```

I got the suggestion to use promises and ```.then()``` syntax instead of the ```async``` function, but that didn't seem to change anything. The code I originally tried (in _data/webmentions.js) is below, if anyone has any idea.

```js
const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
  const url = `https://webmention.io/api/mentions.jf2?token=${process.env.WEBMENTION_IO_TOKEN}&per-page=1000`;
  try {
    const webmentions = await EleventyFetch(url, {
      duration: "0s",
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

I ended up using the “[eleventy-plugin-webmentions](https://github.com/CodeFoodPixels/eleventy-plugin-webmentions)” plugin, and that seems to work well. I was a bit hesitant to use the plugin since it hasn't been updated in about 2 years and I want something that will last, but it works well for now, and I can always make another go at DIY-ing it. 

My next step is to get it to automatically build every so often so I can get new webmentions. [Thadee](https://www.voorhoede.nl/en/blog/scheduling-netlify-deploys-with-github-actions/) and [Sophie Koonin](https://localghost.dev/blog/how-to-schedule-posts-in-eleventy/) have some discussions I'll look at. Something else I'm considering is just using [cURL](https://en.wikipedia.org/wiki/CURL) to get the webmentions in a .json file. When I manually ran this line, I was able to use the resulting file in Eleventy just fine, so I may try automatically running that line in a GitHub action.

```bash
curl 'https://webmention.io/api/mentions.jf2?token=-PsKFuieg-7U9kQK5X8cqg&per-page=1000' -o ./pages/_data/webmentions-static.json
```

## Design
While I'm not finished with how I handle displaying the webmentions behind the scenes, I am happy with the design elements for them. I added SVG icons to the tags at the top of the posts (to match the calender icons), to the email reply at the bottom, and to the webmention line—both the webmention icon and the symbols for the categories. I've been thinking about how to keep the site text-focused and minimal but add a bit of visual clarity to the layout, and I think this kind of icon works well for me.

## Looking Forward
I think I'll start doing more writeups of/notes about in-progress projects. While I'm still not fully satisfied with my results here, and I have a number of other things I want to get done, it feels nice to write out what I *have* accomplished. Also allowing things to be unfinished helps me write about them — if I wait until I feel truly done (which often doesn't come!) I may not write about it at all.

[^1]: In addition to including this post as a reference for displaying webmentions, I want to respond to these principles in a future post and use them as a jumping-off point to write about how I want to use my own site.