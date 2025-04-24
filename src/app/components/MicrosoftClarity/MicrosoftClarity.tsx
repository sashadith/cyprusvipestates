"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

const MicrosoftClarity = () => {
  useEffect(() => {
    const consent = Cookies.get("cookieConsent");
    if (!consent) return;

    try {
      const parsed = JSON.parse(consent);
      if (!parsed.analytics) return; // Только если пользователь согласен
    } catch {
      return;
    }

    (function (c: any, l: Document, a: string, r: string, i: string) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i;
      const y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      }
    })(window, document, "clarity", "script", "qoasnhd0ms");
  }, []);

  return null;
};

export default MicrosoftClarity;
