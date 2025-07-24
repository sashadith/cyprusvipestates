"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingSelect, { OptionType } from "../FloatingSelect/FloatingSelect";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";
import styles from "./StyledProjectFilters.module.scss";
import Image from "next/image";

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
  sort?: string;
  q?: string;
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
  sort,
  q,
}: ProjectFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const cityOptions = cityOptionsByLang[lang];
  const typeOptions = propertyTypeOptionsByLang[lang];

  const [cityValue, setCityValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [priceFromValue, setPriceFromValue] = useState("");
  const [priceToValue, setPriceToValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

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

  const handleReset = () => {
    setSearchValue("");
    setCityValue("");
    setPriceFromValue("");
    setPriceToValue("");
    setTypeValue("");
    setSortValue("");

    updateQuery({
      city: "",
      priceFrom: "",
      priceTo: "",
      propertyType: "",
      sort: "",
      q: "",
    });
  };

  const debouncedUpdate = useMemo(
    () => debounce(updateQuery, 700),
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

  useEffect(() => {
    setSearchValue(q || "");
  }, [q]);

  return (
    <div className={styles.form}>
      <div className={styles.bg}>
        <div className={styles.bgOverlay}></div>
        <Image
          src="https://cdn.sanity.io/files/88gk88s2/production/bef9ef8c1faaf4bb80be49714d5c345bc434b1e0.webp"
          alt="Search"
          fill
          className={styles.backgroundImage}
        />
      </div>
      <div className={`${styles.formWrapper} container`}>
        <h1 className="h2-white header-mt text-center">
          {lang === "en"
            ? "Luxury Real Estate Projects in Cyprus"
            : lang === "de" || lang === "ru"
              ? "Luxusimmobilien auf Zypern"
              : lang === "pl"
                ? "Luksusowe projekty nieruchomości na Cyprze"
                : "Luxury Real Estate Projects in Cyprus"}
        </h1>
        <div className={styles.formElements}>
          <FloatingSelect
            label={labelCity}
            name="city"
            options={cityOptions}
            value={
              cityValue === ""
                ? null
                : cityOptions.find((o) => o.value === cityValue) || null
            }
            onChange={(opt) => {
              const val = opt?.value ?? "";
              setCityValue(val);
              updateQuery({ city: val });
            }}
          />

          <FloatingSelect
            label={labelPropertyType}
            name="propertyType"
            options={typeOptions}
            value={
              typeValue === ""
                ? null
                : typeOptions.find((o) => o.value === typeValue) || null
            }
            onChange={(opt) => {
              const val = opt?.value ?? "";
              setTypeValue(val);
              updateQuery({ propertyType: val });
            }}
          />

          <FloatingLabelInput
            label={labelPriceFrom}
            name="priceFrom"
            type="number"
            value={String(priceFromValue)}
            onChange={(e) => {
              const val = e.target.value;
              setPriceFromValue(val);
              debouncedUpdate({ priceFrom: val });
            }}
            className={styles.input}
          />

          <FloatingLabelInput
            label={labelPriceTo}
            name="priceTo"
            type="number"
            value={String(priceToValue)}
            onChange={(e) => {
              const val = e.target.value;
              setPriceToValue(val);
              debouncedUpdate({ priceTo: val });
            }}
            className={styles.input}
          />

          <FloatingLabelInput
            label="Search by keyword"
            name="q"
            value={searchValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchValue(newValue);
              debouncedUpdate({ q: newValue });
            }}
            className={styles.keywordInput}
          />

          <FloatingSelect
            label="Sort by"
            name="sort"
            options={[
              { label: "Price: Low to High", value: "priceAsc" },
              { label: "Price: High to Low", value: "priceDesc" },
              { label: "Title: A–Z", value: "titleAsc" },
              { label: "Title: Z–A", value: "titleDesc" },
            ]}
            value={
              sortValue
                ? {
                    label:
                      sortValue === "priceAsc"
                        ? "Price: Low to High"
                        : sortValue === "priceDesc"
                          ? "Price: High to Low"
                          : sortValue === "titleAsc"
                            ? "Title: A–Z"
                            : "Title: Z–A",
                    value: sortValue,
                  }
                : null
            }
            onChange={(opt) => {
              const val = opt?.value ?? "";
              setSortValue(val);
              updateQuery({ sort: val });
            }}
          />

          <button type="button" className={styles.button} onClick={handleReset}>
            {labelReset}
          </button>
        </div>
      </div>
    </div>
  );
}
