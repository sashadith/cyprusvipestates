import React, { FC } from "react";
import styles from "./DeveloperIntro.module.scss";
import { ImageAlt } from "@/types/property";
import { urlFor } from "@/sanity/sanity.client";
import Image from "next/image";

type Props = {
  titleFull: string;
  excerpt?: string;
  logo: ImageAlt;
};

const DeveloperIntro: FC<Props> = ({ titleFull, excerpt, logo }) => {
  return (
    <section className={styles.developerIntro}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <h1 className={styles.title}>{titleFull}</h1>
            {excerpt && <p className={styles.description}>{excerpt}</p>}
          </div>
          <div className={styles.logo}>
            <Image
              alt={logo.alt || titleFull}
              src={urlFor(logo).url()}
              width={200}
              height={200}
              className="imagePoster"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperIntro;
