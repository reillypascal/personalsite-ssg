const feedPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const mdBiblatex = require('@arothuis/markdown-it-biblatex');
// for classes in markdown: https://dev.to/giulia_chiola/add-html-classes-to-11ty-markdown-content-18ic
const markdownItAttrs = require('markdown-it-attrs');
const { DateTime } = require("luxon");
const sanitizeHTML = require("sanitize-html");

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

  // preprocessors
  // https://www.11ty.dev/docs/config-preprocessors/#example-drafts
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});
  
  // filters
  eleventyConfig.addFilter("sanitizeHTML", (html) => {
    return sanitizeHTML(html, {
      // adds on to full available list
      allowedTags: sanitizeHTML.defaults.allowedTags.concat([ 'audio', 'img', 'source' ]),
      allowedAttributes: false, // this means allow all
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

  // plugins: RSS
  eleventyConfig.addPlugin(feedPlugin);

  // plugins: markdown-it
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };

  let markdownLib = markdownIt(options).use(markdownItAttrs).use(markdownItFootnote).use(mdBiblatex, { bibPath: 'documents/bibliography/library.bib', linkToBibliography: true, });
  eleventyConfig.setLibrary("md", markdownLib);

  // plugins: syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight);

  // collections
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

  // collections
  // all posts — so I don't need to exclude other pages from collections.all
  eleventyConfig.addCollection("feedGlobal", function (collectionApi) {
    return collectionApi.getFilteredByTag("post", "note", "interaction");
  });

  eleventyConfig.addGlobalData('generated', () => {
    let now = new Date();
    return new Intl.DateTimeFormat(
      'en-US', { 
        dateStyle: 'long', 
        timeStyle: 'short',
        timeZone: "America/New_York",
      }).format(now);
  });

  // input directory
  return {
    dir: {
      input: "pages",
    },
  };
};
