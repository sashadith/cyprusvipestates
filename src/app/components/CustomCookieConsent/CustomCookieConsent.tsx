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
      "We use cookies to improve your experience. By accepting, you agree to our use of cookies.",
    accept: "Accept",
    reject: "Reject",
    privacy: "Privacy Policy",
  },
  de: {
    title: "Wir verwenden Cookies",
    description:
      "Wir verwenden Cookies zur Verbesserung Ihrer Erfahrung. Durch Klicken auf 'Akzeptieren' stimmen Sie der Verwendung zu.",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    privacy: "Datenschutzrichtlinie",
  },
  pl: {
    title: "Używamy plików cookie",
    description:
      "Używamy plików cookie, aby poprawić Twoje doświadczenia. Klikając 'Akceptuj', wyrażasz zgodę.",
    accept: "Zaakceptuj",
    reject: "Odrzuć",
    privacy: "Polityka prywatności",
  },
  ru: {
    title: "Мы используем cookies",
    description:
      "Мы используем cookies для улучшения работы сайта. Нажимая 'Принять', вы соглашаетесь на их использование.",
    accept: "Принять все",
    reject: "Отклонить",
    privacy: "Политика конфиденциальности",
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
        <button onClick={rejectAll}>{t.reject}</button>
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
