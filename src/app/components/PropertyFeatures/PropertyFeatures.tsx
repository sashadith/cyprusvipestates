import React, { FC } from "react";
import styles from "./PropertyFeatures.module.scss";
import { PropertyType } from "@/types/homepage";
import { KeyFeatures } from "@/types/project";

type Props = {
  keyFeatures: KeyFeatures;
  lang: string;
};

const PropertyFeatures: FC<Props> = ({ keyFeatures, lang }) => {
  return (
    <section className={styles.propertyFeatures}>
      <div className={styles.propertyFeaturesInner}>
        <p className={styles.featuresTitle}>
          {lang === "en"
            ? "Key features"
            : lang === "de"
              ? "Hauptmerkmale"
              : lang === "pl"
                ? "Kluczowe cechy"
                : lang === "ru"
                  ? "Основные характеристики"
                  : "Key features"}
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
              {keyFeatures.city ? (
                <div className={styles.featureValue}>{keyFeatures.city}</div>
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
              {keyFeatures.propertyType ? (
                <div className={styles.featureValue}>
                  {keyFeatures.propertyType}
                </div>
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
                  ? "Bedrooms"
                  : lang === "de"
                    ? "Schlafzimmer"
                    : lang === "pl"
                      ? "Sypialnie"
                      : lang === "ru"
                        ? "Спальни"
                        : "Bedrooms"}
              </div>
              <div className={styles.featureValue}>{keyFeatures.bedrooms}</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureText}>
                {lang === "en"
                  ? "Covered area"
                  : lang === "de"
                    ? "Überdachte Fläche"
                    : lang === "pl"
                      ? "Powierzchnia zadaszona"
                      : lang === "ru"
                        ? "Площадь крытая"
                        : "Covered area"}
              </div>
              <div className={styles.featureValue}>
                {keyFeatures.coveredArea}
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureText}>
                {lang === "en"
                  ? "Plot size"
                  : lang === "de"
                    ? "Grundstücksgröße"
                    : lang === "pl"
                      ? "Powierzchnia działki"
                      : lang === "ru"
                        ? "Площадь участка"
                        : "Plot size"}
              </div>
              <div className={styles.featureValue}>
                {keyFeatures.plotSize} m²
              </div>
            </div>
            {keyFeatures.energyEfficiency && (
              <div className={styles.feature}>
                <div className={styles.featureText}>
                  {lang === "en"
                    ? "Energy efficiency"
                    : lang === "de"
                      ? "Energieeffizienz"
                      : lang === "pl"
                        ? "Efektywność energetyczna"
                        : lang === "ru"
                          ? "Энергоэффективность"
                          : "Energy efficiency"}
                </div>
                <div className={styles.featureValue}>
                  {keyFeatures.energyEfficiency}
                </div>
              </div>
            )}
            {keyFeatures.price && (
              <div className={styles.feature}>
                <div className={styles.featureText}>
                  {lang === "en"
                    ? "Price from (+VAT)"
                    : lang === "de"
                      ? "Preis ab (+MwSt)"
                      : lang === "pl"
                        ? "Cena od (+VAT)"
                        : lang === "ru"
                          ? "Цена от (+НДС)"
                          : "Price from (+VAT)"}
                </div>
                <div className={styles.featureValue}>
                  {keyFeatures.price.toLocaleString()} €
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyFeatures;
