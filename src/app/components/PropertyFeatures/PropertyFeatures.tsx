import React, { FC } from "react";
import styles from "./PropertyFeatures.module.scss";
import { PropertyType } from "@/types/homepage";

type Props = {
  city: string;
  district: string;
  type: PropertyType;
  rooms: number;
  floorSize: number;
  hasParking?: boolean;
  hasPool?: boolean;
  lang: string;
};

const PropertyFeatures: FC<Props> = ({
  city,
  district,
  type,
  rooms,
  floorSize,
  hasParking,
  hasPool,
  lang,
}) => {
  return (
    <section className={styles.propertyFeatures}>
      <div className="container">
        <div className={styles.propertyFeaturesInner}>
          <p className={styles.featuresTitle}>
            {lang === "en"
              ? "Property Features"
              : lang === "de"
                ? "Eigenschaften der Immobilie"
                : lang === "pl"
                  ? "Cechy nieruchomości"
                  : lang === "ru"
                    ? "Характеристики недвижимости"
                    : "Property Features"}
          </p>
          <div className={styles.features}>
            <div className={styles.featuresWrapper}>
              <div className={styles.feature}>
                <div className={styles.featureText}>
                  {lang === "en"
                    ? "City"
                    : lang === "de"
                      ? "Stadt"
                      : lang === "pl"
                        ? "Miasto"
                        : lang === "ru"
                          ? "Город"
                          : "City"}
                </div>
                {city ? (
                  <div className={styles.featureValue}>{city}</div>
                ) : (
                  <div className={styles.featureNoValue}>
                    {lang === "en"
                      ? "Not available"
                      : lang === "de"
                        ? "Nicht verfügbar"
                        : lang === "pl"
                          ? "Niedostępne"
                          : lang === "ru"
                            ? "Недоступно"
                            : "Not available"}
                  </div>
                )}
              </div>
              <div className={styles.feature}>
                <div className={styles.featureText}>
                  {lang === "en"
                    ? "District"
                    : lang === "de"
                      ? "Bezirk"
                      : lang === "pl"
                        ? "Dzielnica"
                        : lang === "ru"
                          ? "Район"
                          : "District"}
                </div>
                {district ? (
                  <div className={styles.featureValue}>{district}</div>
                ) : (
                  <div className={styles.featureNoValue}>
                    {lang === "en"
                      ? "Not available"
                      : lang === "de"
                        ? "Nicht verfügbar"
                        : lang === "pl"
                          ? "Niedostępne"
                          : lang === "ru"
                            ? "Недоступно"
                            : "Not available"}
                  </div>
                )}
              </div>
              <div className={styles.feature}>
                <div className={styles.featureText}>
                  {lang === "en"
                    ? "Type"
                    : lang === "de"
                      ? "Typ"
                      : lang === "pl"
                        ? "Typ"
                        : lang === "ru"
                          ? "Тип"
                          : "Type"}
                </div>
                <div className={styles.featureValue}>{type}</div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureText}>
                  {lang === "en"
                    ? "Rooms"
                    : lang === "de"
                      ? "Zimmer"
                      : lang === "pl"
                        ? "Pokoje"
                        : lang === "ru"
                          ? "Комнаты"
                          : "Rooms"}
                </div>
                <div className={styles.featureValue}>{rooms}</div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureText}>
                  {lang === "en"
                    ? "Floor size"
                    : lang === "de"
                      ? "Größe"
                      : lang === "pl"
                        ? "Rozmiar"
                        : lang === "ru"
                          ? "Размер"
                          : "Floor size"}
                </div>
                <div className={styles.featureValue}>{floorSize} m²</div>
              </div>
              {hasParking && (
                <div className={styles.feature}>
                  <div className={styles.featureText}>
                    {lang === "en"
                      ? "Parking"
                      : lang === "de"
                        ? "Parkplatz"
                        : lang === "pl"
                          ? "Parking"
                          : lang === "ru"
                            ? "Парковка"
                            : "Parking"}
                  </div>
                  <div className={styles.featureValue}>
                    {lang === "en"
                      ? "Yes"
                      : lang === "de"
                        ? "Ja"
                        : lang === "pl"
                          ? "Tak"
                          : lang === "ru"
                            ? "Да"
                            : "Yes"}
                  </div>
                </div>
              )}
              {hasPool && (
                <div className={styles.feature}>
                  <div className={styles.featureText}>
                    {lang === "en"
                      ? "Pool"
                      : lang === "de"
                        ? "Schwimmbad"
                        : lang === "pl"
                          ? "Basen"
                          : lang === "ru"
                            ? "Бассейн"
                            : "Pool"}
                  </div>
                  <div className={styles.featureValue}>
                    {lang === "en"
                      ? "Yes"
                      : lang === "de"
                        ? "Ja"
                        : lang === "pl"
                          ? "Tak"
                          : lang === "ru"
                            ? "Да"
                            : "Yes"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyFeatures;
