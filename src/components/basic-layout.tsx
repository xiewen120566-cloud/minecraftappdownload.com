import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { PropsWithChildren } from "react";
import Script from "next/script";

import { Locale } from "@/i18n/routing";

import { Providers } from "./providers";

interface Props extends PropsWithChildren {
  locale: Locale;
}

export default async function BaseLayout({ children, locale }: Props) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Script
          id="google-gpt-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
window.googletag = window.googletag || { cmd: [] };
            `,
          }}
        />
        <Script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <div className="gpt-sticky-bottom">
              <div className="gpt-sticky-bottom__inner">
                <div className="ad-placeholder" style={{ textAlign: "center", paddingBlock: 12 }}>
                  <div
                    id="320x100-1"
                    className="gpt-slot"
                    style={{ width: 320, height: 100, display: "none" }}
                  />
                  <div
                    id="320x50-1"
                    className="gpt-slot"
                    style={{ width: 320, height: 50, display: "none" }}
                  />
                </div>
                <Script
                  id="gpt-sticky-320"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
window.googletag = window.googletag || { cmd: [] };
googletag.cmd.push(function() {
  var useSmall = false;
  try {
    useSmall = !!(window.matchMedia && window.matchMedia("(max-height: 700px)").matches);
  } catch (e) {}
  var showId = useSmall ? "320x50-1" : "320x100-1";
  var hideId = useSmall ? "320x100-1" : "320x50-1";
  var showEl = document.getElementById(showId);
  var hideEl = document.getElementById(hideId);
  if (showEl) showEl.style.display = "block";
  if (hideEl) hideEl.style.display = "none";
  if (!window.__adPlusSlots) window.__adPlusSlots = {};
  if (!window.__adPlusSlots[showId]) {
    window.__adPlusSlots[showId] = true;
    if (useSmall) {
      googletag.defineSlot('/21849154601,23294547171/Ad.Plus-320x50', [320, 50], '320x50-1').addService(googletag.pubads());
    } else {
      googletag.defineSlot('/21849154601,23294547171/Ad.Plus-320x100', [320, 100], '320x100-1').addService(googletag.pubads());
    }
  }
  googletag.enableServices();
  googletag.display(showId);
});
                    `,
                  }}
                />
              </div>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
