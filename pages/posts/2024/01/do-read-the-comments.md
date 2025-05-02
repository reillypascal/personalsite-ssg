---
title: Do Read the Comments
description: A writeup of using Netlify serverless functions and Supabase to code a comments section on a static site
canonical_url: https://reillyspitzfaden.com/posts/2024/01/do-read-the-comments/
date: 2024-01-14
tags: ["post", "webdev", "programming" ]
---

<!-- Code highlighting CSS -->
<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

My blog now has a comment section! Let's talk about how I made it.

It uses the [Supabase](https://supabase.com/) Postgres database, which bills itself as an "open-source Firebase alternative." There are a number of ways of communicating with the database. I chose the [supabase-js](https://github.com/supabase/supabase-js) JavaScript client since I'm familiar with JS, and because I wanted to use Netlify's ["serverless" function](https://www.netlify.com/blog/intro-to-serverless-functions/) capabilities to run the code that communicates with the database.

I considered several ways of getting the comments to display, including embedding a server-side-rendered page in an \<iframe\>, and using the pre-made "[SupaComments](https://jsrepos.com/repo/a-blazing-fast-lightweight-and-open-source-comment-system-for-your-static-website-blogs-powered-by-supabase)" library, but it actually turned out to be easier to just do it myself with vanilla JavaScript. For the full code, see the [Netlify functions](https://github.com/reillypascal/personalsite/tree/main/reillyspitzfaden/netlify/functions), [global JS file](https://github.com/reillypascal/personalsite/blob/main/reillyspitzfaden/styles/scripts.js), and the [blog posts'](https://github.com/reillypascal/personalsite/tree/main/reillyspitzfaden/blog) HTML files on GitHub. I'll walk through some of the most relevant parts here.

### Handling Comment Submissions

In the form submission handler function, I make the form data into a FormData object. I then retrieve the commenter's name, email, and comment, as well as the URL of the blog post on which they're commenting. Note that in the code examples, I have left out the DOM-manipulating code to focus on handling the comment data.

``` js
// (from scripts.js)
// submit conmment handler - thisPostURL variable is 
// defined in the page that calls this function
const handleSubmitComment = async (event) => {
    event.preventDefault();

    // ... reset "Comment submitted!" message, if one exists

    // get form data
    const myForm = event.target;
    const formData = new FormData(myForm);
    // retrieve the needed fields from the FormData object
    const formObject = {
        name: formData.get("name"),
        email: formData.get("email"),
        postURL: thisPostURL,
        comment: formData.get("comment")
    };
    // ...
```

Since I didn't want the extra work of making a new table in my database every time I made a new blog post, I have all the comments go to a single table. Each blog post tags the comments on it with the post's URL, and uses that URL to retrieve only the appropriate comments.

After the comment is formatted into an object, I use the `fetch()` API to send the comment data to the serverless function in the body of a POST request.

``` js
    // ... (continued from above)
    // call the serverless function and send it 
    // formObject in the body of the request
    const response = await fetch('/.netlify/functions/set_comment', {
        method: "POST",
        body: JSON.stringify(formObject)
    })
    // ...
```

From there, the rest of the handler prints either a success or error message under the comment submission form.

``` js
    // ... (continued from above)
    .then(response => {
        // ... reset form to indicate comment submitted,
        // and print success message below
    })
    .catch(error => {
        // ... reset form to indicate comment submitted, 
        // and print error message below
    });
};
```

``` js
// retrieve conmment handler - thisPostURL is defined in page
const handleGetComments = async (event) => {
    event.preventDefault();

    // ... erase any previously-displayed comments, load spinner .gif

    // call serverless function
    const response = await fetch('/.netlify/functions/get_comment', {
        method:'POST',
        body: JSON.stringify({
            postURL: thisPostURL
        })
    })
    // .json() returns a promise too, so there needs to be another .then()
    .then(response => response.json())
    .then(json => {
        // ... clear the spinner; test if there are any comments 
        // in the returned list; if so, iterate through them 
        // and add the appropriate HTML/text
    })
    .catch(error => {
        // ... clear the spinner; display an error message
    });
}
```

### Supabase: Storing and Retrieving Comments

The serverless functions to interface with Supabase need the 'dotenv' and 'supabase-js' Node packages, which are required from index.js in the root directory.

``` js
require('dotenv').config();
require('@supabase/supabase-js');
```

In the function files, which are in netlify/functions—the default directory Netlify specifies—I get the URL and anon key for the database from Netlify's .env variables. Netlify lets you specify those from your site's console, so it's easy to keep them secure.

``` js
const {
    DATABASE_URL,
    SUPABASE_SERVICE_API_KEY
} = process.env;
```

The meat of the setter function is the `.from()` method, which accesses the desired table, and the `.insert()` method, which adds the new entry. These are specified by the Supabase [API](https://zone-www-dot-lmn02xr2l-supabase.vercel.app/docs/reference/javascript/select). Netlify uses the ES modules default export syntax for the serverless functions, and the functions are automatically named after the files that contain them—`set_comment` and `get_comment` in my case.

``` js
// create supabase client using url/anon key from Netlify env variables
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

// uses ES modules syntax for default export
exports.handler = async (event, context, callback) => {
    let data
    try {
        // the result of createClient() can access the database
        data = await supabase
        // 'comments' is the name of the table 
        // within my database; .from() selects that
        .from('comments')
        // .insert() takes an array with one or more objects whose keys correspond
        // to those in the table, and adds each object as a new row to the table
        .insert([
            {   
                name: JSON.parse(event.body).name,
                email: JSON.parse(event.body).email,
                postURL: JSON.parse(event.body).postURL,
                comment: JSON.parse(event.body).comment,
                created_at: ((new Date()).toISOString()).toLocaleString('en-US'),
                show: true
            }
        ])
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
        body: JSON.stringify(data)
    };
}
```

The getter function works similarly, but uses the `.select()` and `.eq()` methods. These specify the columns to return and a matching condition to indicate whether or not to return a row, respectively.

``` js
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
```

### Conclusions

Some of the challenges I had in this project:

- It took me some trial and error to conceptualize exactly what the serverless functions needed to send back and forth with my site/Netlify.
- I had previously directly interfaced form submissions with Netlify for my contact form, but I needed to do a bit of reading to understand exactly how to get the information from the form into a format suitable to send in an HTTP POST request.

One of my takeaways from this was that I should do more backend stuff. I haven't done much before, but I find it's a lot of fun to connect things together and make them communicate. Maybe a future project could include making my own database on my Raspberry Pi and setting up more complex interactions with it.

Thanks for reading this far! In the near term, I'm planning to make an RSS feed for this blog—look for a similar write-up when I do that.