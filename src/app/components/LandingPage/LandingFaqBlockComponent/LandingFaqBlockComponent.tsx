import { LandingFaqBlock, LandingTextFirst } from "@/types/blog";
import React, { FC } from "react";
import styles from "./LandingFaqBlockComponent.module.scss";
import AccordionContainer from "../../AccordionContainer/AccordionContainer";

type Props = {
  block: LandingFaqBlock;
};

const LandingFaqBlockComponent: FC<Props> = ({ block }) => {
  console.log("block", block);
  return (
    <section className={styles.faqBlockComponent}>
      <div className="container-short">
        <h2 className={styles.title}>{block.title}</h2>
        <AccordionContainer block={block.faq} />
      </div>
      <h2 className={styles.title}>{block.title}</h2>
    </section>
  );
};

export default LandingFaqBlockComponent;
