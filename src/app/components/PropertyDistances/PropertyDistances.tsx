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
                  src="https://cdn.sanity.io/files/88gk88s2/production/21910cdeda8b4c0b1273cb9e487ea1c16873fcd7.png"
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
                  src="https://cdn.sanity.io/files/88gk88s2/production/91095253a8e1d58c1f8eb5a5356c3ec11e1f7d31.png"
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
                  src="https://cdn.sanity.io/files/88gk88s2/production/a9935ed23f1f65da3447f3a896c879659619badd.png"
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
                  src="https://cdn.sanity.io/files/88gk88s2/production/87c44c6343496d1f4e1990505b571ae0b959d7e9.png"
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
                  src="https://cdn.sanity.io/files/88gk88s2/production/080c0ffcaa49fb8967915d21cadcd6b2b286b5d3.png"
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
                  src="https://cdn.sanity.io/files/88gk88s2/production/18fd16655d5281fa114048456caee2eeffcb2b73.png"
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
                  src="https://cdn.sanity.io/files/88gk88s2/production/d72f5770e677f6830968baefeb4129ee9da2acc3.png"
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
          {/* {distances.restaurants && (
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
          )} */}
        </div>
      </div>
    </section>
  );
};

export default PropertyDistances;
