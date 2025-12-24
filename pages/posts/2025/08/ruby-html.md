---
title: "ルビとHTML"
description: I took a few years of Japanese classes in undergrad, and today I'm returning to that and discussing some HTML markup for Japanese and other East Asian languages.
fedi_url:
  - https://hachyderm.io/@reillypascal/115057508341765435
  - https://bsky.app/profile/reillypascal.bsky.social/post/3lwrtoi5sus2f
date: 2025-08-19T17:14:00-0400
location:
tags:
  - post
  - webdev
  - language
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

<ruby>最近<rp>(</rp><rt>さいきん</rt><rp>)</rp></ruby>HTMLでルビを<ruby>振<rp>(</rp><rt>ふ</rt><rp>)</rp></ruby>ることのやり<ruby>方<rp>(</rp><rt>かた</rt><rp>)</rp></ruby>を<ruby>知<rp>(</rp><rt>し</rt><rp>)</rp></ruby>た!

Or in English, “I recently learned how to write [ruby characters](https://en.wikipedia.org/wiki/Ruby_character) in HTML!”

Japanese writing uses multiple different sets of characters. Chinese [ideographic](https://en.wikipedia.org/wiki/Ideogram) characters (called “[kanji](https://en.wikipedia.org/wiki/Kanji)”) encode an idea rather than a sound and can have multiple pronunciations. [Kana](https://en.wikipedia.org/wiki/Kana) are phonetic characters that each represent one syllable.

Ruby characters are kana placed above kanji to indicate the pronunciation — these are common in educational materials, children's/YA books, or for kanji outside the list of [jōyō (“regular-use”) kanji](https://en.wikipedia.org/wiki/J%C5%8Dy%C5%8D_kanji), among other uses. Because there are many more kanji than kana, and their pronunciation can be complicated to learn, the ruby characters make reading easier.

I took some Japanese classes in undergrad, and while I haven't kept up with it, I recently stumbled across the [HTML markup](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-ruby-element) for ruby and thought it was a cool thing to know. The markup for the first word from the above example, “saikin” (“recently”) is shown below. The whole thing is enclosed in `<ruby>` tags; the `<rp>` tag surrounds parentheses for the pronunciation; and `<rt>` surrounds the phonetic gloss. This gives a fallback of placing the pronunciation in parentheses after the kanji — i.e., as 最近 (さいきん) — if a browser doesn't support rendering ruby characters, while allowing the parentheses to be hidden and the phonetic gloss placed above on browsers that do support this.

```html
<ruby>最近<rp>(</rp><rt>さいきん</rt><rp>)</rp></ruby>
```

This all has gotten me a bit nostalgic for learning Japanese, and I think I'll try tracking down my old textbooks. Because I love typography and web standards in general, it would also give me more typographic practices to try out on my blog — depending on how returning to Japanese goes, it would be cool to try writing some posts in Japanese.

This also might give me the chance to get internet feedback on my Japanese. One of the reasons I never stuck with it is that even when I was decent at it, I had a lot of anxiety seeking out conversation partners with whom to practice. Writing online doesn't feel as intense though, so that could be a good way to get feedback. We'll see how it goes!
