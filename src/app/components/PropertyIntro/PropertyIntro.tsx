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

type Props = {
  title: string;
  price: number;
  images: ImageAlt[];
  videoId?: string;
  floorSize: number;
  rooms: number;
  lang: string;
};

const PropertyIntro: FC<Props> = ({
  title,
  price,
  images,
  videoId,
  floorSize,
  rooms,
  lang,
}) => {
  // console.log("floorSize", floorSize);
  return (
    <section className={styles.popertyIntro}>
      <div className="container">
        {/* <div className={styles.wrapper}> */}
        {/* <div className={styles.gallery}>
            <PropertyPhotoGallery
              photos={images}
              videoId={videoId}
              lang={lang}
            />
          </div> */}
        <div className={styles.info}>
          <div className={styles.content}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.price}>
              {lang === "en"
                ? "Price: "
                : lang === "de"
                  ? "Preis: "
                  : lang === "pl"
                    ? "Cena: "
                    : lang === "ru"
                      ? "Цена: "
                      : "Price: "}
              <span>{price.toLocaleString("en-US")} €</span>
            </div>
          </div>
          <div className={styles.details}>
            <div className={styles.detailsWrapper}>
              <div className={styles.options}>
                <div className={styles.option}>
                  <FaArrowsToCircle fontSize="2.5rem" color="#aa7f2e" />
                  <p className={styles.optionText}>
                    {lang === "en"
                      ? "Area: "
                      : lang === "de"
                        ? "Fläche: "
                        : lang === "pl"
                          ? "Powierzchnia: "
                          : lang === "ru"
                            ? "Площадь: "
                            : "Area: "}
                    {floorSize} m²
                  </p>
                </div>
                <div className={styles.option}>
                  <FaHouseCircleCheck fontSize="2.5rem" color="#aa7f2e" />
                  <p className={styles.optionText}>
                    {lang === "en"
                      ? "Rooms: "
                      : lang === "de"
                        ? "Zimmer: "
                        : lang === "pl"
                          ? "Pokoje: "
                          : lang === "ru"
                            ? "Комнаты: "
                            : "Rooms: "}
                    {rooms}
                  </p>
                </div>
              </div>
              <div className={styles.buttonBlock}>
                <ButtonModal>
                  {lang === "en"
                    ? "Request a call"
                    : lang === "de"
                      ? "Rufen Sie an"
                      : lang === "pl"
                        ? "Zadzwoń"
                        : lang === "ru"
                          ? "Заказать звонок"
                          : "Request a call"}
                </ButtonModal>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </section>
  );
};

export default PropertyIntro;
