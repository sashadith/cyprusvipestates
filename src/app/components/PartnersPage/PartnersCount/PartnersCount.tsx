import React, { FC } from "react";
import styles from "../../BenefitsBlock/BenefitsBlock.module.scss";
import CountNumber from "../../CountNumber/CountNumber";
import Image from "next/image";

type Props = {
  lang: string;
};

const BenefitsData = [
  {
    number: "195",
    title: "Immobilienprojekte",
    description: "Auf Süd-Zypern. Von Studio Apartments bis High Class Villas",
  },
  {
    number: "10",
    title: "Jahre Erfahrung",
    description: "als Full-Service Immobilien Marketing Agentur",
  },
  {
    number: "360",
    sign: "°",
    title: "Service für unsere Kunden",
    description:
      "Wir begleiten Sie vom ersten Kontakt bis zur Schlüsselübergabe",
  },
  {
    number: "100",
    sign: "%",
    title: "Zufriedene Kunden",
    description: "Aus Deutschland, Österreich, Schweiz und weiteren Ländern",
  },
];

const PartnersCount: FC<Props> = ({ lang }) => {
  return (
    <section className={styles.benefitsBlock}>
      <div className="container">
        <div className={styles.inner}>
          {/* {benefitsBlock.title && <h2 className="h2">{benefitsBlock.title}</h2>} */}
          <div className={styles.benefitsList}>
            {BenefitsData.map((benefit) => (
              <div key={benefit.title} className={styles.benefitItem}>
                <div className={styles.image}>
                  <Image
                    src="https://cdn.sanity.io/files/88gk88s2/production/fc32736b9254db609636afb517d52ee174377d9f.png"
                    alt="Cyprus VIP Estates Benefits"
                    width={80}
                    height={80}
                    className={styles.icon}
                  />
                </div>
                <div className={styles.content}>
                  {benefit && (
                    <div className={styles.conuting}>
                      <div className={styles.conuter}>
                        <CountNumber>{benefit.number}</CountNumber>
                        {benefit.sign && <span>{benefit.sign}</span>}
                      </div>
                    </div>
                  )}
                  <div className={styles.text}>
                    {benefit.title && (
                      <p className={styles.title}>{benefit.title}</p>
                    )}
                    {benefit.description && (
                      <p className={styles.description}>
                        {benefit.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersCount;
