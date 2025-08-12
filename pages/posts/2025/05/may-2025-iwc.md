---
title: "May 2025 IWC—More Easily Joining Small Web Communities"
description: For this month's IndieWeb carnival on “small web communities,” I'm thinking about lowering the barrier for web independence and freedom
fedi_url:
  - https://hachyderm.io/@reillypascal/114587984441132800
  - https://bsky.app/profile/reillypascal.bsky.social/post/3lqbdbn66322l
date: 2025-05-28T19:06:00-0400
tags:
  - post
  - indieweb
  - indieweb-carnival
  - webdev
  - tech-philosophy
indienews: true
---

Chris chose this month's theme of “[small web communities](https://thoughts.uncountable.uk/may-2025-indieweb-carnival-small-web-communities/).” I'm writing about making it easier to become part of a small web community on the IndieWeb: some potential inroads, potential problems, and open questions I have.

UPDATE: if you're interested in making your own site, [Coyote has a helpful guide here](https://osteophage.neocities.org/essays/you-can-make-a-website)—please check it out!

## Barriers to Joining the IndieWeb

Max Böck (writing back in 2022) [succinctly captures](https://mxb.dev/blog/the-indieweb-for-everyone/) an issue that's been on my mind lately, observing that 

> Generally speaking: The more independence a technology gives you, the higher its barrier for adoption.

I love the experience I have on the IndieWeb, using technologies like webmentions and microformats [^1] to interact with others in a way that's open and modular. I like the IndieWeb principle of “[small pieces loosely joined](https://indieweb.org/principles),” and how that allows me to replace any one piece of my IndieWeb infrastructure should what I'm using “enshittify.”

I want to make this independence more accessible—to ease some of the issue Max Böck mentions—but how? I'll use this post to think through some possibilities I've been mulling over (addressing a range of potential levels of tech experience), and I would be very interested to hear other people's thoughts and input on these possibilities!

## Ways Around These Barriers

### On the IndieWeb Without Your Own Website?

First, Tracy Durnell [suggests](https://tracydurnell.com/2024/05/17/indieweb-next-stage/) that 

> we can help people escape the corporate silos even if they don’t want their own website. \[…]

> The more people who use the independent web—whether creating new work, participating in conversations, curating links, or simply reading—the healthier it becomes.

I like the idea of expanding participation in the IndieWeb beyond just the people who own a website, and including non-site-owning readers. Speaking as someone who maintains my own site on the IndieWeb, I love when I see people interact with my writing on social media sites where I [POSSE](https://www.citationneeded.news/posse/) my posts—no webmentions required. 

Comment sections on personal sites can be great as well, [^2] and can offer further ways to interact. Alex (someone who does have webmentions on their site) [writes about](https://alexsirac.com/webmentions-make-me-sad/) preferring when blogs *also* have a comment section, noting that

> I’m just sometimes tired of high quality stuff, you know? Sometimes, all I want is to comment on someone’s post to say « lol » or « nice thanks for sharing » or « saaame! » and that’s not something that warrants a whole blog post and entry in my RSS feed.

Finally, there's email. I have a `mailto` link at the bottom of every post, and I've had nice experiences sending and receiving emails related to my and others' writing on the IndieWeb. Even outside the practicality of more (and more ubiquitous) ways to talk, I like the personal nature of (non-work) email, and the way it feels kind of like letter-writing. 

### Website Ownership for the Non-Developer

<aside>

In [the link I shared above](https://tracydurnell.com/2024/05/17/indieweb-next-stage/), Tracy also wants to see

> advocating for adoption of IndieWeb tech by platforms like Tumblr, WordPress, Ghost, and Buttondown, versus targeting individuals, so everyone who uses these tools can be brought in without having to do work on their own

I think that makes a lot of sense, and is an important part of the process of welcoming people onto the IndieWeb (and the small-i independent web more broadly). While my discussion here is more narrowly focused on ways to help people get their own websites *without* these services, I just wanted to include this note beforehand to contextualize my own thoughts.

</aside>

OK so someone wants to have a personal website, but doesn't know much/anything about programming. What then? Böck [mentions](https://mxb.dev/blog/the-indieweb-for-everyone/#lowering-the-barrier) Mastodon, Ghost, Tumblr, and micro\.blog as contributing to lowering the barrier of owning one's own content, and those certainly are decent options.

Even with the more blog-like Ghost and micro\.blog, as well as similar things like [Bear](https://bearblog.dev/), my biggest issues are 1\) the editor is coupled to the backend, and 2\) the data formats for your pages are less standardized than I would like. To expand on point 1, the tool for creating pages and posts is accessible via a web interface owned by the same people running the hosting servers. For point 2, I would prefer a generic format that has stood the test of time, such as Markdown.

My stance on both of these issues is because at this point, I use technology with the assumption that any tool or platform *will* [enshittify](https://en.wikipedia.org/wiki/Enshittification), and I will have to be able to migrate to something else. I see my strategy here as fitting with the IndieWeb approach of “[small pieces loosely joined](https://indieweb.org/principles)”; I strive to make my workflow “modular,” with individual parts as generic and replaceable as possible.

For example, I use [Obsidian](https://obsidian.md/) for maintaining a personal wiki: Markdown documents, extended with [wiki-style link syntax](https://en.wikipedia.org/wiki/Help:Link#Wikilinks_(internal_links)) to link between notes. However, I make sure not to use plugins or features that would narrow compatibility of my documents, and I ensure that my notebook is compatible with e.g., [Vimwiki](https://vimwiki.github.io/), [Zettlr](https://www.zettlr.com/), the [Foam plugin](https://foambubble.github.io/foam/), etc., so I can switch anytime Obsidian does something I don't like.

In my ideal no- or low-code web publishing tool, authors could use a program on the desktop that takes in a common format (such as Markdown) so that all pages can easily be moved to another CMS/static site generator (SSG). Since the program is not bound to any given hosting service, authors could put the resulting generated HTML on any service; Netlify, Neocities, GitHub Pages, and others are currently decent options, but with this setup, could easily be replaced.

#### Existing Low- & No-Code Options

One tool that I find to be a promising (but still imperfect) idea is [Publii](https://getpublii.com/). It's an open-source (GPL-3.0) CMS/SSG that runs as a GUI desktop app. You can use a WYSIWYG, block, or Markdown editor to write pages and posts; create menus, add page tags, add CSS, and many other things; and then generate your site, outputting a folder of static HTML/CSS/JS files that can then be put on a server.

I like that this program is a standalone desktop app that can work with any server, and that it's easy to use. What I don't like:

- It doesn't seem to store posts and pages as (e.g.) plain Markdown files that could easily be moved to another similar tool. 
  - It might be possible to get it to do this, but I wasn't able to figure it out; it doesn't seem to do it by default; and it certainly doesn't point the user toward this kind of workflow.
- Design is not very flexible. You can choose from a limited selection of free themes, with paid options, but even the paid options are monolithic, and you can't combine, say, a block layout skeleton with a layout-independent color/font/icon theme.

One idea this gives me, though, is a GUI SSG with Markdown files as input (and maybe with modular layout features), and with community extensibility. I use [Eleventy](https://www.11ty.dev/) and enjoy it very much. However, requiring the use of the terminal seems to be a big barrier (whether real or psychological) to use by non-developers. 

Since writing/note-taking tools that use Markdown (such as Obsidian or [iA Writer](https://ia.net/writer)) seem to be decently usable and liked by non-developers, I could imagine a GUI wrapper around something like Eleventy/Hugo/Jekyll being helpful. Authors could take a folder of Markdown files (perhaps written using one of the aforementioned writing/note-taking tools) and turn them into a website, with the generator handling all code beyond the Markdown itself.

It might even be feasible to make a GUI wrapper that's compatible with multiple SSGs: choose from a menu whether you want to use Eleventy, Hugo, Jekyll, Astro, or another popular option. Because the terminal commands to install and use those are relatively straightforward, the GUI wrapper handles installation and running the SSG for users who might be intimidated by the terminal.

Inspired by Publii's model of themes, I could also imagine a system of modular community HTML templates and CSS themes. Perhaps one set of modules handles a CSS [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)-based block layout, with just the CSS and the HTML`<div>`s/classes necessary to do so, and another handles the styling for colors, fonts, icons, etc. It could be an interesting engineering challenge to integrate something like this with e.g., Eleventy's [partials](https://learn-eleventy.pages.dev/lesson/6/) and/or [shortcodes](https://www.11ty.dev/docs/shortcodes/) systems, or similar parts of another SSG.

I haven't attempted any of this, so let me know if there's a roadblock I'm not considering, but I figure that integrating with one or more popular SSGs could further the goal of modularity and flexibility, and make the GUI wrapper easier to create and maintain.

### What Makes Coding Intimidating

I have some changes I would like to see in the perception of what a website entails to make things less intimidating if someone *does* want to get their hands dirty with coding. I think a lot of people's perception of what programming entails makes putting together a basic webpage seem more intimidating than it actually is, especially with the “[frameworkism](https://infrequently.org/2024/11/if-not-react-then-what/)” and emphasis on JavaScript in many frontend spaces. In addition to the obvious hurdle of coding at all, I imagine the complexity of the websites most people see on a daily basis unnecessarily skews the perception of what *needs* to be done to make a website. 

Even if someone knows they *can* make a simple site, the lack of such sites creates an unfair comparison for people's first projects. [^3] When I first started coding I was unsure of myself and didn't want to put something online that looked “less than” in comparison to other people's sites. Now that I've had the time and experience to form more thought-out opinions on programming and the web, I look at sites like [motherfuckingwebsite.com](https://motherfuckingwebsite.com) and [bettermotherfuckingwebsite.com](http://bettermotherfuckingwebsite.com/) with appreciation for their minimalism and focus on content.

I want to see more widespread emphasis that what these sites do is plenty, and that there's nothing shameful or “less than” about putting that online. [^4] As I [wrote about here](/posts/2024/12/hypertext-memex-collaboration-socialization/), the magical thing about the web is hypertext itself: the way hyperlinks connect ideas and create something far bigger than any one person's ideas or writing.

Additionally, I want to emphasize to those potentially interested in the IndieWeb that webmentions/microformats/etc. are nice but by no means essential. As I mentioned [above](#on-the-indieweb-without-your-own-website%3F), a simple `mailto` link on each post—especially combined with POSSE-ing posts—is a fairly decentralized and open way to socialize on the IndieWeb without much technical overhead. 

Of course, I should acknowledge that even this requires at least *some* degree of both technical know-how and comfort with searching/willingness to search for technical answers online. [^5] Additionally, if only some IndieWeb community members have access to webmentions/etc., while others “only” have email links, I worry that less-technical community members won't be able to feel like full participants. I don't have an answer to this—again, it's that inverse relationship between independence and barrier to entry—but I'm continuing to think about it.

## Wrapping Up

This was the first post on this blog for which I made an outline, and I even re-wrote the outline multiple times! This was because I apparently have a huge list of thoughts on this inverse relationship between independence/barrier to adoption, and many of them didn't make it into today's post (in the interest of brevity and clarity). 

I plan to continue writing on this topic, and as I continue to think through all this, I welcome input from others with whom any of it resonates. Until next time!

[^1]: I have a [collection of tutorials](https://reillyspitzfaden.com/wiki/tutorials/webmention-tutorial/) on webmentions and microformats in my personal wiki, including simple ways to get started that require minimal coding.

[^2]: I [made a basic comment section](/posts/2024/01/do-read-the-comments/) on my site back when I started. I've disabled it from time to time—I've mostly gotten spam—but I recently re-enabled it in the spirit of what I'm discussing here.

[^3]: My HTML looks kind of messy without the CSS on it, and I'm definitely interested in doing some cleanup so I can do things like participate in [CSS Naked Day](https://css-naked-day.org/) and model how things don't need to be complicated or fancy. I might also do something like [Sophie Koonin](https://localghost.dev/) has, with multiple stylesheet options for the user (try clicking on the one with the lowercase “a” in the upper right of the site).

[^4]: Blake Watson's [HTML for People](https://htmlforpeople.com/) set of tutorials is a great example of materials in this vein.

[^5]: I'm always reminded of the evergreen [XKCD #2501](https://xkcd.com/2501/)
