import { ImageAlt } from "@/types/property";
import React, { FC } from "react";
import styles from "./CaseStudyIntro.module.scss";
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
  lang: string;
  isSold: boolean;
};

const CaseStudyIntro: FC<Props> = ({
  title,
  excerpt,
  previewImage,
  videoId,
  videoPreview,
  lang,
  isSold,
}) => {
  return (
    <section className={styles.popertyIntro}>
      <div className={styles.overlay}></div>
      <ResponsiveMedia
        title={title}
        previewImage={previewImage}
        videoId={videoId}
        videoPreview={videoPreview}
      />
      <div className={`container ${styles.contentInner}`}>
        <div className={styles.content}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{excerpt}</p>
            <div className={styles.button}>
              <ButtonModal>
                {lang === "en"
                  ? "Request Personal Offer"
                  : lang === "de"
                    ? "Persönliches Angebot anfordern"
                    : lang === "pl"
                      ? "Poproś o indywidualną ofertę"
                      : lang === "ru"
                        ? "Запросить персональное предложение"
                        : "Request Personal Offer"}
              </ButtonModal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyIntro;
