import { Distances } from "@/types/property";
import React, { FC } from "react";
import styles from "./PropertyDistances.module.scss";
import {
  FaMapLocationDot,
  FaAnchor,
  FaPlane,
  FaBasketShopping,
  FaSchool,
  FaGolfBallTee,
} from "react-icons/fa6";
import { DistanceItem } from "@/types/project";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  distances: DistanceItem[];
};

const PropertyDistances: FC<Props> = ({ distances }) => {
  return (
    <section className={styles.propertyDistances}>
      <div className="container">
        <div className={styles.distances}>
          {distances.map((distance) => (
            <div key={distance._key} className={styles.distance}>
              <div className={styles.imageBlock}>
                <Image
                  alt={distance.icon.alt || ""}
                  src={urlFor(distance.icon).url()}
                  width={70}
                  height={70}
                  className={styles.image}
                />
              </div>
              <div className={styles.distanceContent}>
                <p className={styles.distanceLabel}>{distance.label}</p>
                <p className={styles.distanceValue}>{distance.value}</p>
              </div>
            </div>
          ))}
        </div>
        {/* <div className={styles.distances}>
          <div className={styles.distance}>
            <FaMapLocationDot fontSize="2.5rem" color="#aa7f2e" />
            <p className={styles.distanceText}>
              {distances.toCenter} to center
            </p>
          </div>
          <div className={styles.distance}>
            <FaAnchor fontSize="2.5rem" color="#aa7f2e" />
            <p className={styles.distanceText}>{distances.toBeach} to beach</p>
          </div>
          <div className={styles.distance}>
            <FaPlane fontSize="2.5rem" color="#aa7f2e" />
            <p className={styles.distanceText}>
              {distances.toAirport} to airport
            </p>
          </div>
          <div className={styles.distance}>
            <FaBasketShopping fontSize="2.5rem" color="#aa7f2e" />
            <p className={styles.distanceText}>{distances.toShop} to shop</p>
          </div>
          <div className={styles.distance}>
            <FaSchool fontSize="2.5rem" color="#aa7f2e" />
            <p className={styles.distanceText}>
              {distances.toSchool} to school
            </p>
          </div>
          <div className={styles.distance}>
            <FaGolfBallTee fontSize="2.5rem" color="#aa7f2e" />
            <p className={styles.distanceText}>
              {distances.toGolf} to golf court
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default PropertyDistances;
