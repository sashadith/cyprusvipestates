"use client";

import { useEffect } from "react";

const MicrosoftClarity = () => {
  useEffect(() => {
    (function (c: any, l: Document, a: string, r: string, i: string) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      const t = l.createElement(r) as HTMLScriptElement;
      // Для TypeScript устанавливаем async как boolean (true) вместо числа 1
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i;
      const y = l.getElementsByTagName(r)[0];
      // Проверяем, что родительский узел существует, прежде чем вставлять скрипт
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      }
    })(window, document, "clarity", "script", "qoasnhd0ms");
  }, []);

  return null;
};

export default MicrosoftClarity;
