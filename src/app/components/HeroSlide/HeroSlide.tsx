import { File, Image as ImageType } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./HeroSlide.module.scss";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  image: ImageType;
  title: string;
  description: string;
  linkLabel?: string;
  linkDestination?: string;
  fileLabel?: string;
  file?: File;
};

const HeroSlide: FC<Props> = ({
  image,
  title,
  description,
  linkLabel,
  linkDestination,
  fileLabel,
  file,
}) => {
  console.log("file", file);
  return (
    <div className={styles.slide}>
      <Image
        alt={title}
        src={urlFor(image).url()}
        fill={true}
        className={styles.imagePoster}
      />
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {linkLabel && linkDestination && (
          <a href={linkDestination} className={styles.link}>
            {linkLabel}
          </a>
        )}
        {/* {fileLabel && file && (
          <a href={urlFor(file).url()} className={styles.link}>
            {fileLabel}
          </a>
        )} */}
      </div>
    </div>
  );
};

export default HeroSlide;
