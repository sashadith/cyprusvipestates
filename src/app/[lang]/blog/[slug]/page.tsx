import React from "react";
import AccordionContainer from "@/app/components/AccordionContainer/AccordionContainer";
import BlogIntro from "@/app/components/BlogIntro/BlogIntro";
import BlogVideo from "@/app/components/BlogVideo/BlogVideo";
import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";
// import LastArticles from "@/app/components/LastArticles/LastArticles";
// import LinkPrimary from "@/app/components/LinkPrimary/LinkPrimary";

import TextContentComponent from "@/app/components/TextContentComponent/TextContentComponent";
import { i18n } from "@/i18n.config";
import {
  getBlogPostByLang,
  getFormStandardDocumentByLang,
} from "@/sanity/sanity.utils";
import {
  AccordionBlock,
  TextContent,
  ImageFullBlock,
  DoubleTextBlock,
  ButtonBlock,
  FaqBlock,
  FormMinimalBlock,
  ProjectsSectionBlock,
} from "@/types/blog";
import { FormStandardDocument } from "@/types/formStandardDocument";
import { Metadata } from "next";
import DoubleTextBlockComponent from "@/app/components/DoubleTextBlockComponent/DoubleTextBlockComponent";
import ModalBrochure from "@/app/components/ModalBrochure/ModalBrochure";
import { Translation } from "@/types/homepage";
import ContactFullBlockComponent from "@/app/components/ContactFullBlockComponent/ContactFullBlockComponent";
import ImageFullBlockComponent from "@/app/components/ImageFullBlockComponent/ImageFullBlockComponent";
import ButtonBlockComponent from "@/app/components/ButtonBlockComponent/ButtonBlockComponent";
import FormMinimalBlockComponent from "@/app/components/FormMinimalBlockComponent/FormMinimalBlockComponent";
import PopularProperties from "@/app/components/PopularProperties/PopularProperties";
import FormStatic from "@/app/components/FormStatic/FormStatic";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import BreadcrumbsBlog from "@/app/components/BreadcrumbsBlog/BreadcrumbsBlog";
import SchemaBlogPost from "@/app/components/SchemaBlogPost/SchemaBlogPost";
import ProjectsSectionSlider from "@/app/components/ProjectsSectionSlider/ProjectsSectionSlider";
import WhatsAppButton from "@/app/components/WhatsAppButton/WhatsAppButton";

type Props = {
  params: { lang: string; slug: string };
};

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;
  const data = await getBlogPostByLang(lang, slug);

  return {
    title: data?.seo.metaTitle,
    description: data?.seo.metaDescription,
  };
}

const PagePost = async ({ params }: Props) => {
  const { lang, slug } = params;
  const blog = await getBlogPostByLang(lang, slug);

  if (!blog) {
    return <p>Страница не найдена</p>;
  }

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(params.lang);

  const blogPageTranslationSlugs: { [key: string]: { current: string } }[] =
    blog?._translations
      ?.filter((item) => item && item.slug)
      .map((item) => {
        const newItem: { [key: string]: { current: string } } = {};

        for (const key in item.slug) {
          if (key !== "_type" && item.slug[key]) {
            newItem[key] = { current: item.slug[key].current };
          }
        }
        return newItem;
      }) || [];

  const translations = i18n.languages.reduce<Translation[]>((acc, lang) => {
    const translationSlug = blogPageTranslationSlugs
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
            path: `/${lang.id}/blog/${translationSlug}`,
          },
        ]
      : acc;
  }, []);

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
      case "projectsSectionBlock": {
        const b = block as ProjectsSectionBlock;
        // ручных проектов нет — берём фильтрованные
        const manual = Array.isArray(b.projects) ? b.projects : [];
        const projectsToShow = manual.length
          ? manual
          : Array.isArray(b.filteredProjects)
            ? b.filteredProjects
            : [];

        return (
          <ProjectsSectionSlider
            key={b._key}
            block={{
              ...b,
              projects: projectsToShow,
            }}
            lang={lang}
          />
        );
      }
      default:
        return <p key={block._key}>Unsupported block type</p>;
    }
  };

  const currentPostId = blog._id;

  return (
    <>
      <Header params={params} translations={translations} />
      <SchemaBlogPost blog={blog} lang={lang} />
      <BreadcrumbsBlog
        lang={lang}
        segments={[slug]}
        currentTitle={blog.title}
      />
      <main>
        <div className="container">
          <div className="post-grid">
            <div className="post-content">
              <BlogIntro
                title={blog.title}
                categoryTitle={blog.category.title}
                date={blog.publishedAt}
                previewImage={blog.previewImage}
              />
              <article>
                {blog.contentBlocks.map((block) => renderContentBlock(block))}
              </article>
              {/* <BlogButtonWrapper>
                <LinkPrimary href={`/${lang}/blog`}>
                  {lang === "en"
                    ? "Back to all articles"
                    : "Вернуться ко всем статьям"}
                </LinkPrimary>
              </BlogButtonWrapper> */}
            </div>
            <div className="post-content sidebar">
              <aside className="aside">
                {blog.videoBlock &&
                  blog.videoBlock.videoId &&
                  blog.videoBlock.posterImage && (
                    <BlogVideo
                      videoId={blog.videoBlock.videoId}
                      posterImage={blog.videoBlock.posterImage}
                      title={blog.title}
                    />
                  )}
              </aside>
              {blog.popularProperties && (
                <PopularProperties
                  lang={lang}
                  popularProperties={blog.popularProperties}
                />
              )}
            </div>
          </div>
          {/* <LastArticles params={{ lang, id: currentPostId }} /> */}
        </div>
        <FormStatic lang={params.lang} />
      </main>
      <Footer params={params} />
      <ModalBrochure lang={lang} formDocument={formDocument} />
      <WhatsAppButton lang={params.lang} />
    </>
  );
};

export default PagePost;
