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
  DoubleImagesBlock,
  TabsBlock,
  TextContent,
} from "@/types/blog";
import { FormStandardDocument } from "@/types/formStandardDocument";
import { Translation } from "@/types/homepage";
import { Metadata } from "next";
// import NotFoundPageComponent from "@/app/components/NotFoundPageComponent/NotFoundPageComponent";
import ModalBrochure from "@/app/components/ModalBrochure/ModalBrochure";
import TextContentComponent from "@/app/components/TextContentComponent/TextContentComponent";
import SinglePageIntroBlock from "@/app/components/SinglePageIntroBlock/SinglePageIntroBlock";
import PreviewMain from "@/app/components/PreviewMain/PreviewMain";
import PropertyIntro from "@/app/components/PropertyIntro/PropertyIntro";

// const NotFound = dynamic(() => import("@/app/components/NotFound/NotFound"), {
//   ssr: false,
// });

type Props = {
  params: { lang: string; slug: string };
};

type ContentBlock = TextContent | AccordionBlock;

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
      default:
        return <p key={block._key}>Unsupported block type</p>;
    }
  };

  const currentPostId = page._id;

  return (
    <>
      <Header params={params} translations={translations} />
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
        <div className="container">
          <SinglePageIntroBlock title={page.title} />
          {page.contentBlocks?.length > 0 &&
            page.contentBlocks.map((block) => renderContentBlock(block))}
        </div>
      </main>
      <Footer params={params} />
      <ModalBrochure lang={params.lang} formDocument={formDocument} />
    </>
  );
};

export default SinglePage;
