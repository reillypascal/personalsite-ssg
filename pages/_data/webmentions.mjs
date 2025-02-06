// Fetch webmentions from webmention.io API
import EleventyFetch from "@11ty/eleventy-fetch";

export default async function () {
	const url = `https://webmention.io/api/mentions.jf2?token=${process.env.WEBMENTION_IO_TOKEN}&per-page=1000`;
	try {
		const webmentions = await EleventyFetch(url, {
			duration: "1h",
			type: "json",
		});
		return {
			mentions: webmentions.children,
		};
	} catch (e) {
		console.log(e);
		return {
			mentions: [ "none" ]
		};
	}
};