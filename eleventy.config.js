const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
let markdownIt = require("markdown-it");
let markdownItFootnote = require("markdown-it-footnote");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("index.js");
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addPassthroughCopy("documents");
  eleventyConfig.addPassthroughCopy("media");
  eleventyConfig.addPassthroughCopy("netlify");
  eleventyConfig.addPassthroughCopy("styles");

  eleventyConfig.addShortcode("postfooter", (title, url) => {
    return `<div class="blogPostAsterism"><p>&#x2042;</p></div>
    <div class="email-reply">
        <a href="mailto:reillypascal@gmail.com?subject=Re: ${title}">Reply via email</a>
    </div>
    <div class="share-openly">
        <a href="https://shareopenly.org/share/?url=${url}">Share on the Fediverse</a>&nbsp;<img class="share-openly-icon" src="/media/share-openly.svg">
    </div>
    <div class="post-reactions">
        <span class="heart-meta">
            Post Reactions:
        </span>
        <button id="react-btn">
            <span class="heart-react">
                <img src="/media/icon-heart-pink.svg" alt="heart icon" />
            </span>
        </button>
        <span id="react-ctr"></span>
    </div>`;
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/blog/feed.xml",
    collection: {
      name: "post",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "Reilly Spitzfaden, Composer",
      subtitle:
        "A blog about my personal interests, including C++ audio plugin development, composition/sound design in Max/MSP, open tech, and web development",
      base: "https://reillyspitzfaden.com/blog",
      author: {
        name: "Reilly Spitzfaden",
        email: "reillypascal@gmail.com",
      },
    },
  });

  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };

  let markdownLib = markdownIt(options).use(markdownItFootnote);
  eleventyConfig.setLibrary("md", markdownLib);

  return {
    dir: {
      input: "pages",
    },
  };
};
