const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = process.env;

// create supabase client using url/anon key from Netlify env variables
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

// uses ES modules syntax for default export
exports.handler = async (event, context, callback) => {
	let data;
	try {
		// the result of createClient() can access the database
		data = await supabase.from("reactions").insert([
			{
				heart: 1,
				postURL: JSON.parse(event.body).postURL,
			},
		]);
	} catch (e) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: e.message,
			}),
		};
	}
	return {
		statusCode: 200,
		body: JSON.stringify(data),
	};
};

