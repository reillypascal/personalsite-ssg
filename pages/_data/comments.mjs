const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = process.env;

import { createClient } from "@supabase/supabase-js";

export default async function () {
	// needed so eleventy doesn't fail when there's no key/url for supabase
	if (DATABASE_URL && SUPABASE_SERVICE_API_KEY) {
		const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);
		try {
			const returnVals = await supabase
				// as in set_comments, retrieves 'comments' table
				.from("comments")
				// selects the desired columns in each row
				.select("name, email, postURL, comment, created_at, show");
			return {
				list: returnVals.data,
			};
		} catch (e) {
			return {
				list: ["none"],
			};
		}
	} else {
		return {
			list: ["none"],
		};
	}
}

