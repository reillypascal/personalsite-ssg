import { createMathjaxInstance, mathjax } from "@mdit/plugin-mathjax";
import { DateTime } from "luxon";
// needed for e.g., dateToRfc822 filter
import feedPlugin from "@11ty/eleventy-plugin-rss";
// import interlinker from "@photogabble/eleventy-plugin-interlinker";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";
import markdownItFootnote from "markdown-it-footnote";
import pluginTOC from "@uncenter/eleventy-plugin-toc";
import sanitizeHTML from "sanitize-html";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
// import markdownItGitHubAlerts from 'markdown-it-github-alerts';
// import { katex } from "@mdit/plugin-katex";
// import mdBiblatex from '@arothuis/markdown-it-biblatex';
// import mdItObsidianCallouts from 'markdown-it-obsidian-callouts';
// import cheerio from "cheerio";

export default async function (eleventyConfig) {
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
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	// filters
	// https://github.com/11ty/eleventy/issues/637
	eleventyConfig.addFilter("categoryValue", (collection, category, value) => {
		if (!category) return collection;
		const filtered = collection.filter((item) => item.data[category] == value);
		return filtered;
	});

	// https://11ty.rocks/eleventyjs/content/#excerpt-filter
	eleventyConfig.addFilter("excerpt", (post) => {
		const content = post.replace(/(<([^>]+)>)/gi, "");
		return content.substr(0, content.lastIndexOf(" ", 200)) + "…";
	});

	eleventyConfig.addFilter("sanitizeHTML", (html) => {
		return sanitizeHTML(html, {
			// adds on to full available list
			allowedTags: sanitizeHTML.defaults.allowedTags.concat([
				"audio",
				"img",
				"source",
				"details",
				"summary",
				// MathML
				"math",
				"semantics",
				"annotation",
				"mrow",
				"mtable",
				"mtr",
				"mtd",
				"mfrac",
				"msqrt",
				"msup",
				"msub",
				"mi",
				"mn",
				"mo",
				// MathJax
				"mjx-container",
				"mjx-assistive-mml",
				"mjx-math",
				"mjx-eqn",
				"mjx-mi",
				"mjx-mo",
				"mjx-c",
				"mjx-msub",
				"mjx-msup",
				"mjx-script",
				"mjx-texatom",
			]),
			allowedAttributes: false, // this means allow all
			nonBooleanAttributes: [],
			// these two allow for discarding tag contents; must manually include default values
			// nonTextTags: [ 'style', 'script', 'textarea', 'option', 'noscript', 'math', 'semantics', 'mrow', 'mi', 'mo', 'annotation' ],
			// disallowedTagsMode: 'completelyDiscard',
		});
	});

	eleventyConfig.addFilter("postDate", (dateObj) => {
		// return DateTime.fromJSDate(dateObj).setZone("America/New_York").toISO(DateTime);
		return DateTime.fromJSDate(dateObj).toISO(DateTime);
	});

	// was webmentionsByUrl
	eleventyConfig.addFilter("fediWebmentions", function (webmentions, url) {
		const allowedTypes = {
			likes: ["like-of"],
			reposts: ["repost-of"],
			comments: ["mention-of", "in-reply-to"],
		};

		const pageWebmentions = webmentions
			// .filter((mention) => mention["wm-target"] == url)
			.filter((mention) => {
				if (mention["wm-target"]) {
					let cleanedUrl = new URL(mention["wm-target"]);
					cleanedUrl.search = "";
					cleanedUrl.hash = "";
					return cleanedUrl.href == url;
				} else {
					return false;
				}
			})
			.filter(
				(mention) =>
					mention["wm-source"].includes("https://brid.gy/") ||
					mention["wm-source"].includes("https://bsky.brid.gy/"),
			)
			.sort((a, b) => new Date(b.published) - new Date(a.published));

		const likes = pageWebmentions
			.filter((mention) => allowedTypes.likes.includes(mention["wm-property"]))
			.filter((like) => like.author)
			.map((like) => like.author);

		const reposts = pageWebmentions
			.filter((mention) =>
				allowedTypes.reposts.includes(mention["wm-property"]),
			)
			.filter((repost) => repost.author)
			.map((repost) => repost.author);

		const comments = pageWebmentions
			.filter((mention) =>
				allowedTypes.comments.includes(mention["wm-property"]),
			)
			.filter((comment) => {
				const { author, published, content } = comment;
				return author && author.name && published && content;
			});

		const data = { comments, reposts, likes };
		return data;
	});

	eleventyConfig.addFilter("webWebmentions", function (webmentions, url) {
		const sanitize = (entry) => {
			if (entry.content && entry.content.html) {
				entry.content.html = sanitizeHTML(entry.content.html, {
					allowedTags: ["b", "i", "em", "strong", "a"],
					allowedAttributes: {},
				});
			}
			return entry;
		};

		const pageWebmentions = webmentions
			// .filter((mention) => mention["wm-target"] == url)
			.filter((mention) => {
				if (mention["wm-target"]) {
					let cleanedUrl = new URL(mention["wm-target"]);
					cleanedUrl.search = "";
					cleanedUrl.hash = "";
					return cleanedUrl.href == url;
				} else {
					return false;
				}
			})
			.filter((mention) => !mention["wm-source"].includes("https://brid.gy/"))
			.filter(
				(mention) => !mention["wm-source"].includes("https://bsky.brid.gy/"),
			)
			.sort((a, b) => new Date(b.published) - new Date(a.published))
			.map(sanitize);

		return pageWebmentions;
	});

	eleventyConfig.addFilter("pageComments", (comments, url) => {
		const pageComments = comments
			.filter((comment) => comment.postURL == url)
			.filter((comment) => comment.show);

		return pageComments;
	});

	// eleventyConfig.addFilter("formatDateRfc822", (dateStr, formatStr = "EEE, dd MMM yyyy HH:mm:ss ZZZZ") => {
	//   // requires post.data.date, not post.date
	//   return DateTime.fromISO(dateStr).toFormat(formatStr);
	// });

	// eleventyConfig.addFilter("allWebmentionsByUrl", function(webmentions, url) {
	//   const sanitize = (entry) => {
	//     if (entry.content && entry.content.html) {
	//       entry.content.html = sanitizeHTML(entry.content.html, {
	//         allowedTags: ["b", "i", "em", "strong", "a"],
	//       });
	//     }
	//     return entry;
	//   };

	//   const pageWebmentions = webmentions
	//     .filter((mention) => mention["wm-target"] == url)
	//     .sort((a, b) => new Date(b.published) - new Date(a.published))
	//     .map(sanitize);

	//   return pageWebmentions;
	// });

	// eleventyConfig.addFilter("tableOfContents", function(content) {
	//   // const headerTags = ["h3","h4","h5","h6"];
	//   const $ = cheerio.load(content);
	//   const tocList = $('h3').map((idx, element) => {
	//     let text = $(element).text();
	//     // return `<li><a href="#${slugify(text)}">${text}</a></li>`
	//     return `<li><a href="#${$(element).attr('id')}">${text}</a></li>`
	//   }).toArray();

	//   let tocParent = cheerio.load(`<nav class="table-of-contents" aria-label="table-of-contents"><details><summary>Table of Contents</summary><ul></ul></details></nav>`);

	//   tocParent('ul').append(tocList);

	//   return tocParent.html();
	// })

	// plugins: RSS
	eleventyConfig.addPlugin(feedPlugin);

	// plugins: markdown-it
	let options = {
		html: true,
		breaks: true,
		linkify: false,
	};

	const mathjaxInstance = createMathjaxInstance({ output: "chtml" });

	let markdownLib = markdownIt(options)
		.use(markdownItAnchor, { tabIndex: false })
		.use(markdownItAttrs)
		.use(markdownItFootnote)
		.use(mathjax, mathjaxInstance);
	// .disable(["entity"]) // allows entities through, but converts "&" to "&amp;"
	// .use(markdownItGitHubAlerts, { markers: '*' })
	// .use(katex);
	// .use(mdItObsidianCallouts);
	// .use(mdBiblatex, { bibPath: 'documents/bibliography/library.bib', linkToBibliography: true, });
	eleventyConfig.setLibrary("md", markdownLib);

	// plugins: syntax highlighting
	eleventyConfig.addPlugin(syntaxHighlight);

	// const { IdAttributePlugin } = await import("@11ty/eleventy");

	// eleventyConfig.addPlugin(IdAttributePlugin, {
	//   selector: "h2,h3,h4,h5,h6",
	// });

	// eleventyConfig.addPlugin(interlinker);

	eleventyConfig.addPlugin(pluginTOC, {
		tags: ["h2", "h3", "h4", "h5", "h6"], // tags (heading levels) to include
		ignoredHeadings: ["[data-toc-exclude]"], // headings to ignore (list of selectors)
		ignoredElements: [], // elements (within the headings) to ignore when generating the TOC (list of selectors)
		ul: true, // whether to a use a `ul` or `ol`
		wrapper: function (toc) {
			// wrapper around the generated TOC
			return `<nav class="table-of-contents">
        <details>
        <summary>Table of Contents</summary>
        ${toc}
        </details>
        </nav>`;
		},
	});

	// collections
	// tags
	eleventyConfig.addCollection("allTags", (collection) => {
		const allCollections = collection.getAll();
		// Set() — ES6 feature with only one occurrence of each item
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

	// all posts — so I don't need to exclude other pages from collections.all
	eleventyConfig.addCollection("feedGlobal", function (collectionApi) {
		const posts = collectionApi.getFilteredByTag("post");
		const notes = collectionApi.getFilteredByTag("note");
		const interactions = collectionApi.getFilteredByTag("interaction");
		const rssonly = collectionApi.getFilteredByTag("rssonly");
		return posts
			.concat(notes)
			.concat(interactions)
			.concat(rssonly)
			.sort(function (a, b) {
				return a.date - b.date;
			});
	});

	eleventyConfig.addCollection("wikiFavorites", function (collectionApi) {
		return collectionApi.getFilteredByTags("favorites", "wiki");
	});

	eleventyConfig.addCollection("wikiNotebook", function (collectionApi) {
		return collectionApi.getFilteredByTags("notebook", "wiki");
	});

	eleventyConfig.addCollection("wikiReading", function (collectionApi) {
		return collectionApi.getFilteredByTags("reading", "wiki");
	});

	eleventyConfig.addCollection("wikiTutorials", function (collectionApi) {
		return collectionApi.getFilteredByTags("tutorial", "wiki");
	});

	// eleventyConfig.addGlobalData('generated', () => {
	//   let now = new Date();
	//   return new Intl.DateTimeFormat(
	//     'en-US', {
	//       dateStyle: 'long',
	//       timeStyle: 'short',
	//       timeZone: "America/New_York",
	//     }).format(now);
	// });

	// input directory
	return {
		dir: {
			input: "pages",
		},
	};
}

// https://dev.to/bybydev/how-to-slugify-a-string-in-javascript-4o9n
// function slugify(str) {
//   str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
//   str = str.toLowerCase(); // convert string to lowercase
//   str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
//            .replace(/\s+/g, '-') // replace spaces with hyphens
//            .replace(/-+/g, '-'); // remove consecutive hyphens
//   return str;
// }
