// Fetch webmentions from webmention.io API
const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async () => {
	const url = `https://webmention.io/api/mentions.jf2?token=${process.env.WEBMENTION_IO_TOKEN}&per-page=1000`;
	const webmentions = await EleventyFetch(url, {
		duration: "0s",
		type: "json",
	});
	return {
		mentions: webmentions.children,
	};
	// return EleventyFetch(url, {
	// 	duration: "0s",
	// 	type: "json",
	// }).then((webmentions) => {
	// 	return {
	// 		mentions: webmentions.children,
	// 	}
	// });
};