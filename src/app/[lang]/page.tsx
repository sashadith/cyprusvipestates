import { Metadata } from "next";
import Link from "next/link";
import { getHomePageByLang } from "../../sanity/sanity.utils";
import { i18n } from "@/i18n.config";
import { Translation } from "@/types/homepage";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import ModalBrochure from "../components/ModalBrochure/ModalBrochure";
import BrochureBlock from "../components/BrochureBlock/BrochureBlock";
import AboutBlock from "../components/AboutBlock/AboutBlock";
import Footer from "../components/Footer/Footer";
import ProjectsBlock from "../components/ProjectsBlock/ProjectsBlock";
import HeaderWrapper from "../components/HeaderWrapper/HeaderWrapper";

type Props = {
  params: { lang: string; slug: string };
};

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const homePage = await getHomePageByLang(params.lang);
  return {
    title: homePage?.seo?.metaTitle,
    description: homePage?.seo?.metaDescription,
  };
}

export default async function Home({ params }: Props) {
  const homePage = await getHomePageByLang(params.lang);

  // const formDocument: FormStandardDocument =
  //   await getFormStandardDocumentByLang(params.lang);

  // console.log("homePage", homePage.projectsBlock.projects);
  // console.log("projectsBlock", homePage?.projectsBlock);

  const homePageTranslationSlugs: { [key: string]: { current: string } }[] =
    homePage?._translations.map((item) => {
      const newItem: { [key: string]: { current: string } } = {};

      for (const key in item.slug) {
        if (key !== "_type") {
          newItem[key] = { current: item.slug[key].current };
        }
      }
      return newItem;
    });

  const translations = i18n.languages.reduce<Translation[]>((acc, lang) => {
    const translationSlug = homePageTranslationSlugs
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
            path: `/${lang.id}`,
          },
        ]
      : acc;
  }, []);

  return (
    <>
      <HeaderWrapper>
        <Header params={params} translations={translations} />
      </HeaderWrapper>
      <main>
        <Hero slides={homePage.sliderMain} />
        <BrochureBlock brochure={homePage.brochureBlock} />
        <AboutBlock aboutBlock={homePage.aboutBlock} />
        {/* <ProjectsBlock projectsBlock={homePage.projectsBlock} /> */}
        <Footer params={params} />
        <ModalBrochure lang={params.lang} />
      </main>
    </>
  );
}
