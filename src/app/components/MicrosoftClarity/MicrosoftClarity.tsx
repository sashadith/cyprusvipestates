"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    clarity: (...args: any[]) => void;
  }
}

export default function MicrosoftClarity({
  hasConsent,
}: {
  hasConsent: boolean;
}) {
  useEffect(() => {
    // инициализируем Clarity (как у тебя было)
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

  useEffect(() => {
    // после инициализации явно сообщаем статус согласия
    // это ключевое требование Microsoft
    if (typeof window !== "undefined" && typeof window.clarity === "function") {
      window.clarity("consent", hasConsent === true);
    }
  }, [hasConsent]);

  return null;
}
