const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = process.env;

// create supabase client using url/anon key from Netlify env variables
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

// uses ES modules syntax for default export
exports.handler = async (event, context, callback) => {
	let data;
	try {
		// the result of createClient() can access the database
		data = await supabase
			// 'comments' is the name of the table
			// within my database; .from() selects that
			.from("comments")
			// .insert() takes an array with one or more objects whose keys correspond
			// to those in the table, and adds each object as a new row to the table
			.insert([
				{
					name: JSON.parse(event.body).name,
					email: JSON.parse(event.body).email,
					postURL: JSON.parse(event.body).postURL,
					comment: JSON.parse(event.body).comment,
					created_at: new Date()
						.toISOString()
						.toLocaleString("en-US"),
					show: true,
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

