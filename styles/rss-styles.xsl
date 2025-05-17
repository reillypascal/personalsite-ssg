<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/rss/channel">
    <html>
    <head>
        <title><xsl:value-of select="title"/></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style>
          :root {
            --block-top-bottom-margin: 48px;
          }
          @font-face {
              font-family: "Funnel Sans";
              src:
                  url("/styles/fonts/funnelsans/funnelsans_latin_variable.woff2")
                      format("woff2");
              font-weight: 100 900;
              font-display: swap;
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
              font-family: "Funnel Sans";
              src:
                  url("/styles/fonts/funnelsans/funnelsans_latin_ext_variable.woff2")
                      format("woff2");
              font-weight: 100 900;
              font-display: swap;
              unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
              font-family: "Funnel Sans";
              src:
                  url("/styles/fonts/funnelsans/funnelsans_italic_latin_variable.woff2")
                      format("woff2");
              font-style: italic;
              font-weight: 100 900;
              font-display: swap;
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
              font-family: "Funnel Sans";
              src:
                  url("/styles/fonts/funnelsans/funnelsans_italic_latin_ext_variable.woff2")
                      format("woff2");
              font-style: italic;
              font-weight: 100 900;
              font-display: swap;
              unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
              font-family: "Hanken Grotesk";
              src:
                  url("/styles/fonts/hankengrotesk/hankengrotesk_latin_variable.woff2")
                      format("woff2");
              font-weight: 100 900;
              font-display: swap;
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
              font-family: "Hanken Grotesk";
              src:
                  url("/styles/fonts/hankengrotesk/hankengrotesk_latin_ext_variable.woff2")
                      format("woff2");
              font-display: swap;
              unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          @font-face {
              font-family: "Hanken Grotesk";
              src:
                  url("/styles/fonts/hankengrotesk/hankengrotesk_italic_latin_variable.woff2")
                      format("woff2");
              font-style: italic;
              font-weight: 100 900;
              font-display: swap;
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          @font-face {
              font-family: "Hanken Grotesk";
              src:
                  url("/styles/fonts/hankengrotesk/hankengrotesk_italic_latin_ext_variable.woff2")
                      format("woff2");
              font-style: italic;
              font-display: swap;
              unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
          }
          body {
            background-color: hsl(227, 26%, 11%);
            color: hsl(227, 87%, 95%);
            margin: 16px;
            font-family: 'Hanken Grotesk', sans-serif;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
              font-family: "Funnel Sans", sans-serif;
              font-weight: 800;
          }
          main {
            max-width: 45rem;
            line-height: 1.35;
          }
          a {
            color: hsl(227, 87%, 95%);
          }
          #cardImg {
              display: inline-flex;
              flex-flow: row wrap;
          }
          #cardImg a {
              text-decoration: none !important;
              border-bottom-style: none !important;
          }
          #cardImg a img:not(:last-child) {
              padding-right: 22px;
          }
          #floppy-disk {
              vertical-align: 1px;
          }
          .alert {
            margin: 16px 0 var(--block-top-bottom-margin) 0;
          }
          header {
            margin: var(--block-top-bottom-margin) 0;
          }
          article {
            margin: var(--block-top-bottom-margin) 0;
          }
          .sectionHeader {
            <!-- display: inline-block; -->
            width: fit-content;
            padding-bottom: 6px;
            border-bottom: 1px solid hsl(327, 55%, 75%);
          }
          .meta-icon {
            position: relative;
            top: 2px;
          }
          .meta-text {
            margin-left: 7px;
          }
          <!-- .rss-icon {
            display: inline-block;
            position: relative;
            top: 2px;
            margin-left: 12px;
          } -->
        </style>
    </head>
  <body>
    <main>
      <section>
        <div id="cardImg">
          <a href="/">
              <img src="/media/radio-tower-aliceblue-64px.svg" alt="Pixel art icon of a radio tower" id="radio-tower" height="64" width="64"/>
              <img src="/media/save-aliceblue-64px.svg" alt="Pixel art icon of a floppy disk" id="floppy-disk" height="64" width="64" />
          </a>
        </div>
        
        <div class="alert">
          <p>This is a preview of the feed. You can subscribe for free by copying the URL from the address bar into your newsreader.</p>

          <p>See <a href="https://reillyspitzfaden.com/feeds/#what-is-rss">here</a> for suggested readers and more info. You can also <a href="https://www.mnot.net/rss/tutorial/">learn how to set up your own feed</a>!</p>

          <p>A full listing of this site's feeds can be found <a href="https://reillyspitzfaden.com/feeds/">here</a>.</p>
        </div>
      </section>

      <header>
        <a href="/">Visit Website →</a>
      </header>
      
      <h2 class="sectionHeader">Recent Items</h2>
      <!-- <span class="rss-icon">
        <img width="20" height="20" src="/media/rss-icon-light.svg" alt="rss icon" />
      </span> -->
      
      <xsl:for-each select="item">
        <article>
          <h3><a>
            <xsl:attribute name="href">
              <xsl:value-of select="link"/>
            </xsl:attribute>
            <xsl:value-of select="title"/></a></h3>
          <div class="post-meta">
            <span class="meta-icon">
              <img src="/media/icon-calendar-ltr.svg" alt="calendar icon" width="18" height="18" />
            </span>
            <span class="meta-text">
              <time class="dt-published" >
                <xsl:attribute name="datetime">
                  <xsl:value-of select="pubDate"/>
                </xsl:attribute>
                <xsl:value-of select="substring(pubDate, 1, 16)"/>
              </time>
            </span>
          </div>
        </article>
      </xsl:for-each>
    </main>
  </body>
  </html>
  </xsl:template>
</xsl:stylesheet>