// app/projects/page.tsx
import React from "react";
import Link from "next/link";
import {
  getFilteredProjects,
  getFilteredProjectsCount,
  getPropertiesPageByLang,
} from "@/sanity/sanity.utils";
import { defaultLocale, i18n } from "@/i18n.config";
import { Translation } from "@/types/homepage";
import ProjectLink from "@/app/components/ProjectLink/ProjectLink";
import NoProjects from "@/app/components/NoProjects/NoProjects";
import StyledProjectFilters from "@/app/components/StyledProjectFilters/StyledProjectFilters";
import Header from "@/app/components/Header/Header";
import HeaderWrapper from "@/app/components/HeaderWrapper/HeaderWrapper";

const PAGE_SIZE = 10;

type SearchParams = {
  page?: string;
  city?: string;
  priceFrom?: string;
  priceTo?: string;
  propertyType?: string;
};

type ProjectsPageProps = {
  params: { lang: string };
  searchParams: SearchParams;
};

export default async function ProjectsPage({
  params,
  searchParams,
}: ProjectsPageProps) {
  const { lang } = params;

  // Получаем переводы для страницы проектов (например, propertiesPage документ из Sanity)
  const propertiesPage = await getPropertiesPageByLang(lang);

  // Извлекаем массив slug из _translations, аналогично странице проекта
  const propertyPageTranslationSlugs: { [key: string]: { current: string } }[] =
    propertiesPage?._translations.map((item: any) => {
      const newItem: { [key: string]: { current: string } } = {};
      for (const key in item.slug) {
        if (key !== "_type") {
          newItem[key] = { current: item.slug[key].current };
        }
      }
      return newItem;
    }) || [];

  // Формируем массив переводов для Header
  const translations: Translation[] = i18n.languages.reduce<Translation[]>(
    (acc, langObj) => {
      const translationSlug = propertyPageTranslationSlugs
        .reduce((slugAcc: string[], slugObj) => {
          const current = slugObj[langObj.id]?.current;
          if (current) {
            slugAcc.push(current);
          }
          return slugAcc;
        }, [])
        .join(" ");
      return translationSlug
        ? [
            ...acc,
            {
              language: langObj.id,
              path: `/${langObj.id}/projects/${translationSlug}`,
            },
          ]
        : acc;
    },
    []
  );

  const currentPage = Number(searchParams.page) || 1;
  const city = searchParams.city || "";
  const priceFrom = searchParams.priceFrom
    ? Number(searchParams.priceFrom)
    : null;
  const priceTo = searchParams.priceTo ? Number(searchParams.priceTo) : null;
  const propertyType = searchParams.propertyType || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  const projects = await getFilteredProjects(lang, skip, PAGE_SIZE, {
    city,
    priceFrom,
    priceTo,
    propertyType,
  });
  const totalProjects = await getFilteredProjectsCount(lang, {
    city,
    priceFrom,
    priceTo,
    propertyType,
  });
  const totalPages = Math.ceil(totalProjects / PAGE_SIZE);

  return (
    <>
      {/* Рендерим Header с переводами аналогично странице проекта */}
      <div style={{ backgroundColor: "#212121", height: "62px" }}>
        <HeaderWrapper>
          <Header params={params} translations={translations} />
        </HeaderWrapper>
      </div>

      <div style={{ padding: "2rem" }}>
        <div className="container">
          <h1 className="h2-white">
            {lang === "en"
              ? "Luxury Real Estate Projects in Cyprus"
              : lang === "de" || lang === "ru"
                ? "Luxusimmobilienprojekte in Zypern"
                : lang === "pl"
                  ? "Luksusowe projekty nieruchomości na Cyprze"
                  : "Luxury Real Estate Projects in Cyprus"}
          </h1>
          <StyledProjectFilters
            lang={lang}
            city={city}
            priceFrom={priceFrom}
            priceTo={priceTo}
            propertyType={propertyType}
          />
        </div>
        <div className="container">
          {projects.length === 0 ? (
            <NoProjects lang={lang} />
          ) : (
            <div className="projects">
              {projects.map((project: any) => {
                const projectUrl =
                  project.slug && project.slug.current
                    ? lang === defaultLocale
                      ? `/projects/${project.slug.current}`
                      : `/${lang}/projects/${project.slug.current}`
                    : "#";
                return (
                  <ProjectLink
                    key={project._id}
                    url={projectUrl}
                    previewImage={project.previewImage}
                    title={project.title}
                    price={project.keyFeatures?.price ?? 0}
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
        <div style={{ marginTop: "2rem" }}>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const href =
              `?page=${pageNum}` +
              (city ? `&city=${city}` : "") +
              (priceFrom !== null ? `&priceFrom=${priceFrom}` : "") +
              (priceTo !== null ? `&priceTo=${priceTo}` : "") +
              (propertyType ? `&propertyType=${propertyType}` : "");
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
