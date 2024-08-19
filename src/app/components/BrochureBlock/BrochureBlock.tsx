import React, { FC } from "react";
import styles from "./BrochureBlock.module.scss";
import { Brochure } from "@/types/homepage";
import { ButtonModal } from "../ButtonModal/ButtonModal";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  brochure: Brochure;
};

import checkMark from "../../../../public/checkmark.png";

const BrochureBlock: FC<Props> = ({ brochure }) => {
  const { logo, title, subtitle, description, list, buttonLabel, image } =
    brochure;

  return (
    <section className={styles.brochureBlock} id="brochure">
      <div className="container">
        <div className={styles.brochure}>
          <div className={styles.content}>
            <div className={styles.contentStart}>
              <div className={styles.startImage}>
                <Image
                  alt={title}
                  src={urlFor(logo).url()}
                  width={80}
                  height={80}
                  className={styles.logo}
                />
              </div>
              <div className={styles.startText}>
                <div className={styles.title}>{title}</div>
                <div className={styles.subtitle}>{subtitle}</div>
              </div>
            </div>
            <div className={styles.description}>{description}</div>
            <ul className={styles.list}>
              {list.map((item, index) => (
                <li key={index} className={styles.listItem}>
                  <Image
                    alt="checkmark"
                    src={checkMark}
                    width={20}
                    height={20}
                    className={styles.checkMark}
                  />
                  {item.listItem}
                </li>
              ))}
            </ul>
            <ButtonModal className={styles.customButtonClass}>
              {buttonLabel}
            </ButtonModal>
          </div>
          <div className={styles.imageBlock}>
            <Image
              alt={title}
              src={urlFor(image).url()}
              width={1000}
              height={700}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrochureBlock;
