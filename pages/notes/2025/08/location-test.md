---
title: "Location Test"
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-08-19T14:02:55-0400
location: Rochester, New York
tags:
  - note
  - webdev
  - 11ty
---

Jo has been using [the code I use to get post locations](https://github.com/reillypascal/personalsite-ssg/blob/fcec4c251b343b0e53f9f8d0dd2689f27c9cbf9c/status#L5) for [my /now page statuslog section](/now) to [add locations to her notes](https://dead.garden/notes/). I realized it would be nice to add it to [the script I use to generate note templates](https://github.com/reillypascal/personalsite-ssg/blob/main/note) as well!

While most of my blog posts are written from home and not associated with a place, I have a [number](/notes/2025/07/photoblog-natural-stone-bridge-caves/) of [notes](/notes/2025/07/powder-mills-usgs-gaging-station/) from trips with my partner that aren't just in Rochester.

I like the “vibe” of connecting things on my site to a physical place, so this should be nice to add.

<aside>

For fellow Eleventy users who are interested in more setup information: I don't want to go back and add dates to every note, and since I use the same partial for notes/blog posts/etc. metadata, I have the Eleventy templates for the [post metadata](https://github.com/reillypascal/personalsite-ssg/blob/3fe553d4a95abc48b8698ced35e4426510c84c3f/pages/_includes/partials/post-meta.liquid#L21) and the [notes page](https://github.com/reillypascal/personalsite-ssg/blob/3fe553d4a95abc48b8698ced35e4426510c84c3f/pages/notes.liquid#L40) set up so the location section is only included if there's a “location” tag in the header and that tag has a value.

</aside>
