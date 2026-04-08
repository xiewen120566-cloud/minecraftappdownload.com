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
        <Script
          id="google-gpt-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
window.googletag = window.googletag || {cmd: []};
googletag.cmd.push(function(){
  if (!window.__adPlusSlots) window.__adPlusSlots = {};
  if (!window.__adPlusSlots['300x250-1']) {
    window.__adPlusSlots['300x250-1'] = true;
    googletag.defineSlot('/21849154601,23294547171/Ad.Plus-300x250',[300,250],'300x250-1').addService(googletag.pubads());
  }
  googletag.enableServices();
});
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
