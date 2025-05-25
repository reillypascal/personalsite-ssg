---
title: A Quick Guide to Everything I Know about Webmentions
description: Collection of tutorials on webmentions including the basics — you can get up and running with only two lines of HTML! — using microformats to enrich your mentions; adding a webmention form; and parsing, displaying, and updating them with Eleventy, Netlify, and Bridgy.
fedi_url:
  - https://hachyderm.io/@reillypascal/114564385903696882
  - https://bsky.app/profile/did:plc:7bvcd7usebxsagbrjbgpb75u/post/3lpwtxonyp22h
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-24T15:04:00-0400
octothorpes:
  - webmentions
  - web
  - web-development
  - websites
  - indieweb
  - html
tags:
  - wiki
  - 11ty
  - indieweb
  - tutorial
  - webdev
  - webmentions
indienews: true
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<aside class="preface-note">

Please feel free to use the table of contents to skip around — individual sections can be read on their own as mini-tutorials on a topic!

</aside>

[Webmentions](https://indieweb.org/Webmention) are [great](https://amberwilson.co.uk/blog/grow-the-indieweb-with-webmentions/)! They're a way that personal websites can interact with each other — you can notify another site when you link to them, and receive notifications when someone links to you. I find them to allow for some of the nicer parts of social interaction on the web, but with much more agency and much less inflammatory or harmful material than something like Facebook or Instagram. However, then can also be a bit intimidating, especially for [non-developers](https://tracydurnell.com/2025/01/09/sanding-off-friction-from-indie-web-connection/).

<!-- , so I'm writing this tutorial to share what I've learned. Since it's part of my [digital garden](/digital-garden), it will continue to grow and develop over time. -->

My goal with this tutorial is that people with a wide range of experience with coding/working in a command line — including no experience — can benefit from it. In particular, if you just read the first two sections, you'll be able to use webmentions by signing up for two services (GitHub and Webmention\.io) and adding two lines of HTML to your site:

```html
<link rel="me" href="https://github.com/reillypascal" />
<link rel="webmention" href="https://webmention.io/reillyspitzfaden.com/webmention" />
```

This even works with tools like Squarespace or Wordpress! Beyond that, each section builds on the last, so depending on how much you're comfortable with and/or interested in, you can choose your own adventure. For people with coding experience, I have some fun discussion of parsing and displaying webmentions as comments on your site; automating the process of bringing them into your site without client-side JavaScript; and using tools like [Bridgy](https://brid.gy/) to get Fediverse interactions as mentions.

Here are the tools we'll be using:

- [Webmention.io](https://webmention.io/) — this is the only strictly necessary one. It's a service by [Aaron Parecki](https://aaronparecki.com/) to receive and transmit webmentions so you don't have to run your own server.
  - The easiest way to log in to Webmention\.io does require a trusted third party account such as [GitHub](https://github.com/). You don't actually have to *do* anything with your GitHub account though — as long as it exists and you can log in, you're good.
- [Eleventy](https://www.11ty.dev/) — the static site generator I use to build my site, although you can do the basics of this on any site setup.
- [Netlify](https://www.netlify.com/) — the hosting service I use. I use their [build hooks](https://docs.netlify.com/configure-builds/build-hooks/) to instruct my site to rebuild nightly and pull in new mentions.
- [Bridgy](https://brid.gy/) — if you share a post from your site on Mastodon/Bluesky/etc., this service can turn interactions with that post into webmentions that go to your site. You can then display these as comments on your blog.

If you have any trouble, the folks on the [IndieWeb Chat](https://chat.indieweb.org/) are extremely helpful — you can ask them questions at the link, and the link also includes Discord/Slack versions of the chatroom if that's more your style.

Let's get started!

## The Basics with Webmention\.io

As I mentioned in my [first post](/posts/2024/05/receiving-webmentions-part-1/) on the topic, to start, go to [Webmention.io](http://webmention.io/) and sign in using your site URL. You'll need a tag in the `<head>` of your site that looks something like this: `<link rel="me" href="https://github.com/reillypascal" />`. Substitute the URL in the `href=""` field with your own GitHub profile URL. This allows you to use your website to sign in to Webmention\.io, with your GitHub page acting as a trusted third party to verify your identity.

Once you're logged in, you can go to the “sites” tab of your dashboard (<https://webmention.io/settings/sites>) and enter your site in the “Create a new Site” field. This tripped me up the first time through, but Aaron [mentioned](https://github.com/aaronpk/webmention.io/issues/182) he didn't want Webmention\.io to automatically accept mentions for people who hadn't asked for them, so you have to manually add the site after signing in.

Once you've added it, you can click “Get Setup Code” next to your site (should be available on your “[sites](https://webmention.io/settings/sites)” tab after adding the URL). This will generate a tag you can copy and paste into the `<head>` element of your page — something like `<link rel="webmention" href="https://webmention.io/reillyspitzfaden.com/webmention" />`. You can also just copy my example here, replacing “reillyspitzfaden.com” with your own URL. You're now ready to go! 

If you want to stop here, you can simply link to the endpoint for your site — should look like <https://webmention.io/reillyspitzfaden.com/webmention>, or in other words, the URL you put in the `href=""` field above. People can send you webmentions by putting their post link in the “Source URL” field and your post link in the “Target URL” one. You can view your mentions by going to the dashboard on Webmention\.io — <https://webmention.io/dashboard> — while signed in.

If you want to validate that your mentions are working properly, you can use [webmention.rocks](https://webmention.rocks/), which has a list of tests you can run, with helpful feedback.

In summary: two lines of HTML in the `<head>` tag, plus a link to your endpoint on each post is plenty to get up and running!

## Sending Webmentions (No Command Line)

There are a number of ways to send webmentions to someone whose post you link to. In many cases, people will include a form at the bottom of posts (e.g., see the bottom of this post), but if you can't find that, you have a few options.

The simplest way to find someone's endpoint if it's not clearly listed:
- Right-click on the page and choose “View Page Source”
- Cmd + F (Mac) or ctrl + F (Win/Linux) for “webmention”
- If you get a result, it should look something like `<link rel="webmention" href="https://webmention.io/reillyspitzfaden.com/webmention" />` from above.
- If you go to the URL in the `href=""` field, that should be the person's endpoint. You should be able to put your URL in the first field and the target post in the second and mention them!

A quick way to check if the page supports webmentions before bothering with this is Brent Lineberry's [Supports Webmentions?](https://orangegnome.com/posts/2929/supports-webmentions-bookmarklet) bookmarklet. If you bookmark this in your browser, you can click the bookmark while on a page and it will let you know if the page supports webmentions. Juha-Matti Santala also has a [bookmarklet](https://hamatti.org/posts/webmention-bookmarklet/) that does something similar. If you right-click in your bookmark bar and paste the code snippet from the bottom of the post into the URL field, it should work. The benefit to this is that clicking on it copies the endpoint URL to your clipboard, so you can ctrl + V/cmd + V it easily.

## Making a Webmentions Form

If you want to make things easier for your visitors, here's how to add a form to your site for people to send you mentions. Below is the HTML I use. Notice the URL in the `action=""` field — that's the only thing you should have to change to make this work on your site. Replace “reillyspitzfaden.com” with your own URL and you should be set! 

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

I don't mind enough to bother changing this behavior, plus I prefer to minimize client-side JavaScript — which would be necessary — but just something to be aware of.

## Making Your Mentions Richer with Microformats

If you go to the URL `https://webmention.io/api/mentions.jf2?token=<your-webmention-token>` (get your token [here](https://webmention.io/settings) after signing in to Webmention\.io), you can view the raw JSON data for webmentions sent to your site, which can be useful for understanding what's going on under the hood. When I first viewed this, I noticed that some people's mentions included details in an “author” field. When I tested sending mentions to myself, my “author” field was blank, and the difference seemed to be [microformats](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Microformats) — after adding them, my “author” field was filled out, as shown below:

```json
"author": {
    "type": "card",
    "name": "Reilly Spitzfaden",
    "photo": "https://avatars.webmention.io/reillyspitzfaden.com/10ca64df4721d256914c260109486f3051ac27b5586304a64c6c90d776cd6146.jpg",
    "url": "https://reillyspitzfaden.com/"
}
```

Microformats allow embedding properties in a page, to be read by social software, aggregators, search engines, and the like. Microformat tags are added as HTML class names. According to the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Microformats)

> - To create a microformats object, `h-*` class names are used in the class attribute.
> - To add a property to an object, the `p-*`, `u-*`, `dt-*`, `e-*` class names are used on one of the object's descendants.

Below is the [`h-card`](https://microformats.org/wiki/h-card) markup I use above each of my posts. MDN gives further information about the different prefixes you'll see in my markup [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Microformats#microformats_prefixes).

```html
<div class="p-author h-card" style="display:none;">
    <a rel="author" class="u-url u-uid" href="https://reillyspitzfaden.com"></a>
    <img class="u-photo" src="https://reillyspitzfaden.com/media/profile-300px-sqr.jpg" alt="Reilly Spitzfaden">
    <span class="p-name">
        <span class="p-given-name">Reilly</span>
        <span class="p-family-name">Spitzfaden</span>
    </span>
</div>
```
<!-- <div style="display:none;">
    <a rel="syndication" class="u-syndication" href="https://hachyderm.io/@reillypascal/113776964186364648"></a>
    <a rel="syndication" class="u-syndication" href="https://bsky.app/profile/reillypascal.bsky.social/post/3lez5zyuwcs2h"></a>
</div>
```
and `u-syndication` gives link(s) to where I [POSSE](https://www.citationneeded.news/posse/) my posts. -->

The `style="display:none;"` markup in the outer `<div>` ensures the card is not diplayed to users. The `class="p-author h-card"` in this `<div>` creates a microformats object with the `h-card` class; the `p-author` property adds that this card is for an author. The `u-url` and `u-uid` classes indicate that “https://reillyspitzfaden.com” is my site URL, with the `u-*` prefix indicating a link; similarly, `u-photo` gives a link to a photo to act as an avatar. The `p-name`, `p-given-name`, and `p-family-name` classes give plain-text information about me (plain-text indicated by the `p-*` prefix). 

In addition to this card, the entire article (including the card) is surrounded in an `<article>` tag with the class `h-entry`, creating a microformat object for the entire entry. The `<h1>` for the post title within that `<article` has the class `p-name`, and the content of the post is in a `<div>` with the class `e-content`. As described in the MDN link above, the `e-*` prefix is for “element tree properties where the entire contained element hierarchy is the value” — i.e., because `e-content` refers to the entire post contents, rather than any one single HTML element, we use `e-*`. 

<!-- The second `<div>` -->

In addition to enriching webmention data, microformats make a number of other [IndieWeb](https://indieweb.org/) practices possible, which I will describe more in a future post.

## Sending Webmentions (Command Line)

Searching the page for a mention endpoint and typing into that is not too hard to do, but it's also not very convenient. Two ways to send webmentions using the terminal are to use cURL, or to use [Webmention.app](https://webmention.app/docs#using-the-command-line). With cURL, you format your command as `curl -i -d source=source -d target=target endpoint`. So for example, to RSVP to the Homebrew Website Club, I might run

```sh
curl -i -d source="https://reillyspitzfaden.com/interactions/2025/04/rsvp-homebrew-website-club-americas-april-16/" -d target="https://events.indieweb.org/2025/04/homebrew-website-club-americas-xCttvgRnN4Pl" "https://events.indieweb.org/webmention"
```

This again requires knowing the endpoint (either with a bookmarklet or viewing the source). Webmention\.app has a command line tool that makes sending mentions particularly easy. Once you've [installed NodeJS](https://nodejs.org/en/download), run `npm install @remy/webmention` in your terminal in the folder where you want to install this tool. From that folder, you can run 

```sh
npx webmention https://reillyspitzfaden.com/feed.xml
```

This uses your site's RSS feed to get your most recent posts, so you would substitute your feed URL for mine. This tool will display all links that have webmention endpoints — no manual checking required! You can send webmentions for your latest post by running

```sh
npx webmention https://reillyspitzfaden.com/feed.xml --limit 1 --send
```

(again, replacing my feed URL with your own). 

One potential issue is that this package seems to be a little outdated these days. When I tried to install it on my site, NodeJS showed some critical vulnerabilities. When I installed it in its own separate folder, this wasn't as much of an issue for some reason, so you might try that — make a folder, open it in the terminal, and then run `npm install @remy/webmention`. The [Webmention.app](https://webmention.app/) site also offers some other tools, so you might play with those, although I haven't used them myself.

## Accessing Mentions in Eleventy

Eleventy lets you use [JavaScript data files](https://www.11ty.dev/docs/data-js/) which will run when the site builds and make the resulting data globally available. These files go in the `_data` subfolder in your site source directory, and the data is available as an object with the same name as the file (e.g., the file `webmentions.mjs` will make the data available as the `webmentions` object globally).

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

Note that this file is `webmentions.mjs`, rather than using the `.js` extension, and it uses [ES Modules](https://flaviocopes.com/es-modules/) syntax. As I mentioned [here](/posts/2025/02/webmentions-without-plugins/), while some tutorials/documentation show CommonJS syntax and the `.js` extension, I could never get it to work like that. I'm not 100% sure, but it seems to be a difference with Eleventy v3.x.x.

To get the API [^1] key for Webmention\.io, go to <https://webmention.io/settings> after signing in. In the section “API Key,” there is a value you can copy. As this page mentions, 

> \[if] you don't mind anyone being able to retrieve webmentions to your domain, you don't need to keep this private. The only thing this token can do is retrieve all webmentions to your domain. It can't modify any data on your account.

If you don't mind the key being public, you can hard-code it in the URL in `_data/webmentions.mjs` and skip the next paragraph and the `index.js` file.

If you do want to keep it private, you can add the key as an [environment variable in Netlify](https://docs.netlify.com/environment-variables/get-started/#import-variables-with-the-netlify-ui). Note in `index.js`, I'm importing the [`dotenv`](https://www.npmjs.com/package/dotenv) Node package, which allows my site to access these variables. If you substitute your key into the line `https://webmention.io/api/mentions.jf2?token=${process.env.WEBMENTION_IO_TOKEN}&per-page=1000`, you get all webmentions available as an object, with the list of mentions in the `children` field. 

<div class="code-file">index.js</div>

```js
require("dotenv").config();
```

Below is the Liquid template I use to import these mentions. As I mentioned above, if you go to the URL `https://webmention.io/api/mentions.jf2?token=<your-webmention-token>`, you can view the raw JSON data, in which you'll see the field “wm-property.” Possible values for “wm-property” are `in-reply-to`, `like-of`, `repost-of`, `bookmark-of`, `mention-of`, and `rsvp`, according to the Webmention\.io [API guide](https://github.com/aaronpk/webmention.io?tab=readme-ov-file#api). As shown in my code below, I use this list of properties to display, e.g., “someone liked this post,” or “someone replied to this post,” falling back on the generic “mentioned” if there is any issue retrieving this property.


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
            {%- elsif mention["wm-property"] == "bookmark-of" -%}
                bookmarked
            {%- elsif mention["wm-property"] == "repost-of" -%}
                reposted
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

Notice the custom [Liquid filter](https://shopify.dev/docs/api/liquid/filters) `webWebmentions`. The vertical pipe character “|” sends the value `webmentions.mentions` from `_data/webmentions.mjs` into the filter, with the colon after `webWebmentions` allowing me to send the additional value of `pageUrl` to the filter. The code for the filter is in my `eleventy.config.js` file, and is shown below:

```js
eleventyConfig.addFilter("webWebmentions", function(webmentions, url) {  
  const pageWebmentions = webmentions
    .filter((mention) => mention["wm-target"] == url)
    .filter((mention) => !mention["wm-source"].includes("https://brid.gy/"))
    .filter((mention) => !mention["wm-source"].includes("https://bsky.brid.gy/"))
    .sort((a, b) => new Date(b.published) - new Date(a.published))
  
  return pageWebmentions;
});
```

I filter the mentions by the following rules:

- The `wm-target` property is the URL for the page — i.e., the mention refers to this post
- The `wm-source` property does not include “<https://brid.gy/>” or “<https://bsky.brid.gy/>” — i.e., the mention is from someone's blog, rather than being a Mastodon/Bluesky interaction bridged over with Ryan Barrett's [Bridgy](https://brid.gy/) service.
  - The counterpart to this filter, `fediWebmentions` does the opposite, only allowing mentions that *are* from those two URLs. This lets me show a separate counter of Fediverse/Bluesky interactions on the [POSSE](https://www.citationneeded.news/posse/)-ed copies.
- I sort the mentions in reverse chronological order, using the “published” field which you can view in the raw JSON data at `https://webmention.io/api/mentions.jf2?token=<your-webmention-token>`.

I then use the Liquid keyword `assign` to assign the results of the `webWebmentions` filter to the `web_mentions` variable, allowing me to access and further parse them in the Liquid template.

## Automatically Bringing in New Mentions

<!-- Client-side JS -->

Because the `_data/webmentions.mjs` script brings in new mentions when the site builds, rebuilding the site is a good way to bring in mentions without client-side JavaScript. My site is hosted on [Netlify](https://www.netlify.com/), and a simple way to make the site automatically rebuild is to use [build hooks](https://docs.netlify.com/configure-builds/build-hooks/). This is a URL and when you send an HTTP POST request to it, the site will build. You can do this with cURL: `curl -X POST -d {} "https://api.netlify.com/build_hooks/<your-hook-here>"`. 

I send out these POST requests from my home server. The server is a 2015 ASUS laptop running Ubuntu Server, which I set up as I describe [[tv-media-server|here]]. [^2] GitHub actions are also another good way of scheduling this — Benji links to how he does that [here](https://www.benji.dog/notes/1738091887/). I actually tried doing it with GitHub actions first, but for some reason, I couldn't get scheduled actions with [`cron`](https://en.wikipedia.org/wiki/Cron). to work for me. 

On my home server, however, `cron` was super easy to use. `cron` syntax has 5 fields: minute, hour, day (month), month, day (week). You can give them a value, or use an asterisk (“*”) to allow all values. `0 2 * * *` in the example below means “run every day at 2:00 GMT, regardless of month or day.” This [crontab.guru](https://crontab.guru/) tool may be helpful in figuring out the syntax. Note that the times are in GMT, rather than the local time zone, so you would need to convert to local time. To set up a `cron` job, type `crontab -e` (i.e., “edit the crontab file”) into your server's terminal, and add a line like the following to the file that opens:

```sh
0 2 * * * curl -X POST -d {} "https://api.netlify.com/build_hooks/<your-hook-here>"
```

## Fediverse Interactions as Webmentions with Bridgy

I like to [POSSE](https://www.citationneeded.news/posse/) my posts (“Publish on Your Own Site, Syndicate Elsewhere”) on Mastodon and Bluesky. It's a nice balance between the ownership of my data that having my own site provides, and the broader reach of social media platforms. It turns out it's also possible to bring in Mastodon/Bluesky responses, likes, and reposts, and display them on my site using the [Bridgy](https://brid.gy/) service. The IndieWeb community calls this [backfeeding](https://indieweb.org/backfeed), and comments that

> We POSSE to make it easier for our friends and others to read our posts.

> The point of implementing backfeed is to similarly make it easy for those same people to interact with those POSSE copies in a way that makes it back to the original, thus make it easier for you, the author of those original posts on your indieweb site to read their comments, and view other interactions. 

Here, I'll go through how to set up Bridgy to do this. From [brid.gy](https://brid.gy/), you can click on one of the buttons under “connect your accounts.” The process then looks a bit different for Mastodon and Bluesky. 

### Mastodon and Bridgy

After clicking on the Mastodon button, you'll have the option to “cross-post to a Mastodon account” or “connect directly to the fediverse.” Choose the “cross-post to a Mastodon account” option. On the next page, enter your Mastodon instance (e.g., mastodon\.social, etc. — just the instance/server name, not your username) in the field labeled ”enter a Mastodon instance.” This should start backfeeding your posts. 

For both Mastodon and Bluesky (but it seems especially for Mastodon), include the following in each post:

```html
<a rel="syndication" class="u-syndication" href="https://hachyderm.io/@reillypascal/114559446968424613"></a>
```

Replace the ``href""` contents with the URL of the Mastodon post where you share the link to your website post. Note that you will likely need to come back and add this after sharing your post, in order to actually have the URL! I have a `fedi_url` field in the Eleventy [frontmatter](https://www.11ty.dev/docs/data-frontmatter/) of my blog posts, and the following code in my blog post [layout](https://www.11ty.dev/docs/layouts/):

```liquid
{% raw %}{% if fedi_url %}
    <div style="display:none;">
        {%- for url in fedi_url %}
            <a rel="syndication" class="u-syndication" href="{{ url }}"></a>
        {%- endfor %}
    </div>
{% endif %}{% endraw %}
```

### Bridgy and Bluesky

For Bluesky, enter your full Bluesky account handle in the “Bluesky handle” field at [brid.gy](https://brid.gy/). It will ask for your handle and password, with the option to set up a password just for Bridgy in your [Bluesky settings](https://bsky.app/settings/app-passwords) if you don't want to use your main password. After this, things work similarly to for Mastodon. Add the HTML below to each post (replacing the `href=""` contents with the URL on Bluesky where you shared that post), or use e.g., Eleventy to generate something similar.

```html
<a rel="syndication" class="u-syndication" href="https://bsky.app/profile/reillypascal.bsky.social/post/3lpunq4h42s2p"></a>
```

### Wrapping up Bridgy

It's important for both Mastodon and Bluesky to update website posts with links containing the class `u-syndication`. I usually get at least some Bluesky backfeeding without this, but it seems to be more important for Mastodon.

Thanks for reading! Hopefully this can be of assistance to someone.

[^1]: You can find more information about the complete Webmention\.io API [here](https://github.com/aaronpk/webmention.io#api).

[^2]: I use this server for a ton of things, including a [Jellyfin](https://jellyfin.org/) home streaming server — instructions included [[tv-media-server|here]] — and a copy of [Syncthing](https://syncthing.net/) so my devices are always synced, even if only some are active at any given time. It's very nice, and I'll definitely discuss more about that later!


<!-- https://css-tricks.com/de-mystifying-indieweb-on-a-wordpress-site/ 
- references https://www.miriamsuzanne.com/2022/06/04/indiweb/ - “Am I on the IndieWeb Yet?” -->