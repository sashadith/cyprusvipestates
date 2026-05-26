"use client";

import React from "react";
import AccordionContainer from "../AccordionContainer/AccordionContainer";
import { FaqSection } from "@/types/homepage";
import styles from "./FaqHomepage.module.scss";

type Props = {
  faqSection?: FaqSection;
};

const FaqHomepage = ({ faqSection }: Props) => {
  if (!faqSection?.faq?.faq?.items?.length) return null;

  return (
    <section className={styles.section}>
      <div className="container-short">
        {faqSection.faqTitle && (
          <h2 className={styles.title}>{faqSection.faqTitle}</h2>
        )}

        <AccordionContainer block={faqSection.faq.faq} />
      </div>
    </section>
  );
};

export default FaqHomepage;
