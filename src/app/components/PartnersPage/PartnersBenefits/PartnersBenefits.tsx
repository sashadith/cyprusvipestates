import React, { FC } from "react";
import styles from "./PartnersBenefits.module.scss";
import { Oswald } from "next/font/google";
import FadeUpAnimate from "../../FadeUpAnimate/FadeUpAnimate";

type Props = {
  lang: string;
};

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
});

const BenefitsData = [
  {
    number: "1",
    title: "Schnelle Auszahlungen",
    description:
      "Wir zahlen innerhalb von 14 Tagen nach Zahlungsbestätigung durch den Bauträger einen 30% Vorschuss aus. Die verbleibenden 70 % erhältst Du, sobald wir die vollständige Provision erhalten haben.",
  },
  {
    number: "2",
    title: "Zusammenarbeit mit Experten",
    description:
      "Wir organisieren Besichtigungen, kümmern uns um alle rechtlichen Angelegenheiten und unterstützen Dich bei der kompletten Abwicklung.",
  },
  {
    number: "3",
    title: "Exklusive Immobilien",
    description:
      "Du erhältst Zugriff auf unsere aktuelle Immobiliendatenbank mit ausgewählten Angeboten und exklusiven Provisionskonditionen.",
  },
  {
    number: "4",
    title: "Immer am Puls der Zeit",
    description:
      "Jeder Schritt des Kunden wird digital erfasst. Deine Anfragen werden automatisch in unser CRM-System übernommen. Über das Partnerportal behältst Du jederzeit den Überblick über den aktuellen Stand. Detaillierte Reports stehen Dir jederzeit zur Verfügung.",
  },
];

const PartnersBenefits: FC<Props> = ({ lang }) => {
  return (
    <section className={styles.benefits}>
      <div className="container">
        <h2 className={`${styles.title} ${oswald.className}`}>
          Die <span className={styles.highlight}>vorteile</span> unseres
          partnerprograms
        </h2>
        <div className={styles.benefitsItems}>
          {BenefitsData.map((item, index) => (
            <FadeUpAnimate key={index} delay={index * 100}>
              <div className={styles.benefitsItem}>
                <div className={styles.benefitsItemNumber}>
                  <span className={styles.number}>{item.number}</span>
                </div>
                <div className={styles.benefitsItemContent}>
                  <h3 className={styles.benefitsItemTitle}>{item.title}</h3>
                  <p className={styles.benefitsItemDescription}>
                    {item.description}
                  </p>
                </div>
              </div>
            </FadeUpAnimate>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersBenefits;
