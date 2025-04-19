import React, { FC } from "react";
import styles from "./HowWeWorkBlock.module.scss";
import { HowWeWorkBlock as HowWeWorkBlockType } from "@/types/homepage";

type Props = {
  work: HowWeWorkBlockType;
};

const HowWeWorkBlock: FC<Props> = ({ work }) => {
  if (!work || work.steps.length === 0) {
    return null;
  }

  return (
    <section className={styles.howWeWorkBlock}>
      <div className="container">
        {work.title && <h2 className="h2">{work.title}</h2>}
      </div>
    </section>
  );
};

export default HowWeWorkBlock;
