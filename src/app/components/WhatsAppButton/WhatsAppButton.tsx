import React, { FC } from "react";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./WhatsAppButton.module.scss";

type Props = {
  lang: string;
};

const WhatsAppButton: FC<Props> = ({ lang }) => {
  const phone = "35799278285";

  const messages: Record<string, string> = {
    en: "Hello, I’m interested in buying property in Cyprus. Could you help me find suitable villas or apartments?",
    de: "Hallo, ich interessiere mich für den Kauf einer Immobilie auf Zypern. Bitte kontaktieren Sie mich.",
    pl: "Dzień dobry, interesuję się zakupem nieruchomości na Cyprze. Czy mogą mi Państwo doradzić odpowiednie wille lub apartamenty?",
    ru: "Здравствуйте! Я интересуюсь покупкой недвижимости на Кипре. Подскажите, пожалуйста, какие виллы или апартаменты доступны сейчас?",
  };

  const text = encodeURIComponent(messages[lang] || messages.en);
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;

  const label =
    lang === "en"
      ? "WhatsApp us now"
      : lang === "de"
        ? "WhatsApp senden"
        : lang === "pl"
          ? "Napisz do nas teraz"
          : lang === "ru"
            ? "Напишите нам сейчас"
            : "WhatsApp us";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappButton}
    >
      <FaWhatsapp size={20} />
      <span className={styles.label}>{label}</span>
    </a>
  );
};

export default WhatsAppButton;
