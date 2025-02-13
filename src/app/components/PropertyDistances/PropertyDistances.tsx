import React, { FC } from "react";
import styles from "./PropertyDistances.module.scss";
import Image from "next/image";
import { Distances } from "@/types/project";

type Props = {
  distances: Distances;
};

const PropertyDistances: FC<Props> = ({ distances }) => {
  return (
    <section className={styles.propertyDistances}>
      <div className="container">
        <div className={styles.distances}>
          {distances.beach && (
            <div className={styles.distance}>
              <div className={styles.imageBlock}>
                <Image
                  alt="Icon for beach"
                  src="/icons/beach.png"
                  width={70}
                  height={70}
                  className={styles.image}
                />
              </div>
              <div className={styles.distanceContent}>
                <p className={styles.distanceValue}>
                  {distances.beach} to beach
                </p>
              </div>
            </div>
          )}
          {distances.shops && (
            <div className={styles.distance}>
              <div className={styles.imageBlock}>
                <Image
                  alt="Icon for shops"
                  src="/icons/shops.png"
                  width={70}
                  height={70}
                  className={styles.image}
                />
              </div>
              <div className={styles.distanceContent}>
                <p className={styles.distanceValue}>
                  {distances.shops} to shops
                </p>
              </div>
            </div>
          )}
          {distances.airport && (
            <div className={styles.distance}>
              <div className={styles.imageBlock}>
                <Image
                  alt="Icon for airport"
                  src="/icons/airport.png"
                  width={70}
                  height={70}
                  className={styles.image}
                />
              </div>
              <div className={styles.distanceContent}>
                <p className={styles.distanceValue}>
                  {distances.airport} to airport
                </p>
              </div>
            </div>
          )}
          {distances.hospital && (
            <div className={styles.distance}>
              <div className={styles.imageBlock}>
                <Image
                  alt="Icon for hospital"
                  src="/icons/hospital.png"
                  width={70}
                  height={70}
                  className={styles.image}
                />
              </div>
              <div className={styles.distanceContent}>
                <p className={styles.distanceValue}>
                  {distances.hospital} to hospital
                </p>
              </div>
            </div>
          )}
          {distances.school && (
            <div className={styles.distance}>
              <div className={styles.imageBlock}>
                <Image
                  alt="Icon for school"
                  src="/icons/school.png"
                  width={70}
                  height={70}
                  className={styles.image}
                />
              </div>
              <div className={styles.distanceContent}>
                <p className={styles.distanceValue}>
                  {distances.school} to school
                </p>
              </div>
            </div>
          )}
          {distances.cityCenter && (
            <div className={styles.distance}>
              <div className={styles.imageBlock}>
                <Image
                  alt="Icon for city center"
                  src="/icons/city-center.png"
                  width={70}
                  height={70}
                  className={styles.image}
                />
              </div>
              <div className={styles.distanceContent}>
                <p className={styles.distanceValue}>
                  {distances.cityCenter} to city center
                </p>
              </div>
            </div>
          )}
          {distances.golfCourt && (
            <div className={styles.distance}>
              <div className={styles.imageBlock}>
                <Image
                  alt="Icon for golf court"
                  src="/icons/golf-court.png"
                  width={70}
                  height={70}
                  className={styles.image}
                />
              </div>
              <div className={styles.distanceContent}>
                <p className={styles.distanceValue}>
                  {distances.golfCourt} to golf court
                </p>
              </div>
            </div>
          )}
          {distances.restaurants && (
            <div className={styles.distance}>
              <div className={styles.imageBlock}>
                <Image
                  alt="Icon for restaurants"
                  src="/icons/restaurants.png"
                  width={70}
                  height={70}
                  className={styles.image}
                />
              </div>
              <div className={styles.distanceContent}>
                <p className={styles.distanceValue}>
                  {distances.restaurants} to restaurants
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyDistances;
