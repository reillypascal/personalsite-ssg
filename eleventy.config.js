const feedPlugin = require("@11ty/eleventy-plugin-rss");
let markdownIt = require("markdown-it");
let markdownItFootnote = require("markdown-it-footnote");
// for classes in markdown: https://dev.to/giulia_chiola/add-html-classes-to-11ty-markdown-content-18ic
const markdownItAttrs = require('markdown-it-attrs');
const { DateTime } = require("luxon");
const sanitizeHTML = require("sanitize-html");
// const Webmentions = require("eleventy-plugin-webmentions");

module.exports = async function (eleventyConfig) {
  // passthrough copies
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("google350d63874edcb6ff.html");
  eleventyConfig.addPassthroughCopy("index.js");
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addPassthroughCopy("documents");
  eleventyConfig.addPassthroughCopy("media");
  eleventyConfig.addPassthroughCopy("netlify");
  eleventyConfig.addPassthroughCopy("styles");
  
  // filters
  eleventyConfig.addFilter("sanitizeHTML", (html) => {
    return sanitizeHTML(html, {
      // adds on to full available list
      allowedTags: sanitizeHTML.defaults.allowedTags.concat([ 'audio', 'img', 'source' ]),
      allowedAttributes: {
        a: [ 'class', 'href', 'name', 'target' ],
        audio: [ 'class', 'controls', 'src' ],
        data: [ 'class', 'value' ],
        div: [ 'class' ],
        img: [ 'class', 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ],
        source: ['class', 'src', 'type' ],
        time: [ 'class', 'datetime' ]
      },
      nonBooleanAttributes: [],
    });
  });
  
  eleventyConfig.addFilter("postDate", (dateObj) => {
    // return DateTime.fromJSDate(dateObj).setZone("America/New_York").toISO(DateTime);
    return DateTime.fromJSDate(dateObj).toISO(DateTime);
  });

  eleventyConfig.addFilter("webmentionsByUrl", function(webmentions, url) {
    const allowedTypes = {
      likes: ["like-of"],
      reposts: ["repost-of"],
      comments: ["mention-of", "in-reply-to"],
    };
    
    // const sanitize = (entry) => {
    //   if (entry.content && entry.content.html) {
    //     entry.content = sanitizeHTML(entry.content.html, {
    //       allowedTags: ["b", "i", "em", "strong", "a"],
    //     });
    //   }
    //   return entry;
    // };
  
    const pageWebmentions = webmentions
      .filter(
        (mention) => mention["wm-target"] == url
      )
      .sort((a, b) => new Date(b.published) - new Date(a.published))
      // .map(sanitize);
  
    const likes = pageWebmentions
      .filter((mention) => allowedTypes.likes.includes(mention["wm-property"]))
      .filter((like) => like.author)
      .map((like) => like.author);
  
    const reposts = pageWebmentions
      .filter((mention) => allowedTypes.reposts.includes(mention["wm-property"]))
      .filter((repost) => repost.author)
      .map((repost) => repost.author);
  
    const comments = pageWebmentions
      .filter((mention) => allowedTypes.comments.includes(mention["wm-property"]))
      .filter((comment) => {
        const { author, published, content } = comment;
        return author && author.name && published && content;
      });
    
    const data = { likes, reposts, comments };
    return data;
  });

  // // shortcodes
  // eleventyConfig.addShortcode("liked", (url, title) => {
  //   let display_title = title ? title : url;
  //   return `<blockquote>
  //   <p class="p-summary"> Liked: <a class="u-like-of" 
  //     href="${url}">
  //     ${display_title}</a> </p>
  //     </blockquote>`;
  // });

  // plugins
  // RSS
  eleventyConfig.addPlugin(feedPlugin);

  // markdown-it
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };

  let markdownLib = markdownIt(options).use(markdownItFootnote).use(markdownItAttrs);
  eleventyConfig.setLibrary("md", markdownLib);

  // tags
  eleventyConfig.addCollection("allTags", (collection) => {
    const allCollections = collection.getAll();
    let tagSet = new Set();
    allCollections.forEach((temp) => {
      if ("tags" in temp.data) {
        for (const tag of temp.data.tags) {
          tagSet.add(tag);
        }
      }
    });
    return [...tagSet].sort();
  });

  // input directory
  return {
    dir: {
      input: "pages",
    },
  };
  
  // eleventyConfig.addShortcode("postfooter", (title, url) => {
  //   return `<div class="blogPostAsterism"><p>&#x2042;</p></div>`;
  // });
  // eleventyConfig.addShortcode("postfooter", (title, url) => {
  //   return `<div class="blogPostAsterism"><p>&#x2042;</p></div>
  //   <div class="email-reply">
  //       <a href="mailto:reillypascal@gmail.com?subject=Re: ${title}">Reply via email</a>
  //   </div>
  //   <div class="share-openly">
  //       <a href="https://shareopenly.org/share/?url=${url}">Share on the Fediverse</a>&nbsp;<img class="share-openly-icon" src="/media/share-openly.svg" alt="A looping white arrow" width="20" height="20">
  //   </div>
  //   <div class="post-reactions">
  //       <span class="heart-meta">
  //         Like this post:
  //       </span>
  //       <button id="react-btn">
  //           <span class="heart-react">
  //               <img src="/media/icon-heart-pink.svg" alt="heart icon" width="18" height="18" />
  //           </span>
  //       </button>
  //       <span id="react-ctr"></span>
  //   </div>`;
  // });

  // eleventyConfig.addShortcode("notefooter", (title, url) => {
  //   return `<div class="email-reply">
  //       <a href="mailto:reillypascal@gmail.com?subject=Re: ${title}">Reply via email</a>
  //   </div>`;
  // });

  // eleventyConfig.addShortcode("likedfooter", (title, url) => {
  //   return `<div class="dinkus"><p>***</p></div>
  //   <div class="email-reply">
  //       <a href="mailto:reillypascal@gmail.com?subject=Re: ${title}">Reply via email</a>
  //   </div>
  //   <div class="post-reactions">
  //       <span class="heart-meta">
  //         Like this post:
  //       </span>
  //       <button id="react-btn">
  //           <span class="heart-react">
  //               <img src="/media/icon-heart-pink.svg" alt="heart icon" width="18" height="18" />
  //           </span>
  //       </button>
  //       <span id="react-ctr"></span>
  //   </div>`;
  // });

  // eleventyConfig.addShortcode("list_dingbat", () => {
  //   return `<span class="list-dingbat">&#10147;</span>`;
  // });

  // eleventyConfig.addPlugin(feedPlugin, {
  //   type: "rss",
  //   outputPath: "/blog/feed.xml",
  //   collection: {
  //     name: "post",
  //     limit: 0,
  //   },
  //   metadata: {
  //     language: "en",
  //     title: "Reilly Spitzfaden, Composer",
  //     subtitle:
  //       "A blog about my personal interests, including composition and sound design; audio development using Max/MSP, C++, JUCE, and Rust; and web development on the IndieWeb",
  //     base: "https://reillyspitzfaden.com/blog",
  //     author: {
  //       name: "Reilly Spitzfaden",
  //       email: "reillypascal@gmail.com",
  //     },
  //   },
  // });

  // eleventyConfig.addPlugin(Webmentions, {
  //   domain: "reillyspitzfaden.com",
  //   token: "",
  // });
};
