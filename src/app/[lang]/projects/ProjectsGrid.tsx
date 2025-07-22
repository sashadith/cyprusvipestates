import ProjectLink from "@/app/components/ProjectLink/ProjectLink";
import NoProjects from "@/app/components/NoProjects/NoProjects";
import { getFilteredProjects } from "@/sanity/sanity.utils";
import { defaultLocale } from "@/i18n.config";

type Props = {
  lang: string;
  skip: number;
  pageSize: number;
  city: string;
  priceFrom: number | null;
  priceTo: number | null;
  propertyType: string;
};

export default async function ProjectsGrid({
  lang,
  skip,
  pageSize,
  city,
  priceFrom,
  priceTo,
  propertyType,
}: Props) {
  const projects = await getFilteredProjects(lang, skip, pageSize, {
    city,
    priceFrom,
    priceTo,
    propertyType,
  });

  if (projects.length === 0) {
    return <NoProjects lang={lang} />;
  }

  return (
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
  );
}
