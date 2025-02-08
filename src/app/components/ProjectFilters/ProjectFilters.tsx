// app/components/ProjectFilters/ProjectFilters.tsx
import React from "react";
import styles from "./ProjectFilters.module.scss";

type ProjectFiltersProps = {
  lang: string;
  city: string;
  priceFrom?: number | string | null;
  priceTo?: number | string | null;
  roomsFrom?: number | string | null;
  roomsTo?: number | string | null;
};

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  lang,
  city,
  priceFrom,
  priceTo,
  roomsFrom,
  roomsTo,
}) => {
  return (
    <form method="get" style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <label htmlFor="city">
            {lang === "en"
              ? "City"
              : lang === "de"
                ? "Stadt"
                : lang === "pl"
                  ? "Miasto"
                  : lang === "ru"
                    ? "Город"
                    : "City"}
            :{" "}
          </label>
          <select name="city" id="city" defaultValue={city}>
            <option value="">
              {lang === "en"
                ? "All cities"
                : lang === "de"
                  ? "Alle Städte"
                  : lang === "pl"
                    ? "Wszystkie miasta"
                    : lang === "ru"
                      ? "Все города"
                      : "All cities"}
            </option>
            <option value="Paphos">
              {lang === "en"
                ? "Paphos"
                : lang === "de"
                  ? "Paphos"
                  : lang === "pl"
                    ? "Pafos"
                    : lang === "ru"
                      ? "Пафос"
                      : "Paphos"}
            </option>
            <option value="Limassol">
              {lang === "en"
                ? "Limassol"
                : lang === "de"
                  ? "Limassol"
                  : lang === "pl"
                    ? "Limassol"
                    : lang === "ru"
                      ? "Лимассол"
                      : "Limassol"}
            </option>
            <option value="Larnaca">
              {lang === "en"
                ? "Larnaca"
                : lang === "de"
                  ? "Larnaca"
                  : lang === "pl"
                    ? "Larnaca"
                    : lang === "ru"
                      ? "Ларнака"
                      : "Larnaca"}
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="priceFrom">Price from: </label>
          <input
            type="number"
            name="priceFrom"
            id="priceFrom"
            defaultValue={priceFrom || ""}
          />
        </div>
        <div>
          <label htmlFor="priceTo">Price to: </label>
          <input
            type="number"
            name="priceTo"
            id="priceTo"
            defaultValue={priceTo || ""}
          />
        </div>
        <div>
          <label htmlFor="roomsFrom">Rooms from: </label>
          <input
            type="number"
            name="roomsFrom"
            id="roomsFrom"
            defaultValue={roomsFrom || ""}
          />
        </div>
        <div>
          <label htmlFor="roomsTo">Rooms to: </label>
          <input
            type="number"
            name="roomsTo"
            id="roomsTo"
            defaultValue={roomsTo || ""}
          />
        </div>
      </div>
      {/* Кнопка для отправки формы */}
      <div style={{ marginTop: "1rem", color: "blue" }}>
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

export default ProjectFilters;
