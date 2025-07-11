import React, { FC } from "react";
import styles from "./PartnersStars.module.scss";
import { Oswald } from "next/font/google";

type Props = {
  lang: string;
};

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
});

const StarsData = [
  {
    title: "Bauunternehmer",
    description:
      "Unsere Partner sind die renommiertesten Bauträger der Insel – sorgfältig ausgewählt und geprüft, um unseren Kunden erstklassige Qualität bieten zu können.",
  },
  {
    title: "Rechtsberater",
    description:
      "Um unseren Kunden ein Höchstmaß an Sicherheit und Vertrauen in den gesamten Immobilienprozess zu gewährleisten, arbeiten wir eng mit erfahrenen Rechtsanwälten und Notaren zusammen.",
  },
  {
    title: "Immobilienagenturen und private Vermittler",
    description:
      "Du erhältst Zugriff auf unsere aktuelle Immobiliendatenbank mit ausgewählten Angeboten und exklusiven Provisionskonditionen.",
  },
];

const PartnersStars: FC<Props> = ({ lang }) => {
  return (
    <section className={styles.stars}>
      <div className="container">
        <h2 className={`${styles.title} ${oswald.className}`}>
          Mit welchen <span className={styles.highlight}> unternehmen </span>
          arbeiten wir <span className={styles.highlight}> zusammen</span>
        </h2>
        <div className={styles.benefitsItems}>
          {StarsData.map((item) => (
            <div key={item.title} className={styles.benefitsItem}>
              <div className={styles.benefitsItemNumber}>
                <svg
                  width="86"
                  height="82"
                  viewBox="0 0 86 82"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M42.7975 0L52.9007 31.0942H85.5951L59.1447 50.3115L69.2479 81.4058L42.7975 62.1885L16.3472 81.4058L26.4503 50.3115L0 31.0942H32.6944L42.7975 0Z"
                    stroke="none"
                    preserveAspectRatio="none"
                    fill="#BD8948"
                  ></path>
                </svg>
              </div>
              <div className={styles.benefitsItemContent}>
                <h3 className={styles.benefitsItemTitle}>{item.title}</h3>
                <p className={styles.benefitsItemDescription}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersStars;
