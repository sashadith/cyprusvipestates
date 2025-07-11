import React, { FC } from "react";
import styles from "./PartnersCta.module.scss";
import { Oswald } from "next/font/google";
import { ButtonModal } from "../../ButtonModal/ButtonModal";
import Image from "next/image";

type Props = {
  lang: string;
};

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
});

const PartnersCta: FC<Props> = ({ lang }) => {
  return (
    <section className={styles.partnersCta}>
      <div className="container">
        <div className={styles.cta}>
          <div className={styles.ctaWrapper}>
            <div className={styles.ctaContent}>
              <h2 className={`${styles.title} ${oswald.className}`}>
                werde unser <span className={styles.highlight}>partner!</span>
              </h2>
              <p className={styles.description}>
                Fülle das Formular aus und werde Teil unseres internationalen
                Teams
              </p>
            </div>
            <div className={styles.ctaButton}>
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
          </div>
          <Image
            src="https://cdn.sanity.io/files/88gk88s2/production/616ecfad4ada6eef63240e5727f0d5da6bb53434.png"
            alt="Partnering with Cyprus VIP Estates"
            width={600}
            height={520}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
};

export default PartnersCta;
