---
title: I Would Rather Spend an Evening on a Web Scraper than Use Your App
description: My Swedish textbook publisher wanted me to listen to audio examples on their site or in their app. I had other ideas.
fedi_url:
  - https://hachyderm.io/@reillypascal/114559446968424613
  - https://bsky.app/profile/reillypascal.bsky.social/post/3lpunq4h42s2p
og_image: /media/blog/2025/05/mp3-scraper/complete-swedish-page-info.jpg
og_image_width: 1200
og_image_height: 630
date: 2025-05-22T23:48:09-0400
octothorpes:
  - javascript
  - web-development
  - web
  - software
tags:
  - post
  - javascript
  - webdev
  - enshittification
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<link rel="stylesheet" type="text/css" href="/styles/notes-photos.css">

I'm an extremely stubborn person, especially when it comes to how I interact with technology. For example, I vastly prefer to listen to audio (music, textbook audio examples, etc.) offline and in my music player, [^1] and I'm determined to ensure I can do that.

My partner's brother just got married, and since his spouse is Swedish and the U.S. is…\*gestures vaguely at everything\*, he's moving to Sweden. My partner is learning Swedish, and I think it could be fun to learn some too (I do like languages/linquistics). I have the textbook *Complete Swedish: Beginner to Intermediate* by Anneli Haake, and it seems great—aimed at self-teaching and includes audio resources. Unfortunately, the [audio resources](https://library.teachyourself.com/id004325173) are either available through an online player or in the publisher's app. [^2]

Since the online audio player embeds MP3s, and the links to the files are visible in the HTML source, I decided to make a web scraper to download the MP3s and use them how *I* want. Let's have a look at what that entails!

## Understanding the Page Structure

First, I looked at the page source to see what I'm dealing with. I found a list of `<item>` elements, with the MP3s in the `url=""` field. There were two issues with this, however. First, these `<item>` elements don't show up until you click on the play button in the web player. This meant I had to do that manually and then download the HTML, rather than directly giving the URL to my scraper.

Second, the MP3 links in the `url=""` fields were relative links, and they didn't work when I appended them to the page URL. I also wasn't able to find the CDN URL for them by searching the page source. What did turn out to work was using the “Page Info” feature in Firefox. I clicked on the lock icon in the URL bar, followed by the “connection secure” field in the resulting menu…

![screenshot of clicking on the lock icon in the corner of the Firefox address bar](</media/blog/2025/05/mp3-scraper/Screenshot 2025-05-23 at 5.09.02 PM.webp>){.img-strip}

…I clicked on “more information”…

![screenshot of clicking the “more information” field in the dropdown from the previous step](</media/blog/2025/05/mp3-scraper/Screenshot 2025-05-23 at 5.09.55 PM.webp>){.img-strip}

…and in the resulting “Page Info” popup, I went to the “media” tab and looked for items with the type “Audio.”

![the Firefox “page info” menu, showing the link to an embedded MP3](</media/blog/2025/05/mp3-scraper/Screenshot 2025-05-23 at 5.11.02 PM.webp>){.img-square}

By comparing the URL for the resulting media files to the relative URLs in the `<item>` HTML tags, I was able to get the CDN root URL for the files, which I confirmed to work with the relative URLs.

## Parsing the Page with Cheerio

I've played around a bit with the [cheerio](https://cheerio.js.org/) Node JS library for parsing HTML, and since I wanted some more experience with it for other projects anyway, [^3] I decided to go with that. My resulting code is below.

<div class="code-file">index.js</div>

```js
import * as fs from 'fs';
import * as https from 'https';
import * as cheerio from 'cheerio';

const buffer = fs.readFileSync("swedish.html");
const $ = cheerio.loadBuffer(buffer)

const cdn_root = "https://cdn77.papertrell.com/AkplUGiYnqjKEYG4SiU1hQ==,1747972188/Consumers/004/Users/325/Publish/004325173/";

const item_list = $('item');

item_list.each((index, element) => {
    const media_url = $(element).attr('url');
    const file_name = media_url.split('/').pop();
    const file = fs.createWriteStream('output/' + file_name);
    const request = https.get(cdn_root + media_url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
            file.close();
            console.log(`Downloaded ${file_name}`);
        })
    })
})
```

Cheerio uses a subset of jQuery's syntax. In line 6, I assign a cheerio object to the constant `$` with the `cheerio.loadBuffer()` method. As I mentioned, I'm doing this with an HTML file I manually downloaded since I need to have clicked the play button. 

In line 10, the syntax `$('item')` retrieves all `<item>` elements, and I can iterate over them with `.each()`. I get the relative URL with `$(element).attr('url')`, and I get only the string after the last "/" with `media_url.split('/').pop()`. `fs.createWriteStream()` opens the file to be written; `https.get()` requests the file from the URL I've parsed; `response.pipe()` writes the response to a file; and on finishing the file, `file.close()` closes the write stream.

## Situated Software and Agency

In [this post](/posts/2025/04/a-grimoire-of-shell-scripts/) I quoted Robin Sloan [writing](https://www.robinsloan.com/notes/home-cooked-app/) about “situated” or “home-cooked” software:

> People don’t only learn to cook so they can become chefs. Some do! But many more people learn to cook so they can eat better, or more affordably. Because they want to carry on a tradition. Sometimes they learn because they’re bored! Or even because they enjoy spending time with the person who’s teaching them.

> The list of reasons to “learn to cook” overflows, and only a handful have anything to do with the marketplace.

I'm completely self-taught at coding, and in addition to it being fun for me, I'm finding that having coding skills is helpful in working around “[enshittification](https://en.wikipedia.org/wiki/Enshittification)”. It's nice to be able to make small software that gives me agency. 

Since I don't have much experience with cheerio/web-scraping, it took a little longer than it absolutely needed to, and I may have been able to manually download the MP3s in a similar amount of time, but I would much rather spend that time on something I value (coding) and come out of it with some additional coding practice, so I consider this a success. Until next time!

[^1]: For my phone, I use [Auxio](https://github.com/OxygenCobalt/Auxio), which you can get via [F-Droid](https://f-droid.org/), [Obtainium](https://obtainium.imranr.dev/), or [Accrescent](https://accrescent.app/), among other non-Google sources.

[^2]: Insert GIF of the Earl of Lemongrab screaming “UNACCEPTABLE!”

[^3]: I'm using the Eleventy [table of contents plugin](https://plug11ty.com/plugins/table-of-contents/) to generate a table of contents from the header elements in a post. Since it hasn't been updated since 2021, I've tried directly using cheerio (which the plugin is based on), but wasn't having a lot of success. I figure playing with cheerio some more will help with that.