// ProjectSameCity.tsx
import React from "react";
import { getThreeProjectsBySameCity } from "@/sanity/sanity.utils";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import { defaultLocale } from "@/i18n.config";
import styles from "./ProjectSameCity.module.scss";

type Props = {
  lang: string;
  city: string;
  currentProjectId?: string;
};

const ProjectSameCity = async ({ lang, city, currentProjectId }: Props) => {
  const projects = await getThreeProjectsBySameCity(
    lang,
    city,
    currentProjectId
  );

  if (!projects || projects.length === 0) {
    return null;
  }

  const title =
    lang === "en"
      ? "Other projects in"
      : lang === "de"
        ? "Andere Projekte in"
        : lang === "pl"
          ? "Inne projekty w mieście"
          : lang === "ru"
            ? "Другие проекты в городе"
            : "Other projects";

  return (
    <section className={styles.projectSameCity}>
      <div className="container">
        <h2 className={styles.title}>
          {title} {city}
        </h2>
        <div className={styles.projects}>
          {projects.map((project: any) => {
            const projectUrl =
              lang === defaultLocale
                ? `/projects/${project.slug.current}`
                : `/${lang}/projects/${project.slug.current}`;
            return (
              <Link
                key={project._id}
                href={projectUrl}
                className={styles.project}
              >
                <div className={styles.overlay}></div>
                <div className={styles.projectImage}>
                  <Image
                    src={urlFor(project.previewImage).url()}
                    alt={project.previewImage.alt || project.title}
                    className={styles.image}
                    fill={true}
                  />
                </div>
                <div className={styles.projectInfo}>
                  <p className={styles.projectTitle}>{project.title}</p>
                  <p className={styles.projectPrice}>
                    {lang === "en"
                      ? "Price from"
                      : lang === "de"
                        ? "Preis ab"
                        : lang === "pl"
                          ? "Cena od"
                          : lang === "ru"
                            ? "Цена от"
                            : "Price from"}
                    &nbsp;
                    {project.keyFeatures.price.toLocaleString()} €
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectSameCity;
