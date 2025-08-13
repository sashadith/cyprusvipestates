import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  getFilteredProjects,
  getFilteredProjectsCount,
  getProjectsPageByLang,
  getAllProjectsLocationsByLang,
} from "@/sanity/sanity.utils";
import { defaultLocale, i18n } from "@/i18n.config";
import { Translation } from "@/types/homepage";
import ProjectLink from "@/app/components/ProjectLink/ProjectLink";
import NoProjects from "@/app/components/NoProjects/NoProjects";
import StyledProjectFilters from "@/app/components/StyledProjectFilters/StyledProjectFilters";
import Header from "@/app/components/Header/Header";
import HeaderWrapper from "@/app/components/HeaderWrapper/HeaderWrapper";
import { Metadata } from "next";
import Footer from "@/app/components/Footer/Footer";
import WhatsAppButton from "@/app/components/WhatsAppButton/WhatsAppButton";
import FormStatic from "@/app/components/FormStatic/FormStatic";

const PAGE_SIZE = 12;

type SearchParams = {
  page?: string;
  city?: string;
  priceFrom?: string;
  priceTo?: string;
  propertyType?: string;
  sort?: string;
  q?: string;
};

type ProjectsPageProps = {
  params: { lang: string };
  searchParams: SearchParams;
};

type MetaDataProps = {
  params: { lang: string };
};

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: MetaDataProps): Promise<Metadata> {
  const data = await getProjectsPageByLang(params.lang);

  return {
    title: data?.seo.metaTitle,
    description: data?.seo.metaDescription,
  };
}

const ProjectsMapAll = dynamic(
  () => import("@/app/components/ProjectsMapAll/ProjectsMapAll"),
  { ssr: false }
);

export default async function ProjectsPage({
  params,
  searchParams,
}: ProjectsPageProps) {
  const { lang } = params;

  // Получаем переводы для страницы проектов (например, propertiesPage документ из Sanity)
  const projectsPage = await getProjectsPageByLang(lang);

  const propertyPageTranslationSlugs: {
    [key: string]: { current: string };
  }[] = projectsPage?._translations.map((item) => {
    const newItem: { [key: string]: { current: string } } = {};

    for (const key in item.slug) {
      if (key !== "_type") {
        newItem[key] = { current: item.slug[key].current };
      }
    }
    return newItem;
  });

  const translations = i18n.languages.reduce<Translation[]>((acc, lang) => {
    const translationSlug = propertyPageTranslationSlugs
      ?.reduce(
        (acc: string[], slug: { [key: string]: { current: string } }) => {
          const current = slug[lang.id]?.current;
          if (current) {
            acc.push(current);
          }
          return acc;
        },
        []
      )
      .join(" ");

    return translationSlug
      ? [
          ...acc,
          {
            language: lang.id,
            path: `/${lang.id}/projects`,
          },
        ]
      : acc;
  }, []);

  const currentPage = Number(searchParams.page) || 1;
  const city = searchParams.city || "";
  const priceFrom = searchParams.priceFrom
    ? Number(searchParams.priceFrom)
    : null;
  const priceTo = searchParams.priceTo ? Number(searchParams.priceTo) : null;
  const propertyType = searchParams.propertyType || "";
  const skip = (currentPage - 1) * PAGE_SIZE;
  const sort = searchParams.sort || "priceAsc";
  const q = searchParams.q || "";

  const projects = await getFilteredProjects(lang, skip, PAGE_SIZE, {
    city,
    priceFrom,
    priceTo,
    propertyType,
    sort,
    q,
  });
  const totalProjects = await getFilteredProjectsCount(lang, {
    city,
    priceFrom,
    priceTo,
    propertyType,
    q,
  });
  const totalPages = Math.ceil(totalProjects / PAGE_SIZE);

  // получаем ВСЕ проекты с координатами (статично, без фильтров/пагинации)
  const allMarkers = await getAllProjectsLocationsByLang(lang);

  return (
    <>
      {/* Рендерим Header с переводами аналогично странице проекта */}
      {/* <div style={{ backgroundColor: "#212121", height: "62px" }}>
        <HeaderWrapper> */}
      <Header params={params} translations={translations} />
      {/* </HeaderWrapper>
      </div> */}

      <main style={{ paddingTop: "2rem" }}>
        <StyledProjectFilters
          lang={lang}
          city={city}
          priceFrom={priceFrom}
          priceTo={priceTo}
          propertyType={propertyType}
          sort={sort}
          q={q}
        />
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
        <div className="pagination-links" style={{ marginTop: "2rem" }}>
          {totalPages > 1 && (
            <div className="pagination-links" style={{ marginTop: "2rem" }}>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;

                // собираем объект из всех активных фильтров
                const params: Record<string, string> = {};
                if (pageNum > 1) params.page = String(pageNum);
                if (city) params.city = city;
                if (priceFrom) params.priceFrom = String(priceFrom);
                if (priceTo) params.priceTo = String(priceTo);
                if (propertyType) params.propertyType = propertyType;
                if (sort) params.sort = sort;
                if (q) params.q = q;

                const href = `?${new URLSearchParams(params).toString()}`;

                return currentPage === pageNum ? (
                  <button key={pageNum} disabled className="pagination-link">
                    {pageNum}
                  </button>
                ) : (
                  <Link key={pageNum} href={href} className="pagination-link">
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        {/* === СТАБИЛЬНАЯ СТАТИЧНАЯ КАРТА СО ВСЕМИ ПРОЕКТАМИ === */}
        <div
          style={{
            marginTop: "2rem",
            width: "100%",
            height: "500px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <ProjectsMapAll lang={lang} markers={allMarkers} />
        </div>
        <FormStatic lang={params.lang} />
        <WhatsAppButton lang={params.lang} />
      </main>
      <Footer params={params} />
    </>
  );
}
