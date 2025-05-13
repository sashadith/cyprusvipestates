"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./CustomCookieConsent.module.scss";

const COOKIE_NAME = "cookieConsent";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type Props = {
  lang: "en" | "de" | "pl" | "ru";
};

const dictionary = {
  en: {
    title: "We use cookies",
    description:
      "By continuing to use our site, you agree to our Cookie Policy.",
    accept: "Continue",
    privacy: "Cookie Policy",
  },
  de: {
    title: "Wir verwenden Cookies",
    description:
      "Wenn Sie unsere Website weiterhin nutzen, stimmen Sie unserer Cookie-Richtlinie zu.",
    accept: "Weiter",
    privacy: "Cookie-Richtlinie",
  },
  pl: {
    title: "Używamy plików cookie",
    description:
      "Kontynuując korzystanie z naszej witryny, zgadzasz się z polityką plików cookie.",
    accept: "Kontynuuj",
    privacy: "Polityka plików cookie",
  },
  ru: {
    title: "Мы используем cookies",
    description:
      "Используя наш сайт, вы соглашаетесь с нашей политикой в отношении cookies.",
    accept: "Продолжить",
    privacy: "Политика использования cookies",
  },
};

export default function CustomCookieConsent({ lang }: Props) {
  const router = useRouter();

  const getNormalizedHref = (lang: string, link: string) => {
    const normalizedLink = link.startsWith("/") ? link.slice(1) : link;
    const languagePrefix = lang === "de" ? "" : `/${lang}`;
    return `${languagePrefix}/${normalizedLink}`;
  };

  const t = dictionary[lang] || dictionary.en;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = Cookies.get(COOKIE_NAME);
    if (!saved) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const consent: Consent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    Cookies.set(COOKIE_NAME, JSON.stringify(consent), { expires: 180 });
    setVisible(false);
    router.refresh();
  };

  const rejectAll = () => {
    const consent: Consent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    Cookies.set(COOKIE_NAME, JSON.stringify(consent), { expires: 180 });
    setVisible(false);
    router.refresh();
  };

  if (!visible) return null;

  return (
    <div className={styles.cookieBanner}>
      <h3>{t.title}</h3>
      <p>{t.description}</p>

      <div className={styles.buttons}>
        <button onClick={acceptAll}>{t.accept}</button>
      </div>

      <p className={styles.policyLink}>
        <a
          href={getNormalizedHref(
            lang,
            {
              en: "privacy-policy",
              de: "datenschutzrichtlinie",
              pl: "polityka-prywatnosci",
              ru: "politika-privatnosti",
            }[lang]
          )}
          target="_blank"
        >
          {t.privacy}
        </a>
      </p>
    </div>
  );
}
