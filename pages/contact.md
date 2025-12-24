---
title: Reilly Spitzfaden, Composer | Contact
description: Contact form for Reilly Spitzafden
---

<link rel="stylesheet" type="text/css" href="/styles/onecolumn.css" />
<link rel="stylesheet" type="text/css" href="/styles/forms.css" />

<h1 class="sectionHeader">Contact Information</h1>

Email: <reillypascal@gmail.com>

Signal: [@reillypascal.42](https://signal.me/#eu/7uMwpp_PyZnVmpmfO-Jm7Xgx_IZHTcATumXUo1WZU-_SwJfIWTNGap0m4PJEAiVy)

Matrix: [@reillypascal:cyberia.club](https://matrix.to/#/@reillypascal:cyberia.club)

Webmentions: [webmention.io](https://webmention.io/reillyspitzfaden.com/xmlrpc)

<!-- Matrix: [@reillypascal:matrix.org](https://matrix.to/#/@reillypascal:matrix.org) -->

<form
    name="contact"
    action="./pages/success.html"
    method="POST"
    data-netlify="true"
>
<h1 class="sectionHeader">Contact Form</h1>
    <fieldset>
        <legend>Contact</legend>
        <ul>
            <li><input type="text" name="name" id="form-name" placeholder="Name (required)" class="textinput" required="true" aria-required="true"></li>
            <li><input type="email" name="email" id="form-email" placeholder="Email (required)" class="textinput" required="true" aria-required="true"></li>
            <li><input type="text" name="subject" id="form-subject" placeholder="Subject (optional)" class="textinput"></li>
            <li><textarea name="message" id="form-story" placeholder="Message (required)" required="true" aria-required="true"></textarea></li>
            <li><input type="submit" value="Send" id="send-email"></li>
        </ul>
    </fieldset>
</form>
