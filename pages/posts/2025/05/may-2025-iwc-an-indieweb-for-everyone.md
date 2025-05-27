---
title: May 2025 IWC — An IndieWeb for Everyone
description: 
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-24T11:22:40-0400
octothorpes:
  - 
tags:
  - post
  - indieweb
  - webdev
draft: true
indienews: true
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

Chris chose this month's theme of “[small web communities](https://thoughts.uncountable.uk/may-2025-indieweb-carnival-small-web-communities/).” I'm writing about making it easier to become part of a small web community on the IndieWeb: some potential inroads, potential problems, and open questions I have.

## Potential Barriers to Joining the IndieWeb

I love the [IndieWeb](https://indieweb.org/)! I stumbled across this community in mid January 2024, and [Homebrew Website Club](https://indieweb.org/Homebrew_Website_Club), [Front-End Study Hall](https://artlung.com/fresh/), and other IndieWeb events have been a great experience. This community has given me a sense of belonging as a self-taught programmer who doesn't work in programming, and a refuge from platforms' [crumbling into absurd spam factories](https://www.404media.co/facebooks-algorithm-is-boosting-ai-spam-that-links-to-ai-generated-ad-laden-click-farms/). However, there are a few things about the IndieWeb that may narrow the range of people who can or will use it.

Evan [comments](https://darthmall.net/2024/indieweb-is-for-devs/) about the [IndieWeb Key Principles](https://indieweb.org/principles) that many of these are aimed at developers. He notes specifically that 

> On the getting started page there is a [list of IndieWeb services](https://indieweb.org/Getting_Started#IndieWeb_Services). What makes them “IndieWeb services”? Whether or not they implement “IndieWeb features”, apparently.

In other words, the community of people who outwardly associate themselves with the IndieWeb makes frequent use of specific protocols, such as [webmentions](https://indieweb.org/Webmention) and [microformats](https://en.wikipedia.org/wiki/Microformat), [^1] among [many others](https://indieweb.org/Category:building-blocks). 

The core of the IndieWeb is to [have your own website with your own domain](https://indieweb.org/Getting_Started#Get_your_own_site), so at the very least, it is possible to participate without using the protocols above. However, there are still a few issues, first of which is that getting your own website and domain may still present a barrier to some. With this in mind, I want to discuss some of my thoughts around solutions. 

This is all stuff I've been trying to think through for a while, and I still don't feel like I have the answers, but at least I find it productive to think through these things in public. I would be very interested to hear other people's thoughts!

<!-- 2. If a community prefers (for example) to interact using webmentions, being the one who doesn't have them may preclude full participation. -->

## Making the IndieWeb Easier to Join

### On the IndieWeb Without Your Own Website?

First, Tracy Durnell [suggests](https://tracydurnell.com/2024/05/17/indieweb-next-stage/) that 

> we can help people escape the corporate silos even if they don’t want their own website.\[…]

> The more people who use the independent web — whether creating new work, participating in conversations, curating links, or simply reading — the healthier it becomes.

I like the idea of expanding the idea of participating in the IndieWeb beyond just the people who own a website, and including non-site-owning readers. Speaking as someone who maintains my own site on the IndieWeb, I love when I see people interact with my writing on social media sites where I [POSSE](https://www.citationneeded.news/posse/) my posts — no webmentions required. Comment sections on personal sites can be great as well, [^2] and can offer further ways to interact. 

Finally, there's email! I have a `mailto` link at the bottom of every post, and I've had nice experiences sending and receiving emails related to my and others' writing on the IndieWeb. Even outside the practicality of more (and more ubiquitous) ways to talk, I like the personal nature of (non-work) email, and the way it feels kind of like letter-writing. 

### What Makes Coding Intimidating

While I absolutely agree that HTML is a programming language, [^3] I think a lot of people's perception of what programming entails makes putting together a basic webpage seem more intimidating than it actually is, especially with the “[frameworkism](https://infrequently.org/2024/11/if-not-react-then-what/)” and emphasis on JavaScript in many frontend spaces. 

When I first started coding I was unsure of myself and didn't want to put something online that looked “less than” in comparison to other people's sites. In addition to the obvious hurdle of coding at all, I imagine the complexity of the websites most people see on a daily basis unnecessarily skews the perception of what *needs* to be done to make a website. Even if someone knows they *can* make a simple site, the lack of such sites creates an unfair comparison for people's first projects. [^4]

Now that I've had the time and experience to form more thought-out opinions on programming and the web, I look at sites like [motherfuckingwebsite.com](https://motherfuckingwebsite.com) and [bettermotherfuckingwebsite.com](http://bettermotherfuckingwebsite.com/), or [this post](https://lmnt.me/blog/how-to-make-a-damn-website.html) with appreciation for their minimalism and focus on content. A site really doesn't have to look like much! As I [wrote about here](/posts/2024/12/hypertext-memex-collaboration-socialization/), the magical thing about the web is hypertext itself: the way hyperlinks connect ideas and create something far bigger than any one person's ideas or writing.

### Simple Is More Than Enough

I like the idea of emphasizing that simple is plenty, and welcoming those who want to keep it simple. I want to see more widespread emphasis that this is plenty to make a website:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf8">
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		<title>Title</title>

		<!-- style taken from bettermotherfuckingwebsite.com -->
		<style type="text/css">
			body {
				margin: 40px auto;
				max-width: 650px;
				line-height: 1.6;
				font-size: 18px;
				color: #444;
				padding: 0 10px;
			}
			h1, h2, h3 {
				line-height: 1.2;
			}
		</style>
	</head>
	<body>
		<!-- everything in the <body> section can be replaced as you wish -->
		<h1>Reilly Spitzfaden</h1>

		<p>Hi, I'm Reilly Spitzfaden! I'm a composer and programmer who likes noise, obsolete media, electronics, and nostalgia.</p>

		<h2>Blog</h2>

		<ul>
			<li><a href="/blog-post-2.html">Blog Post #2</a></li>
			<li><a href="/blog-post-1.html">Blog Post #1</a></li>
		</ul>

		<a href="mailto:reillypascal@gmail.com">Contact me!</a>
	</body>
</html>
```

Type that in Notepad (Win) or TextEdit (Mac), save it as `index.html`, and it's a perfectly good, practical homepage! It's readable, it's responsive, and it's much simpler than I thought things needed to be when I started out. In terms of resources, Blake Watson's [HTML for People](https://htmlforpeople.com/) set of tutorials is a great one for making a simple HTML site.

Of course, I should acknowledge that even this requires at least *some* degree of both technical know-how and comfort with searching/willingness to search for technical answers online. [^5]

## HTML as a Web User Skill



<https://tante.cc/2025/05/23/on-vibe-coding/>
> Empowerment has something to do with giving people objects of a certain quality, objects that are not opaque to understanding and reasoning. Objects one can make one’s own to a certain degree. There needs to be at least a reasonable path towards that.
> \[…]
> And there is a lot of [epistemic injustice](https://tante.cc/2024/01/03/is-a-neural-network-like-a-pocket-calculator-ai-and-epistemic-injustice/) here: We are forcing certain groups into a situation where they basically have no chance to understand the systems affecting them even if they “made them themselves”. Again locking out people from opportunities to grow as individuals or as people contributing to a community.


https://tracydurnell.com/2025/01/09/sanding-off-friction-from-indie-web-connection/

https://keningzhu.com/journal/contact-me-ripple


[^1]: I have a [collection of tutorials](https://reillyspitzfaden.com/wiki/tutorials/webmention-tutorial/) on webmentions and microformats in my personal wiki, including simple ways to get started that require minimal coding.

[^2]: I [made a basic comment section](/posts/2024/01/do-read-the-comments/) on my site back when I started, although I currently have it commented out in the site code since I had only gottem spam for about a year. If people expressed an interest, I would certainly be open to putting it up again, though — I like the idea of people being able to interact regardless of if they have a site or not.

[^3]: I definitely saw a Fediverse post by [vkc.sh](https://vkc.sh/) making this argument, but unfortunately it seems to be deleted. I remember the “reply guys” were contentious about it the claim, so that's likely why. At any rate, her argument was something to the effect of this: HTML instructs computers what to do, therefore it's a programming language. It may be a domain-specific one, but it's definitely a programming language and deserves to be valued as such.

[^4]: My HTML looks kind of messy without the CSS on it, and I'm definitely interested in doing some cleanup so I can do things like participate in [CSS Naked Day](https://css-naked-day.org/) and model how things don't need to be complicated or fancy.

[^5]: I'm always reminded of the evergreen [XKCD #2501](https://xkcd.com/2501/)