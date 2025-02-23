// components/StyledProjectFilters.tsx
import React from "react";
import styles from "./StyledProjectFilters.module.scss";
import FloatingSelect, { OptionType } from "../FloatingSelect/FloatingSelect";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";

type ProjectFiltersProps = {
  lang: string;
  city: string;
  priceFrom?: number | string | null;
  priceTo?: number | string | null;
  propertyType?: string;
};

const cityOptions: OptionType[] = [
  { label: "All cities", value: "" },
  { label: "Paphos", value: "Paphos" },
  { label: "Limassol", value: "Limassol" },
  { label: "Larnaca", value: "Larnaca" },
];

const propertyTypeOptionsByLang: Record<string, OptionType[]> = {
  en: [
    { label: "All types", value: "" },
    { label: "Apartment", value: "Apartment" },
    { label: "Villa", value: "Villa" },
    { label: "Townhouse", value: "Townhouse" },
    { label: "Semi-detached villa", value: "Semi-detached villa" },
    { label: "Office", value: "Office" },
    { label: "Shop", value: "Shop" },
  ],
  de: [
    { label: "Alle Typen", value: "" },
    { label: "Apartment", value: "Apartment" },
    { label: "Villa", value: "Villa" },
    { label: "Reihenhaus", value: "Townhouse" },
    { label: "Halb freistehende Villa", value: "Semi-detached villa" },
    { label: "Büro", value: "Office" },
    { label: "Geschäft", value: "Shop" },
  ],
  ru: [
    { label: "Все типы", value: "" },
    { label: "Квартира", value: "Apartment" },
    { label: "Вилла", value: "Villa" },
    { label: "Таунхаус", value: "Townhouse" },
    { label: "Двойной дом", value: "Semi-detached villa" },
    { label: "Офис", value: "Office" },
    { label: "Магазин", value: "Shop" },
  ],
  pl: [
    { label: "Wszystkie typy", value: "" },
    { label: "Mieszkanie", value: "Apartment" },
    { label: "Willa", value: "Villa" },
    { label: "Dom szeregowy", value: "Townhouse" },
    { label: "Willa bliźniacza", value: "Semi-detached villa" },
    { label: "Biuro", value: "Office" },
    { label: "Sklep", value: "Shop" },
  ],
};

const StyledProjectFilters: React.FC<ProjectFiltersProps> = ({
  lang,
  city,
  priceFrom,
  priceTo,
  propertyType,
}) => {
  return (
    <form method="get" className={styles.form}>
      <div className={styles.formElements}>
        <FloatingSelect
          label={
            lang === "en"
              ? "City"
              : lang === "de"
                ? "Stadt"
                : lang === "pl"
                  ? "Miasto"
                  : lang === "ru"
                    ? "Город"
                    : "City"
          }
          name="city"
          options={cityOptions.map((opt) => ({
            label:
              lang === "en"
                ? opt.label
                : lang === "de"
                  ? opt.label // при необходимости можно добавить перевод
                  : lang === "pl"
                    ? opt.label
                    : lang === "ru"
                      ? opt.label
                      : opt.label,
            value: opt.value,
          }))}
          defaultValue={
            city
              ? cityOptions.find((option) => option.value === city) || null
              : null
          }
        />

        <FloatingLabelInput
          label="Price from"
          name="priceFrom"
          type="number"
          defaultValue={priceFrom ? String(priceFrom) : ""}
        />

        <FloatingLabelInput
          label="Price to"
          name="priceTo"
          type="number"
          defaultValue={priceTo ? String(priceTo) : ""}
        />

        <FloatingSelect
          label={
            lang === "en"
              ? "Property Type"
              : lang === "de"
                ? "Immobilientyp"
                : lang === "pl"
                  ? "Typ nieruchomości"
                  : lang === "ru"
                    ? "Тип недвижимости"
                    : "Property Type"
          }
          name="propertyType"
          options={
            propertyTypeOptionsByLang[lang] || propertyTypeOptionsByLang["en"]
          }
          defaultValue={
            propertyType
              ? (
                  propertyTypeOptionsByLang[lang] ||
                  propertyTypeOptionsByLang["en"]
                ).find((option) => option.value === propertyType) || null
              : null
          }
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button type="submit" className={styles.button}>
          {lang === "en"
            ? "Apply filters"
            : lang === "de"
              ? "Filter anwenden"
              : lang === "pl"
                ? "Zastosuj filtry"
                : lang === "ru"
                  ? "Применить фильтры"
                  : "Apply filters"}
        </button>
      </div>
    </form>
  );
};

export default StyledProjectFilters;
