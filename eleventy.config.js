const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("index.js");
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addPassthroughCopy("documents");
  eleventyConfig.addPassthroughCopy("media");
  eleventyConfig.addPassthroughCopy("netlify");
  eleventyConfig.addPassthroughCopy("styles");

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

  return {
    dir: {
      input: "pages",
    },
  };
};
