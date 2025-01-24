const feedPlugin = require("@11ty/eleventy-plugin-rss");
let markdownIt = require("markdown-it");
let markdownItFootnote = require("markdown-it-footnote");

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

  // shortcodes
  eleventyConfig.addShortcode("postfooter", (title, url) => {
    return `<div class="blogPostAsterism"><p>&#x2042;</p></div>`;
  });
  eleventyConfig.addShortcode("postfooter", (title, url) => {
    return `<div class="blogPostAsterism"><p>&#x2042;</p></div>`;
  });
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

  eleventyConfig.addShortcode("notefooter", (title, url) => {
    return `<div class="email-reply">
        <a href="mailto:reillypascal@gmail.com?subject=Re: ${title}">Reply via email</a>
    </div>`;
  });

  eleventyConfig.addShortcode("likedfooter", (title, url) => {
    return `<div class="dinkus"><p>***</p></div>
    <div class="email-reply">
        <a href="mailto:reillypascal@gmail.com?subject=Re: ${title}">Reply via email</a>
    </div>
    <div class="post-reactions">
        <span class="heart-meta">
          Like this post:
        </span>
        <button id="react-btn">
            <span class="heart-react">
                <img src="/media/icon-heart-pink.svg" alt="heart icon" width="18" height="18" />
            </span>
        </button>
        <span id="react-ctr"></span>
    </div>`;
  });

  eleventyConfig.addShortcode("liked", (url, title) => {
    let display_title = title ? title : url;
    return `<div class="h-entry">
      <p class="p-summary"> Liked: <a class="u-like-of" 
      href="${url}">
      ${display_title}</a> </p>
    </div>`;
  });

  eleventyConfig.addShortcode("list_dingbat", () => {
    return `<span class="list-dingbat">&#10147;</span>`;
  });
  // RSS
  eleventyConfig.addPlugin(feedPlugin);
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

  // markdown-it
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };

  let markdownLib = markdownIt(options).use(markdownItFootnote);
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
};
