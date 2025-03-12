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
import ResponsiveMedia from "../ResponsiveMedia/ResponsiveMedia";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  title: string;
  excerpt: string;
  previewImage: ImageAlt;
  videoId?: string;
  videoPreview?: ImageAlt;
};

const PropertyIntro: FC<Props> = ({
  title,
  excerpt,
  previewImage,
  videoId,
  videoPreview,
}) => {
  return (
    <section className={styles.popertyIntro}>
      <ResponsiveMedia
        title={title}
        previewImage={previewImage}
        videoId={videoId}
        videoPreview={videoPreview}
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
