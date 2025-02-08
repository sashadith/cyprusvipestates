// app/projects/page.tsx
import React from "react";
import Link from "next/link";
import {
  getFilteredProjects,
  getFilteredProjectsCount,
} from "@/sanity/sanity.utils";
import { defaultLocale } from "@/i18n.config";
import ProjectLink from "@/app/components/ProjectLink/ProjectLink";

// Размер страницы — сколько проектов выводить на одной странице
const PAGE_SIZE = 10;

// Типы для параметров фильтрации
type SearchParams = {
  page?: string;
  city?: string;
  priceFrom?: string;
  priceTo?: string;
  roomsFrom?: string;
  roomsTo?: string;
};

type ProjectsPageProps = {
  searchParams: SearchParams;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  // В этом примере язык берём из defaultLocale; если у вас есть route-параметры, их можно использовать
  const lang = defaultLocale;

  // Извлекаем параметры фильтрации и пагинации из searchParams
  const currentPage = Number(searchParams.page) || 1;
  const city = searchParams.city || "";
  const priceFrom = searchParams.priceFrom
    ? Number(searchParams.priceFrom)
    : null;
  const priceTo = searchParams.priceTo ? Number(searchParams.priceTo) : null;
  const roomsFrom = searchParams.roomsFrom
    ? Number(searchParams.roomsFrom)
    : null;
  const roomsTo = searchParams.roomsTo ? Number(searchParams.roomsTo) : null;

  const skip = (currentPage - 1) * PAGE_SIZE;

  // Получаем список проектов и общее количество с учетом фильтров
  const projects = await getFilteredProjects(lang, skip, PAGE_SIZE, {
    city,
    priceFrom,
    priceTo,
    roomsFrom,
    roomsTo,
  });
  const totalProjects = await getFilteredProjectsCount(lang, {
    city,
    priceFrom,
    priceTo,
    roomsFrom,
    roomsTo,
  });
  const totalPages = Math.ceil(totalProjects / PAGE_SIZE);

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <div className="container">
          <h1 className="h2-white">
            {lang === "en"
              ? "Luxury Real Estate Projects in Cyprus"
              : lang === "de" || lang === "ru"
                ? "Luxusimmobilienprojekte in Zypern"
                : lang === "pl"
                  ? "Luksusowe projekty nieruchomości na Cyprze"
                  : lang === "ru"
                    ? "Роскошные проекты недвижимости на Кипре"
                    : "Luxury Real Estate Projects in Cyprus"}
          </h1>

          {/* Форма для фильтрации */}
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
            {/* Кнопка для отправки формы (старта фильтрации) */}
            <div style={{ marginTop: "1rem", color: "blue" }}>
              <button type="submit">
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
        </div>

        <div className="container">
          {/* Список проектов */}
          <div className="projects">
            {projects.map((project: any) => {
              // Формируем URL для проекта: если текущий язык совпадает с defaultLocale, префикс не добавляем
              const projectUrl =
                lang === defaultLocale
                  ? `/projects/${project.slug.current}`
                  : `/${lang}/projects/${project.slug.current}`;

              return (
                <ProjectLink
                  key={project._id}
                  url={projectUrl}
                  previewImage={project.previewImage}
                  title={project.title}
                  price={project.keyFeatures.price}
                  bedrooms={project.keyFeatures.bedrooms}
                  coveredArea={project.keyFeatures.coveredArea}
                  plotSize={project.keyFeatures.plotSize}
                  lang={lang}
                />
              );
            })}
          </div>
        </div>

        {/* Пагинация */}
        <div style={{ marginTop: "2rem" }}>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            // Сохраняем текущие фильтры в URL-параметрах
            const href =
              `?page=${pageNum}` +
              (city ? `&city=${city}` : "") +
              (priceFrom !== null ? `&priceFrom=${priceFrom}` : "") +
              (priceTo !== null ? `&priceTo=${priceTo}` : "") +
              (roomsFrom !== null ? `&roomsFrom=${roomsFrom}` : "") +
              (roomsTo !== null ? `&roomsTo=${roomsTo}` : "");
            return (
              <Link
                key={pageNum}
                href={href}
                style={{
                  marginRight: "0.5rem",
                  textDecoration:
                    currentPage === pageNum ? "underline" : "none",
                }}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
