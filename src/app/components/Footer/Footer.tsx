import React from "react";
import styles from "./Footer.module.scss";
import { getFooterByLang } from "@/sanity/sanity.utils";
import Link from "next/link";
import { Link as FooterLink } from "@/types/footer"; // Импортируйте тип Link и переименуйте его, чтобы избежать конфликта с Link из next/link

type Props = {
  params: { lang: string };
};

const Footer = async ({ params }: Props) => {
  const data = await getFooterByLang(params.lang);

  const {
    logo,
    socialLinks,
    companyTitle,
    companyParagraphs,
    vatNumber,
    contactTitle,
    contacts,
    newsletterTitle,
    newsletterButtonLabel,
    copyright,
    policyLinks,
  } = data;

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className="container"></div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomWrapper}>
            <div className={styles.bottomLeft}>
              <p className={styles.paragraph}>{copyright}</p>
            </div>
            <div className={styles.bottomRight}>
              <div className={styles.policyLinks}>
                {policyLinks.map(
                  (
                    policyLink: FooterLink // Укажите тип для policyLink
                  ) => (
                    <Link
                      href={policyLink.link}
                      key={policyLink._key}
                      className={styles.policyLink}
                    >
                      {policyLink.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
