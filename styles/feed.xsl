<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
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
        <!-- <link rel="stylesheet" type="text/css" href="/styles/global.css" /> -->
        <style>
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
            margin: 32px;
            font-family: 'Open Sans', sans-serif;
          }
          main {
            max-width: 45rem;
            line-height: 1.35;
          }
          a {
            color: hsl(227, 87%, 95%);
          }
          article {
            margin: 32px 0;
          }
          hr {
            color: hsl(327, 55%, 75%);
          }
        </style>
    </head>
  <body>
    <main>
      <h1><xsl:value-of select="atom:feed/atom:title"/></h1>

      <section>
        <div class="alert">
          <p><strong>This is a web feed</strong>, also known as an RSS feed. <strong>Subscribe</strong> by copying the URL from the address bar into your newsreader (see <a href="https://reillyspitzfaden.com/feeds/#what-is-rss">here</a> for suggested readers and more info).</p>
        </div>
      </section>

      <xsl:for-each select="atom:feed/atom:entry">
        <article>
          <h2><a>
            <xsl:attribute name="href">
            <xsl:value-of select="atom:link/@href"/>
          </xsl:attribute>
            <xsl:value-of select="atom:title"/></a></h2>
          <p>Published: <xsl:value-of select="atom:updated"/></p>
          <hr />
        </article>
      </xsl:for-each>
    </main>
  </body>
  </html>
  </xsl:template>
</xsl:stylesheet>