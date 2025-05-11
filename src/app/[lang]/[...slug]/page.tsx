// app/[lang]/[[...slug]]/page.tsx
import React from "react";
import { groq } from "next-sanity";
import { client } from "@/sanity/sanity.client";
import AccordionContainer from "@/app/components/AccordionContainer/AccordionContainer";
import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";
import { i18n } from "@/i18n.config";
import {
  getFormStandardDocumentByLang,
  getSinglePageByLang,
  getAllPathsForLang,
} from "@/sanity/sanity.utils";
import {
  AccordionBlock,
  TextContent,
  ContactFullBlock,
  TeamBlock,
  LocationBlock,
  ImageFullBlock,
  DoubleTextBlock,
  ButtonBlock,
  ImageBulletsBlock,
  ReviewsFullBlock,
  ProjectsSectionBlock,
  FaqBlock,
  FormMinimalBlock,
  HowWeWorkBlock,
  BulletsBlock,
} from "@/types/blog";
import { FormStandardDocument } from "@/types/formStandardDocument";
import {
  BenefitsBlock as BenefitsBlockType,
  Translation,
} from "@/types/homepage";
import { Singlepage } from "@/types/singlepage";
import { Metadata } from "next";
import ModalBrochure from "@/app/components/ModalBrochure/ModalBrochure";
import TextContentComponent from "@/app/components/TextContentComponent/TextContentComponent";
import PropertyIntro from "@/app/components/PropertyIntro/PropertyIntro";
import ContactFullBlockComponent from "@/app/components/ContactFullBlockComponent/ContactFullBlockComponent";
import TeamBlockComponent from "@/app/components/TeamBlockComponent/TeamBlockComponent";
import LocationBlockComponent from "@/app/components/LocationBlockComponent/LocationBlockComponent";
import ImageFullBlockComponent from "@/app/components/ImageFullBlockComponent/ImageFullBlockComponent";
import DoubleTextBlockComponent from "@/app/components/DoubleTextBlockComponent/DoubleTextBlockComponent";
import ButtonBlockComponent from "@/app/components/ButtonBlockComponent/ButtonBlockComponent";
import ImageBulletsBlockComponent from "@/app/components/ImageBulletsBlockComponent/ImageBulletsBlockComponent";
import BenefitsBlock from "@/app/components/BenefitsBlock/BenefitsBlock";
import ReviewsFullBlockComponent from "@/app/components/ReviewsFullBlockComponent/ReviewsFullBlockComponent";
import { StructuredData } from "@/app/components/StructuredData/StructuredData";
import ProjectsSectionBlockComponent from "@/app/components/ProjectsSectionBlockComponent/ProjectsSectionBlockComponent";
import FormMinimalBlockComponent from "@/app/components/FormMinimalBlockComponent/FormMinimalBlockComponent";
import HowWeWorkBlockComponent from "@/app/components/HowWeWorkBlockComponent/HowWeWorkBlockComponent";
import BulletsBlockComponent from "@/app/components/BulletsBlockComponent/BulletsBlockComponent";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";

type Props = {
  params: {
    lang: string;
    slug: string[];
  };
};

export const dynamicParams = false;
export const revalidate = 60;

/**
 * Собираем все combinations [lang, slug[]] для SSG
 */
export async function generateStaticParams(): Promise<Props["params"][]> {
  const langs = i18n.languages.map((l) => l.id);
  const paths: Props["params"][] = [];

  for (const lang of langs) {
    // получаем у каждого документа current и parent
    const items: { current: string; parent?: string }[] = await client.fetch(
      groq`*[_type=='singlepage' && language==$lang]{
        "current": slug[$lang].current,
        "parent": parentPage->slug[$lang].current
      }`,
      { lang }
    );

    // строим вложенные массивы slug
    const map: Record<string, string[]> = {};
    items.forEach(({ current, parent }) => {
      if (!parent) map[current] = [current];
    });
    let added = true;
    while (added) {
      added = false;
      items.forEach(({ current, parent }) => {
        if (parent && map[parent] && !map[current]) {
          map[current] = [...map[parent], current];
          added = true;
        }
      });
    }

    // теперь пушим только:
    // • root-страницы (parent undefined) — slugArr.length === 1
    // • реальные дочерние (slugArr.length > 1)
    Object.values(map).forEach((slugArr) => {
      const last = slugArr[slugArr.length - 1];
      const hadParent = items.find((i) => i.current === last)?.parent;
      if (!hadParent || slugArr.length > 1) {
        paths.push({ lang, slug: slugArr });
      }
    });
  }

  return paths;
}

/**
 * Динамическая SEO-мета
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug = [] } = params;
  const current = slug[slug.length - 1] || "";
  const page = (await getSinglePageByLang(lang, current)) as Singlepage | null;

  return {
    title: page?.seo.metaTitle,
    description: page?.seo.metaDescription,
  };
}

const SinglePage = async ({ params }: Props) => {
  const { lang, slug } = params;
  const current = slug[slug.length - 1] || "";
  const page = (await getSinglePageByLang(lang, current)) as Singlepage | null;

  if (!page) {
    return <p>Страница не найдена</p>;
  }

  const parentSlug = page.parentPage?.slug[lang]?.current;
  const parentTitle = page.parentPage?.title;

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(lang);

  const allBlocks = page.contentBlocks || [];
  const sdBlocks = allBlocks.filter(
    (b): b is ContactFullBlock | TeamBlock | LocationBlock | ReviewsFullBlock =>
      [
        "contactFullBlock",
        "locationBlock",
        "teamBlock",
        "reviewsFullBlock",
      ].includes(b._type)
  );

  const generateSlug = (slugObj: any, language: string) => {
    const cur = slugObj?.[language]?.current;
    if (!cur) return "#";
    return language === "de"
      ? `https://cyprusvipestates.com/${cur}`
      : `https://cyprusvipestates.com/${language}/${cur}`;
  };

  const url = generateSlug({ [lang]: { current } }, lang);
  const structuredDataProps = {
    slug: current,
    lang,
    metaTitle: page.seo.metaTitle,
    metaDescription: page.seo.metaDescription,
    url,
    blocks: sdBlocks,
  };

  // Правильный маппинг переводов без ошибки TS
  const translations: Translation[] = [];
  for (const { id: code } of i18n.languages) {
    if (code === lang) continue; // пропускаем текущий язык

    // находим перевод слуга текущей страницы
    const childSlug = page._translations.find((t) => Boolean(t.slug[code]))
      ?.slug[code].current;
    if (!childSlug) continue;

    // получаем все пути для этого языка
    const allPaths = await getAllPathsForLang(code);
    // ищем путь, у которого последний сегмент === childSlug
    const match = allPaths.find((arr) => arr[arr.length - 1] === childSlug);
    if (!match) continue;

    translations.push({
      language: code,
      path: `/${code}/${match.join("/")}`,
    });
  }

  const renderContentBlock = (block: any) => {
    switch (block._type) {
      case "textContent":
        return (
          <TextContentComponent key={block._key} block={block as TextContent} />
        );
      case "accordionBlock":
        return (
          <AccordionContainer
            key={block._key}
            block={block as AccordionBlock}
          />
        );
      case "contactFullBlock":
        return (
          <ContactFullBlockComponent
            key={block._key}
            block={block as ContactFullBlock}
            lang={lang}
          />
        );
      case "teamBlock":
        return (
          <TeamBlockComponent
            key={block._key}
            block={block as TeamBlock}
            lang={lang}
          />
        );
      case "locationBlock":
        return (
          <LocationBlockComponent
            key={block._key}
            block={block as LocationBlock}
            lang={lang}
          />
        );
      case "imageFullBlock":
        return (
          <ImageFullBlockComponent
            key={block._key}
            block={block as ImageFullBlock}
          />
        );
      case "doubleTextBlock":
        return (
          <DoubleTextBlockComponent
            key={block._key}
            block={block as DoubleTextBlock}
          />
        );
      case "buttonBlock":
        return (
          <ButtonBlockComponent key={block._key} block={block as ButtonBlock} />
        );
      case "imageBulletsBlock":
        return (
          <ImageBulletsBlockComponent
            key={block._key}
            block={block as ImageBulletsBlock}
          />
        );
      case "benefitsBlock":
        return (
          <BenefitsBlock
            key={block._key}
            benefitsBlock={block as BenefitsBlockType}
          />
        );
      case "reviewsFullBlock":
        return (
          <ReviewsFullBlockComponent
            key={block._key}
            block={block as ReviewsFullBlock}
            lang={lang}
          />
        );
      case "projectsSectionBlock": {
        const b = block as ProjectsSectionBlock;
        // Если поле projects отсутствует или null — считаем его пустым массивом
        const manual = Array.isArray(b.projects) ? b.projects : [];
        const projectsToShow =
          manual.length > 0
            ? manual
            : Array.isArray(b.filteredProjects)
              ? b.filteredProjects
              : [];

        return (
          <ProjectsSectionBlockComponent
            key={b._key}
            block={{
              _key: b._key,
              _type: b._type,
              title: b.title,
              projects: projectsToShow,
              marginTop: b.marginTop,
              marginBottom: b.marginBottom,
            }}
            lang={lang}
          />
        );
      }
      case "faqBlock":
        return (
          <div className="container" key={block._key}>
            <AccordionContainer block={(block as FaqBlock).faq} />
          </div>
        );
      case "formMinimalBlock":
        return (
          <FormMinimalBlockComponent
            key={(block as FormMinimalBlock)._key}
            form={(block as FormMinimalBlock).form}
            lang={lang}
            offerButtonCustomText={(block as FormMinimalBlock).buttonText}
          />
        );
      case "howWeWorkBlock":
        return (
          <HowWeWorkBlockComponent
            key={block._key}
            block={block as HowWeWorkBlock}
            lang={lang}
          />
        );
      case "bulletsBlock":
        return (
          <BulletsBlockComponent
            key={block._key}
            block={block as BulletsBlock}
            lang={lang}
          />
        );
      default:
        return <p key={block._key}>Unsupported block type</p>;
    }
  };

  return (
    <>
      <Header params={params} translations={translations} />
      <StructuredData {...structuredDataProps} />
      <main>
        {page.previewImage && page.allowIntroBlock && (
          <>
            <PropertyIntro
              title={page.title}
              previewImage={page.previewImage}
              excerpt={page.excerpt}
            />
            <Breadcrumbs
              lang={lang}
              segments={params.slug}
              currentTitle={page.title}
            />
          </>
        )}
        {!page.previewImage && !page.allowIntroBlock && (
          <div className="breadcrumbs-mt">
            <Breadcrumbs
              lang={lang}
              segments={params.slug}
              currentTitle={page.title}
            />
          </div>
        )}
        {allBlocks.map(renderContentBlock)}
      </main>
      <Footer params={params} />
      <ModalBrochure lang={lang} formDocument={formDocument} />
    </>
  );
};

export default SinglePage;
