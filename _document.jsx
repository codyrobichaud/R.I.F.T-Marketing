import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta */}
        <meta name="description" content="R.I.F.T. Marketing — We don't market brands. We build movements. Digital marketing agency for founders, startups, and entrepreneurs." />
        <meta name="keywords" content="digital marketing, brand strategy, social media management, content strategy, RIFT framework, startup marketing, founder branding" />
        <meta name="author" content="Reality Rift Designs" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://realityriftdesign.pro/" />
        <meta property="og:title"       content="R.I.F.T. Marketing — We Build Movements" />
        <meta property="og:description" content="The R.I.F.T. framework transforms founders into market authorities. From brand clarity to automated growth at scale." />
        <meta property="og:image"       content="https://realityriftdesign.pro/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@Rift_Marketing_" />
        <meta name="twitter:title"       content="R.I.F.T. Marketing — We Build Movements" />
        <meta name="twitter:description" content="The R.I.F.T. framework transforms founders into market authorities." />
        <meta name="twitter:image"       content="https://realityriftdesign.pro/og-image.png" />

        {/* Canonical */}
        <link rel="canonical" href="https://realityriftdesign.pro/" />

        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
