import React, { FC } from "react";
import styles from "./BrochureBlock.module.scss";
import { Brochure } from "@/types/homepage";
import { ButtonModal } from "../ButtonModal/ButtonModal";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  brochure: Brochure;
};

const BrochureBlock: FC<Props> = ({ brochure }) => {
  const { title, description, buttonLabel, image } = brochure;

  return (
    <section className={styles.brochureBlock}>
      <div className="container">
        <div className={styles.brochure}>
          <div className={styles.content}>
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
            <ButtonModal className={styles.customButtonClass}>
              {buttonLabel}
            </ButtonModal>
          </div>
          <div className={styles.imageBlock}>
            <Image
              alt={title}
              src={urlFor(image).url()}
              width={750}
              height={500}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrochureBlock;
