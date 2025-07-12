import React, { FC } from "react";
import styles from "./PartnersHero.module.scss";
import Image from "next/image";
import { ButtonModal } from "../../ButtonModal/ButtonModal";
import { Oswald } from "next/font/google";

type Props = {
  lang: string;
};

type PartnersHeroTranslation = {
  subtitleTop: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  subtitleBottom: string;
  button: string;
  note: string;
};

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
});

const translations: Record<string, PartnersHeroTranslation> = {
  de: {
    subtitleTop: "Werde partner von cyprus vip estates",
    titleStart: "Werde jetzt teil unseres ",
    titleHighlight: "partnerprogramms",
    titleEnd: " und verdiene mit uns!",
    subtitleBottom: "Verdiene bis zu 40 % unserer provision*",
    button: "jetzt partner werden!",
    note: "* Für Immobilienkäufe erhalten unsere Partner eine Provision von 30 % bis 50 %. Für die Empfehlung von Eigentümern bestehender Immobilien zahlen wir 10 % Vermittlungsprovision.",
  },
  en: {
    subtitleTop: "Become a partner of Cyprus VIP Estates",
    titleStart: "Join our ",
    titleHighlight: "partner program",
    titleEnd: " and earn with us!",
    subtitleBottom: "Earn up to 40% of our commission*",
    button: "become a partner",
    note: "* For real estate purchases, our partners receive a commission of 30–50%. For referring property owners, we pay a 10% referral commission.",
  },
  pl: {
    subtitleTop: "Zostań partnerem Cyprus VIP Estates",
    titleStart: "Dołącz do naszego ",
    titleHighlight: "programu partnerskiego",
    titleEnd: " i zarabiaj z nami!",
    subtitleBottom: "Zarabiaj do 40% naszej prowizji*",
    button: "zostań partnerem",
    note: "* Za sprzedaż nieruchomości partnerzy otrzymują prowizję 30–50%. Za polecenie właścicieli nieruchomości wypłacamy 10% prowizji.",
  },
  ru: {
    subtitleTop: "Стань партнёром Cyprus VIP Estates",
    titleStart: "Стань частью ",
    titleHighlight: "партнёрской программы",
    titleEnd: " и зарабатывай с нами!",
    subtitleBottom: "Зарабатывай до 40% нашей комиссии*",
    button: "стать партнёром",
    note: "* За продажу недвижимости партнёры получают комиссию от 30 до 50%. За рекомендации владельцев — 10% вознаграждение.",
  },
};

const PartnersHero: FC<Props> = ({ lang }) => {
  const t: PartnersHeroTranslation = translations[lang] ?? translations.de;

  return (
    <section className={styles.partnersHero}>
      <div className="container-full">
        <div className={styles.wrapper}>
          <div className={styles.partnersHeroImage}>
            <div className={styles.overlay}></div>
            <Image
              src="https://cdn.sanity.io/files/88gk88s2/production/e9d1c7cb6b6a454772c591756f35a3df695b6e40.jpg"
              alt="Partnering with Cyprus VIP Estates"
              width={800}
              height={800}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.contentWrapper}>
              <div className={`${styles.contentText} ${oswald.className}`}>
                <p className={styles.subtitle}>{t.subtitleTop}</p>
                <h1 className={styles.title}>
                  {t.titleStart}
                  <span className={styles.highlight}>{t.titleHighlight}</span>
                  {t.titleEnd}
                </h1>
                <p className={styles.subtitle}>{t.subtitleBottom}</p>
              </div>
              <div className={styles.contentButton}>
                <ButtonModal>{t.button}</ButtonModal>
              </div>
              <div className={styles.contentAside}>
                <p className={styles.asideText}>{t.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersHero;
