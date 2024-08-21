"use client";
import React, { useState } from "react";
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

  const [scrollY, setScrollY] = useState(0);
  const isBrowser = typeof window !== "undefined";
  const isMobile = isBrowser ? window.innerWidth <= 480 : false;
  const isIOSMobile =
    isBrowser && /iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div
      className={isIOSMobile ? styles.parallaxMobile : styles.parallax}
      style={{
        backgroundImage: `url(${urlFor(image).url()})`,
        // ...parallaxStyle,
      }}
    ></div>
  );
};

export default ParallaxImage;
