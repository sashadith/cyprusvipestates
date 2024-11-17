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

type Props = {
  distances: Distances;
};

const PropertyDistances: FC<Props> = ({ distances }) => {
  return (
    <section className={styles.propertyDistances}>
      <div className="container">
        <div className={styles.distances}>
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
        </div>
      </div>
    </section>
  );
};

export default PropertyDistances;
