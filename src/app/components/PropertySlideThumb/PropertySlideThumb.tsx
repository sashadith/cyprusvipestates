import { ImageAlt } from "@/types/property";
import React, { FC } from "react";
import styles from "./PropertySlideThumb.module.scss";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  image: ImageAlt;
};

const PropertySlideThumb: FC<Props> = ({ image }) => {
  return (
    <div className={styles.propertySlide}>
      <Image
        src={urlFor(image).url()}
        alt={image.alt || "default alt text"}
        className={styles.image}
        fill={true}
        unoptimized
      />
    </div>
  );
};

export default PropertySlideThumb;
