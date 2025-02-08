// app/projects/page.tsx
import React from "react";
import Link from "next/link";
import {
  getFilteredProjects,
  getFilteredProjectsCount,
} from "@/sanity/sanity.utils";
import { defaultLocale } from "@/i18n.config";
import ProjectLink from "@/app/components/ProjectLink/ProjectLink";
import ProjectFilters from "@/app/components/ProjectFilters/ProjectFilters";
import NoProjects from "@/app/components/NoProjects/NoProjects";

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

          <ProjectFilters
            lang={lang}
            city={city}
            priceFrom={priceFrom}
            priceTo={priceTo}
            roomsFrom={roomsFrom}
            roomsTo={roomsTo}
          />
        </div>
        <div className="container">
          {/* Список проектов или сообщение, если ничего не найдено */}
          {projects.length === 0 ? (
            <NoProjects lang={lang} />
          ) : (
            <div className="projects">
              {projects.map((project: any) => {
                // Формирование URL для проекта: если текущий язык совпадает с defaultLocale, префикс не добавляем
                const projectUrl =
                  project.slug && project.slug.current
                    ? lang === defaultLocale
                      ? `/projects/${project.slug.current}`
                      : `/${lang}/projects/${project.slug.current}`
                    : "#"; // или, например, пропустите такой проект

                return (
                  <ProjectLink
                    key={project._id}
                    url={projectUrl}
                    previewImage={project.previewImage}
                    title={project.title}
                    price={project.keyFeatures?.price ?? project.price ?? 0} // если keyFeatures отсутствует, можно взять project.price или установить значение по умолчанию
                    bedrooms={project.keyFeatures?.bedrooms ?? 0}
                    coveredArea={project.keyFeatures?.coveredArea ?? 0}
                    plotSize={project.keyFeatures?.plotSize ?? 0}
                    lang={lang}
                  />
                );
              })}
            </div>
          )}
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
