<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
    <head>
        <title><xsl:value-of select="atom:feed/atom:title"/></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style>
          @font-face {
              font-family: "Born2bSportyV2";
              src:
                  url("/styles/fonts/born2bsportyv2/born2bsportyv2-webfont.woff2")
                      format("woff2");
              font-display: swap;
          }
          @font-face {
            font-family: "Open Sans";
            src:
                url("/styles/fonts/opensans/opensans-variablefont_wdthwght-webfont.woff2")
                    format("woff2");
            font-display: swap;
          }
          @font-face {
              font-family: "Open Sans";
              src:
                  url("/styles/fonts/opensans/opensans-italic-variablefont_wdthwght-webfont.woff2")
                      format("woff2");
              font-style: italic;
              font-display: swap;
          }
          body {
            background-color: hsl(227, 26%, 11%);
            color: hsl(227, 87%, 95%);
            margin: 16px;
            font-family: 'Open Sans', sans-serif;
            text-underline-offset: 0.2em;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
              font-family: "Born2bSportyV2", sans-serif;
              text-underline-offset: auto;
              letter-spacing: 0.005em;
          }
          h2 {
              font-size: 1.75em;
          }
          h3 {
              font-size: 1.375em;
          }
          h4 {
              font-size: 1.125em;
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
              padding-right: 26px;
          }
          #floppy-disk {
              vertical-align: 1px;
          }
          .alert {
            margin: 16px 0 48px 0;
          }
          header {
            margin: 48px 0;
          }
          article {
            margin: 48px 0 48px 0;
          }
          .sectionHeader {
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
          <p><strong>This is a web feed</strong>, also known as an RSS feed!</p> 
          
          <p>You can <strong>subscribe</strong> by copying the URL from the address bar into your newsreader (see <a href="https://reillyspitzfaden.com/feeds/#what-is-rss">here</a> for suggested readers and more info).</p>
        </div>
      </section>

      <header>
        <a href="/">Visit Website →</a>
      </header>
      <h2 class="sectionHeader">Recent Items</h2>
      <xsl:for-each select="atom:feed/atom:entry">
        <article>
          <h3><a>
            <xsl:attribute name="href">
              <xsl:value-of select="atom:link/@href"/>
            </xsl:attribute>
            <xsl:value-of select="atom:title"/></a></h3>
          <div class="post-meta">
            <span class="meta-icon">
              <img src="/media/icon-calendar-ltr.svg" alt="calendar icon" width="18" height="18" />
            </span>
            <span class="meta-text">
              <time class="dt-published" >
                <xsl:attribute name="datetime">
                  <xsl:value-of select="atom:updated"/>
                </xsl:attribute>
                <!-- <xsl:variable name="srcDate" select="atom:updated" />
                <xsl:value-of select="format-dateTime($srcDate,'[M01]-[D01]-[Y0001]')"/> -->
                <!-- <xsl:value-of select="substring(atom:updated, 1, 10)"/> -->
                <xsl:value-of select="atom:updated"/>
              </time>
            </span>
          </div>
          <!-- <p>Published: <xsl:value-of select="format-date(current-date(), '[M01]-[D01]-[Y0001]')"/></p> -->
        </article>
      </xsl:for-each>
    </main>
  </body>
  </html>
  </xsl:template>
</xsl:stylesheet>