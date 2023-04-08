import Script from 'next/script';
import Generator from '@components/Generator';

export default function Home() {
  return (
    <>
      <Script
        src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
        strategy="beforeInteractive"
      />

      <div>
        <p className="pb-2">
          <b>Welcome to dimdates.com!</b>
        </p>

        <p className="pb-2">
          This website provides an easy way to <b>generate data</b> for a <b>
          Kimball-style date dimension table</b> (typically
          called <tt className="font-Fira">dimdates</tt> or similar) for your
          database, data warehouse, or lakehouse.
        </p>

        <p className="pb-2">
          Simply <b>configure the options</b> below (what kinds of fields you
          want, and how some of those fields should be generated), and then <b>
          export the result</b> as CSV, JSON, or SQL <tt className="font-Fira">insert</tt> statements.
        </p>

        <br />

        <Generator />

        <Script id="ko-fi">
          {`kofiWidgetOverlay.draw("dennisbarrett", {
              "type": "floating-chat",
              "floating-chat.donateButton.text": "Tip me",
              "floating-chat.donateButton.background-color": "#195190",
              "floating-chat.donateButton.text-color": "#FFFFFF"
            });`}
        </Script>
      </div>
    </>
  );
}
