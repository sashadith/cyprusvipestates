"use client";
import React from "react";
import { useWindowScroll } from "react-use";
import styles from "./ParallaxImage.module.scss";
import { Image as ImageType } from "@/types/homepage";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  image: ImageType;
};

const ParallaxImage: React.FC<Props> = ({ image }) => {
  const { y } = useWindowScroll();

  const parallaxStyle = {
    backgroundPositionY: `${y * 0.3}px`, // Параллакс эффект через backgroundPosition
  };

  return (
    <div
      className={styles.parallaxWrapper}
      style={{
        backgroundImage: `url(${urlFor(image).url()})`,
        ...parallaxStyle,
      }}
    ></div>
  );
};

export default ParallaxImage;
