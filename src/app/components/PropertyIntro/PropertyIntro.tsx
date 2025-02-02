import { ImageAlt } from "@/types/property";
import React, { FC } from "react";
import styles from "./PropertyIntro.module.scss";
import {
  FaArrowsToCircle,
  FaLocationDot,
  FaHouseCircleCheck,
  FaBuilding,
  FaElevator,
  FaMoneyBill,
  FaBoxArchive,
  FaChalkboard,
  FaSquareParking,
  FaPeopleRoof,
  FaHouseFlag,
} from "react-icons/fa6";
import PropertyPhotoGallery from "../PropertyPhotoGallery/PropertyPhotoGallery";
import { ButtonModal } from "../ButtonModal/ButtonModal";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  title: string;
  excerpt: string;
  previewImage: ImageAlt;
  price: number;
  images: ImageAlt[];
  videoId?: string;
  floorSize: number;
  rooms: number;
  lang: string;
};

const PropertyIntro: FC<Props> = ({
  title,
  excerpt,
  previewImage,
  price,
  images,
  videoId,
  floorSize,
  rooms,
  lang,
}) => {
  // console.log("data", excerpt, previewImage);
  return (
    <section className={styles.popertyIntro}>
      <Image
        alt={previewImage.alt || title}
        src={urlFor(previewImage).url()}
        fill={true}
        className={styles.imagePoster}
      />
      <div className={`container ${styles.contentInner}`}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{excerpt}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyIntro;
