"use client";

import React, { useCallback, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingSelect, { OptionType } from "../FloatingSelect/FloatingSelect";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";
import styles from "./StyledProjectFilters.module.scss";

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

type ProjectFiltersProps = {
  lang: string;
  city: string;
  priceFrom?: number | string | null;
  priceTo?: number | string | null;
  propertyType?: string;
};

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

export default function StyledProjectFilters({
  lang,
  city,
  priceFrom,
  priceTo,
  propertyType,
}: ProjectFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const cityOptions = cityOptionsByLang[lang];
  const typeOptions = propertyTypeOptionsByLang[lang];

  const updateQuery = useCallback(
    (next: Record<string, unknown>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(next).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      params.delete("page");

      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition]
  );

  const debouncedUpdate = useMemo(
    () => debounce(updateQuery, 300),
    [updateQuery]
  );

  const cityDefault = city
    ? (cityOptions.find((o) => o.value === city) ?? null)
    : null;
  const typeDefault = propertyType
    ? (typeOptions.find((o) => o.value === propertyType) ?? null)
    : null;

  const labelCity =
    lang === "de"
      ? "Stadt"
      : lang === "ru"
        ? "Город"
        : lang === "pl"
          ? "Miasto"
          : "City";
  const labelPriceFrom =
    lang === "de"
      ? "Preis von (€)"
      : lang === "ru"
        ? "Цена от (€)"
        : lang === "pl"
          ? "Cena od (€)"
          : "Price from (€)";
  const labelPriceTo =
    lang === "de"
      ? "Preis bis (€)"
      : lang === "ru"
        ? "Цена до (€)"
        : lang === "pl"
          ? "Cena do (€)"
          : "Price to (€)";
  const labelPropertyType =
    lang === "de"
      ? "Immobilientyp"
      : lang === "ru"
        ? "Тип недвижимости"
        : lang === "pl"
          ? "Typ nieruchomości"
          : "Property Type";
  const labelReset =
    lang === "de"
      ? "Zurücksetzen"
      : lang === "ru"
        ? "Сбросить"
        : lang === "pl"
          ? "Resetuj"
          : "Reset";

  return (
    <div className={styles.form}>
      <div className={styles.formElements}>
        <FloatingSelect
          label={labelCity}
          name="city"
          options={cityOptions}
          defaultValue={cityDefault}
          onChange={(opt) => updateQuery({ city: opt?.value ?? "" })}
        />

        <FloatingLabelInput
          label={labelPriceFrom}
          name="priceFrom"
          type="number"
          defaultValue={priceFrom != null ? String(priceFrom) : ""}
          onChange={(e) => debouncedUpdate({ priceFrom: e.target.value })}
          className={styles.input}
        />

        <FloatingLabelInput
          label={labelPriceTo}
          name="priceTo"
          type="number"
          defaultValue={priceTo != null ? String(priceTo) : ""}
          onChange={(e) => debouncedUpdate({ priceTo: e.target.value })}
          className={styles.input}
        />

        <FloatingSelect
          label={labelPropertyType}
          name="propertyType"
          options={typeOptions}
          defaultValue={typeDefault}
          onChange={(opt) => updateQuery({ propertyType: opt?.value ?? "" })}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button
          type="button"
          className={styles.button}
          onClick={() =>
            updateQuery({
              city: "",
              priceFrom: "",
              priceTo: "",
              propertyType: "",
            })
          }
        >
          {labelReset}
        </button>
      </div>
    </div>
  );
}
