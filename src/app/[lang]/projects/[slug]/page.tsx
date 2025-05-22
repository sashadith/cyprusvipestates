import React from "react";
import { Metadata } from "next";
import {
  getFormStandardDocumentByLang,
  getProjectByLang,
} from "@/sanity/sanity.utils";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import { i18n } from "@/i18n.config";
import { Translation } from "@/types/homepage";
import PropertyIntro from "@/app/components/PropertyIntro/PropertyIntro";
import PropertyDescription from "@/app/components/PropertyDescription/PropertyDescription";
import dynamic from "next/dynamic";
import PropertyDistances from "@/app/components/PropertyDistances/PropertyDistances";
import ModalBrochure from "@/app/components/ModalBrochure/ModalBrochure";
import { FormStandardDocument } from "@/types/formStandardDocument";
import PropertySlider from "@/app/components/PropertySlider/PropertySlider";
import PropertyFeatures from "@/app/components/PropertyFeatures/PropertyFeatures";
import HeaderWrapper from "@/app/components/HeaderWrapper/HeaderWrapper";
import { ButtonModal } from "@/app/components/ButtonModal/ButtonModal";
import ProjectSlider from "@/app/components/ProjectSlider/ProjectSlider";
import ProjectSameCity from "@/app/components/ProjectSameCity/ProjectSameCity";
import { urlFor } from "@/sanity/sanity.client";
import FormStatic from "@/app/components/FormStatic/FormStatic";
import FullDescriptionBlock from "@/app/components/FullDescriptionBlock/FullDescriptionBlock";
import AccordionContainer from "@/app/components/AccordionContainer/AccordionContainer";
import SchemaMarkup from "@/app/components/SchemaMarkup/SchemaMarkup";
import WhatsAppButton from "@/app/components/WhatsAppButton/WhatsAppButton";

type Props = {
  params: { lang: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;
  const data = await getProjectByLang(lang, slug);

  let previewImageUrl: string | undefined = undefined;
  if (data?.previewImage) {
    previewImageUrl = urlFor(data.previewImage).width(1200).url();
  }

  return {
    title: data?.seo.metaTitle,
    description: data?.seo.metaDescription,
    openGraph: {
      title: data?.seo.metaTitle,
      description: data?.seo.metaDescription,
      images: previewImageUrl ? [{ url: previewImageUrl }] : [],
    },
  };
}

const ProjectPage = async ({ params }: Props) => {
  const { lang, slug } = params;
  const project = await getProjectByLang(lang, slug);

  if (!project) {
    return null;
  }

  // console.log("faq", project.faq);

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(params.lang);

  const propertyPageTranslationSlugs: {
    [key: string]: { current: string };
  }[] = project?._translations.map((item) => {
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
            path: `/${lang.id}/projects/${translationSlug}`,
          },
        ]
      : acc;
  }, []);

  const MapWithNoSSR = dynamic(
    () => import("../../../components/PropertyMap/PropertyMap"),
    {
      ssr: false,
    }
  );

  return (
    <>
      <SchemaMarkup project={project} />
      {/* <div
        style={{
          backgroundColor: "#212121",
          height: "62px",
        }}
      > */}
      {/* <HeaderWrapper> */}
      <Header params={params} translations={translations} />
      {/* </HeaderWrapper> */}
      {/* </div> */}
      <main>
        <PropertyIntro
          title={project.title}
          excerpt={project.excerpt}
          previewImage={project.previewImage}
          videoId={project.videoId}
          videoPreview={project.videoPreview}
          lang={params.lang}
        />
        <div className="container">
          <ProjectSlider images={project.images} />
        </div>
        <div className="container">
          <div className="property-content">
            <div className="property-description">
              <PropertyDescription description={project.description} />
              <div className="property-button">
                <ButtonModal>
                  {lang === "en"
                    ? "Enquire this amazing project now!"
                    : lang === "de"
                      ? "Fragen Sie dieses erstaunliche Projekt jetzt an!"
                      : lang === "pl"
                        ? "Zapytaj o ten niesamowity projekt teraz!"
                        : lang === "ru"
                          ? "Узнайте об этом проекте!"
                          : "Enquire this amazing project now!"}
                </ButtonModal>
              </div>
            </div>
            <div className="property-features">
              <PropertyFeatures keyFeatures={project.keyFeatures} lang={lang} />
            </div>
          </div>
        </div>
        <PropertyDistances distances={project.distances} lang={params.lang} />
        <MapWithNoSSR lat={project.location.lat} lng={project.location.lng} />
        <FormStatic lang={params.lang} />
        <FullDescriptionBlock description={project.fullDescription} />
        {project.faq && (
          <div className="container">
            <div className="property-faq">
              <h2 className="h2-white">
                {lang === "en"
                  ? "FAQ"
                  : lang === "pl"
                    ? "Najczęściej zadawane pytania"
                    : lang === "ru"
                      ? "Часто задаваемые вопросы"
                      : "Häufig gestellte Fragen"}
              </h2>
              <AccordionContainer block={project.faq} />
            </div>
          </div>
        )}
        <WhatsAppButton lang={params.lang} />
      </main>
      <ProjectSameCity
        lang={params.lang}
        city={project.keyFeatures.city}
        currentProjectId={project._id}
      />

      <Footer params={params} />
      <ModalBrochure lang={params.lang} formDocument={formDocument} />
    </>
  );
};

export default ProjectPage;
