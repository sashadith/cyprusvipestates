import React from "react";
import dynamic from "next/dynamic";
import AccordionContainer from "@/app/components/AccordionContainer/AccordionContainer";
import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";
import { i18n } from "@/i18n.config";
import {
  getFormStandardDocumentByLang,
  getSinglePageByLang,
  // getNotFoundPageByLang,
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
} from "@/types/blog";
import { FormStandardDocument } from "@/types/formStandardDocument";
import {
  BenefitsBlock as BenefitsBlockType,
  Translation,
} from "@/types/homepage";
import { Metadata } from "next";
// import NotFoundPageComponent from "@/app/components/NotFoundPageComponent/NotFoundPageComponent";
import ModalBrochure from "@/app/components/ModalBrochure/ModalBrochure";
import TextContentComponent from "@/app/components/TextContentComponent/TextContentComponent";
import SinglePageIntroBlock from "@/app/components/SinglePageIntroBlock/SinglePageIntroBlock";
import PreviewMain from "@/app/components/PreviewMain/PreviewMain";
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

// const NotFound = dynamic(() => import("@/app/components/NotFound/NotFound"), {
//   ssr: false,
// });

type Props = {
  params: { lang: string; slug: string };
};

type ContentBlock =
  | TextContent
  | AccordionBlock
  | ContactFullBlock
  | TeamBlock
  | LocationBlock
  | ImageFullBlock
  | DoubleTextBlock
  | ButtonBlock
  | ImageBulletsBlock
  | BenefitsBlockType
  | ReviewsFullBlock
  | ProjectsSectionBlock
  | FaqBlock
  | FormMinimalBlock;

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;
  const data = await getSinglePageByLang(lang, slug);

  return {
    title: data?.seo.metaTitle,
    description: data?.seo.metaDescription,
  };
}

const SinglePage = async ({ params }: Props) => {
  const { lang, slug } = params;
  const page = await getSinglePageByLang(lang, slug);

  // if (!page) {
  //   const notFoundPage = await getNotFoundPageByLang(lang);
  //   return (
  //     <>
  //       <Header params={params} translations={[]} />
  //       <NotFoundPageComponent notFoundPage={notFoundPage} lang={lang} />
  //       <Footer params={params} />
  //     </>
  //   ); // Рендеринг компонента NotFound
  // }

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(params.lang);

  // Собираем все контент-блоки
  const allBlocks = page.contentBlocks
    ? (page.contentBlocks as ContentBlock[])
    : [];

  // Фильтруем только поддерживаемые для JSON-LD
  const sdBlocks = allBlocks.filter(
    (b): b is ContactFullBlock | TeamBlock | LocationBlock | ReviewsFullBlock =>
      b._type === "contactFullBlock" ||
      b._type === "locationBlock" ||
      b._type === "teamBlock" ||
      b._type === "reviewsFullBlock"
  );

  const generateSlug = (slug: any, language: string) => {
    if (!slug || !slug[language]?.current) return "#";

    // Если язык "de", не добавляем /de/
    return language === "de"
      ? `https://cyprusvipestates.com/${slug[language].current}`
      : `https://cyprusvipestates.com/${language}/${slug[language].current}`;
  };

  const url = generateSlug({ [lang]: { current: slug } }, lang);
  const structuredDataProps = {
    slug,
    lang,
    metaTitle: page.seo.metaTitle,
    metaDescription: page.seo.metaDescription,
    url,
    blocks: sdBlocks,
  };

  const singlePageTranslationSlugs: { [key: string]: { current: string } }[] =
    page?._translations.map((item) => {
      const newItem: { [key: string]: { current: string } } = {};

      for (const key in item.slug) {
        if (key !== "_type") {
          newItem[key] = { current: item.slug[key].current };
        }
      }
      return newItem;
    });

  const translations = i18n.languages.reduce<Translation[]>((acc, lang) => {
    const translationSlug = singlePageTranslationSlugs
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
            path: `/${lang.id}/${translationSlug}`,
          },
        ]
      : acc;
  }, []);

  const renderContentBlock = (block: ContentBlock) => {
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
            lang={params.lang}
          />
        );
      case "teamBlock":
        return (
          <TeamBlockComponent
            key={block._key}
            block={block as TeamBlock}
            lang={params.lang}
          />
        );
      case "locationBlock":
        return (
          <LocationBlockComponent
            key={block._key}
            block={block as LocationBlock}
            lang={params.lang}
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
            lang={params.lang}
          />
        );
      case "projectsSectionBlock":
        return (
          <ProjectsSectionBlockComponent
            key={block._key}
            block={block as ProjectsSectionBlock}
            lang={params.lang}
          />
        );
      case "faqBlock":
        return (
          <div className="container">
            <AccordionContainer
              key={block._key}
              block={(block as FaqBlock).faq}
            />
          </div>
        );
      case "formMinimalBlock": {
        const minimal = block as FormMinimalBlock;
        return (
          <FormMinimalBlockComponent
            key={minimal._key}
            form={minimal.form}
            lang={params.lang}
            offerButtonCustomText={minimal.buttonText}
          />
        );
      }
      default:
        return <p key={block._key}>Unsupported block type</p>;
    }
  };

  const currentPostId = page._id;

  return (
    <>
      <Header params={params} translations={translations} />
      {/* вставляем JSON-LD */}
      <StructuredData {...structuredDataProps} />
      <main>
        {page.previewImage &&
          page.title &&
          page.excerpt &&
          page.allowIntroBlock && (
            <PropertyIntro
              title={page.title}
              previewImage={page.previewImage}
              excerpt={page.excerpt}
            />
          )}
        {/* <SinglePageIntroBlock title={page.title} /> */}
        {page.contentBlocks?.length > 0 &&
          page.contentBlocks.map((block) => renderContentBlock(block))}
      </main>
      <Footer params={params} />
      <ModalBrochure lang={params.lang} formDocument={formDocument} />
    </>
  );
};

export default SinglePage;
