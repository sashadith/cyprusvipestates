// components/GoogleAnalyticsWrapper.tsx
"use client";

import Script from "next/script";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function GoogleAnalyticsWrapper() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookieConsent");
    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        if (parsed.analytics === true) {
          setEnabled(true);
        }
      } catch {
        // noop
      }
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-WLD3B6GN9P`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WLD3B6GN9P');
        `}
      </Script>
    </>
  );
}
