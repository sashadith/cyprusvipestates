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

const cityOptionsByLang: Record<string, OptionType[]> = {
  en: [
    { label: "All cities", value: "" },
    { label: "Paphos", value: "Paphos" },
    { label: "Limassol", value: "Limassol" },
    { label: "Larnaca", value: "Larnaca" },
  ],
  de: [
    { label: "Alle Städte", value: "" },
    { label: "Paphos", value: "Paphos" },
    { label: "Limassol", value: "Limassol" },
    { label: "Larnaka", value: "Larnaca" },
  ],
  ru: [
    { label: "Все города", value: "" },
    { label: "Пафос", value: "Paphos" },
    { label: "Лимассол", value: "Limassol" },
    { label: "Ларнака", value: "Larnaca" },
  ],
  pl: [
    { label: "Wszystkie miasta", value: "" },
    { label: "Pafos", value: "Paphos" },
    { label: "Limasol", value: "Limassol" },
    { label: "Larnaka", value: "Larnaca" },
  ],
};

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
  const cityOptions = cityOptionsByLang[lang] || cityOptionsByLang["en"];
  const propertyTypeOptions =
    propertyTypeOptionsByLang[lang] || propertyTypeOptionsByLang["en"];

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
          options={cityOptions}
          defaultValue={
            city ? cityOptions.find((opt) => opt.value === city) || null : null
          }
        />

        <FloatingLabelInput
          label={
            lang === "en"
              ? "Price from (€)"
              : lang === "de"
                ? "Preis von (€)"
                : lang === "pl"
                  ? "Cena od (€)"
                  : lang === "ru"
                    ? "Цена от (€)"
                    : "Price from (€)"
          }
          name="priceFrom"
          type="number"
          defaultValue={priceFrom ? String(priceFrom) : ""}
        />

        <FloatingLabelInput
          label={
            lang === "en"
              ? "Price to (€)"
              : lang === "de"
                ? "Preis bis (€)"
                : lang === "pl"
                  ? "Cena do (€)"
                  : lang === "ru"
                    ? "Цена до (€)"
                    : "Price to (€)"
          }
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
          options={propertyTypeOptions}
          defaultValue={
            propertyType
              ? propertyTypeOptions.find((opt) => opt.value === propertyType) ||
                null
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
