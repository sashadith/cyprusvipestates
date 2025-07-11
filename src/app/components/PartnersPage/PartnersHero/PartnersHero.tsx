import React, { FC } from "react";
import styles from "./PartnersHero.module.scss";
import Image from "next/image";
import { ButtonModal } from "../../ButtonModal/ButtonModal";
import { Oswald } from "next/font/google";

type Props = {
  lang: string;
};

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
});

const PartnersHero: FC<Props> = ({ lang }) => {
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
                <p className={styles.subtitle}>
                  Werde partner von cyprus vip estates
                </p>
                <h1 className={styles.title}>
                  Werde jetzt teil unseres
                  <span className={styles.highlight}> partnerprogramms </span>
                  und verdiene mit uns!
                </h1>
                <p className={styles.subtitle}>
                  Verdiene bis zu 40 % unserer provision*
                </p>
              </div>
              <div className={styles.contentButton}>
                <ButtonModal>
                  {lang === "de"
                    ? "jetzt partner werden!"
                    : lang === "ru"
                      ? "стать партнером"
                      : lang === "en"
                        ? "become a partner"
                        : lang === "pl"
                          ? "zostań partnerem"
                          : "join as a partner"}
                </ButtonModal>
              </div>
              <div className={styles.contentAside}>
                <p className={styles.asideText}>
                  * Für Immobilienkäufe erhalten unsere Partner eine Provision
                  von 30 % bis 50 %. Für die Empfehlung von Eigentümern
                  bestehender Immobilien zahlen wir 10 % Vermittlungsprovision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersHero;
