const {
    DATABASE_URL,
    SUPABASE_SERVICE_API_KEY
} = process.env;

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
    let returnVals
    try {
        returnVals = await supabase
        // as in set_comments, retrieves 'comments' table
        .from('comments')
        // selects the desired columns in each row
        .select('name, email, comment, created_at')
        // selects only the rows containing comments 
        // made at the blog post's URL
        .eq('postURL', JSON.parse(event.body).postURL)
        
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
              error: e.message
            })
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(returnVals.data)
    };
}