// ##################### COMMENT FUNCTIONS ######################

// submit conmment handler - blogPostURL variable is defined blogpostlayout.liquid
const handleSubmitComment = async (event) => {
  event.preventDefault();

  // reset "Comment submitted!" in div in the same line as the submit button
  const submitSuccess = document.getElementById("submit-success");
  submitSuccess.innerText = "";

  // get form data
  const myForm = event.target;
  const formData = new FormData(myForm);
  // make FormData into an object to easily send via supabase-js
  const formObject = {
    name: formData.get("name"),
    email: formData.get("email"),
    postURL: blogPostURL,
    comment: formData.get("comment"),
  };

  // call the serverless function and send it
  // formObject in the body of the request
  const response = await fetch("/.netlify/functions/set_comment", {
    method: "POST",
    body: JSON.stringify(formObject),
  })
    .then((response) => {
      // reset form to indicate comment submitted
      const commentForm = document.getElementById("comment-form");
      const submitSuccess = document.getElementById("submit-success");

      commentForm.reset();
      submitSuccess.innerText = "Comment submitted!";
    })
    .catch((error) => {
      // reset form to indicate comment submitted
      const commentForm = document.getElementById("comment-form");
      const submitSuccess = document.getElementById("submit-success");

      commentForm.reset();
      submitSuccess.innerText = "Error submitting comment";

      console.log(error);
      console.log(response);
    });
};

// retrieve conmment handler - blogPostURL is defined in page
const handleGetComments = async (event) => {
  event.preventDefault();

  // erase previously-loaded comments
  const parentDiv = document.getElementById("comment-section");
  parentDiv.innerHTML = "";

  // display spinner
  let spinnerBreak = document.createElement("br");
  let spinner = document.createElement("img");
  // spinner.src = "/media/Rolling-1s-64px.gif";
  spinner.src = "/media/Rolling@1x-1.0s-64px-64px.svg";
  parentDiv.appendChild(spinnerBreak);
  parentDiv.appendChild(spinner);

  // call serverless function
  const response = await fetch("/.netlify/functions/get_comment", {
    method: "POST",
    body: JSON.stringify({
      postURL: blogPostURL,
    }),
  })
    .then((response) => response.json()) // .json() returns a promise too, so there needs to be another .then()
    .then((json) => {
      // clear spinner
      const parentDiv = document.getElementById("comment-section");
      parentDiv.innerHTML = "";

      if (Object.keys(json).length === 0) {
        let commentBreak = document.createElement("br");
        let errorParagraph = document.createElement("p");

        errorParagraph.innerText = "No comments found";

        parentDiv.appendChild(commentBreak);
        parentDiv.appendChild(errorParagraph);
      } else {
        // iterate through comments, make divs for each
        for (let element of json) {
          // make new div, children
          let commentDiv = document.createElement("div");
          let commenterName = document.createElement("h3");
          let thisComment = document.createElement("p");
          // let commentDateHR = document.createElement("hr");
          let commentDate = document.createElement("p");
          let commentBreak = document.createElement("br");

          let dateToParse = element.created_at;
          const dateObj = new Date(dateToParse);

          // set up children
          commentDiv.className = "comment";
          commenterName.textContent = element.name;
          thisComment.textContent = element.comment;
          // commentDateHR.style.color = "#565973";
          commentDate.innerHTML = `<span class="meta-icon">
            <img src="/media/icon-calendar-ltr.svg" alt="calendar icon" />
          </span>
          
          <span class="meta-text">
              <time>${dateObj.getMonth() + 1}-${dateObj.getDate()}-${dateObj.getFullYear()}</time>
          </span>`;
          // commentDate.style.fontSize = "10pt";

          // add children to div
          commentDiv.appendChild(commenterName);
          commentDiv.appendChild(thisComment);
          // commentDiv.appendChild(commentDateHR);
          commentDiv.appendChild(commentDate);

          // add to document
          parentDiv.appendChild(commentBreak);
          parentDiv.appendChild(commentDiv);
        }
      }
    })
    .catch((error) => {
      // alert(error);
      // clear spinner, any past comments; display error instead
      const parentDiv = document.getElementById("comment-section");
      parentDiv.innerHTML = "";

      let commentBreak = document.createElement("br");
      let errorParagraph = document.createElement("p");

      errorParagraph.innerText = "Error retrieving comments";

      parentDiv.appendChild(commentBreak);
      parentDiv.appendChild(errorParagraph);

      console.log(error);
      console.log(response);
    });
};

// ################## HEART REACTIONS ###################

const handleGetHeart = async (event) => {
  // event.preventDefault();

  const reactCtr = document.getElementById("react-ctr");
  // reactCtr.innerText = '';

  const response = await fetch("/.netlify/functions/get_heart", {
    method: "POST",
    body: JSON.stringify({
      postURL: blogPostURL,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      let reactCount = Object.keys(json).length;
      reactCtr.innerText = `${reactCount}`;
    })
    .catch((error) => {
      reactCtr.innerText = "(error retrieving reactions)";

      console.log(error);
      console.log(response);
    });
};

const handleSubmitHeart = async (event) => {
  event.preventDefault();

  const reactBtn = document.getElementById("react-btn");
  const reactCtr = document.getElementById("react-ctr");

  const reactionObject = {
    heart: "",
    postURL: blogPostURL,
  };

  const response = await fetch("/.netlify/functions/set_heart", {
    method: "POST",
    body: JSON.stringify(reactionObject),
  })
    .then((response) => {
      console.log(response);
      handleGetHeart();

      reactBtn.disabled = "disabled";
      window.localStorage.setItem(blogPostURL, "disabled");
    })
    .catch((error) => {
      reactCtr.innerText = "error reacting to post";

      console.log(error);
      console.log(response);
    });
};

// ###################### WEBMENTIONS #######################
// const wmComments = document.getElementById("webmention-comments");
// const wmLikes = document.getElementById("webmention-likes");
// const wmReposts = document.getElementById("webmention-reposts");
// fetch(`https://webmention.io/api/count?target=${blogPostURL}`)
// .then(response => response.json())
// .then(responseJson => {
//   const types = responseJson.type;
//   wmComments.innerText = types.reply ? types.reply : 0;
//   wmLikes.innerText = types.like ? types.like : 0;
//   wmReposts.innerText = types.repost ? types.repost : 0;
// });

// ###################### SET UP/APPLY FUNCTIONS ######################

// add listeners, set up usage of comment/reaction functions
document.addEventListener("DOMContentLoaded", () => {
  const webmentionTarget = document.getElementById("webmention-target");
  webmentionTarget.setAttribute("value", blogPostURL);

  const commentForm = document.getElementById("comment-form");
  const getCommentButton = document.getElementById("load-comments");

  commentForm.addEventListener("submit", handleSubmitComment);
  getCommentButton.addEventListener("click", handleGetComments);

  const reactBtn = document.getElementById("react-btn");
  reactBtn.addEventListener("click", handleSubmitHeart);
  handleGetHeart();

  if (window.localStorage.getItem(blogPostURL) == "disabled") {
    reactBtn.disabled = true;
  }
});
