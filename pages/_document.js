import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <meta name="google-site-verification" content="1yE_GbND2ulcprJxgPNHSPaGCw3NMdvv0x1H2CiwvRY" /> */}
        <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet" />

        <Script
          src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
          strategy="beforeInteractive"
        />

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_TAG}`}
          strategy="afterInteractive"
        />
        <Script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS_TAG}');
          `}
        </Script>
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
