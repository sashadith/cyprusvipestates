import { Metadata } from "next";
import Link from "next/link";
import {
  getFormStandardDocumentByLang,
  getHomePageByLang,
} from "../../sanity/sanity.utils";
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
import { FormStandardDocument } from "@/types/formStandardDocument";
import ParallaxImage from "../components/ParallaxImage/ParallaxImage";
import DescriptionBlock from "../components/DescriptionBlock/DescriptionBlock";
import NewListnigs from "../components/NewListnigs/NewListnigs";
import Reviews from "../components/Reviews/Reviews";
import FormStatic from "../components/FormStatic/FormStatic";
import LogosCarousel from "../components/LogosCarousel/LogosCarousel";
import DevelopersLogos from "../components/DevelopersLogos/DevelopersLogos";
import BenefitsBlock from "../components/BenefitsBlock/BenefitsBlock";
import homepage from "@/sanity/schemaTypes/homepage";
import HowWeWorkBlock from "../components/HowWeWorkBlock/HowWeWorkBlock";
import ReviewsFullBlockComponent from "../components/ReviewsFullBlockComponent/ReviewsFullBlockComponent";

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

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(params.lang);

  // console.log("homePage", homePage);
  // console.log("formDocument", formDocument);

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
      <Header params={params} translations={translations} />
      <main>
        <Hero slides={homePage.sliderMain} />
        <BrochureBlock brochure={homePage.brochureBlock} />
        <AboutBlock aboutBlock={homePage.aboutBlock} />
        <DescriptionBlock descriptionBlock={homePage.descriptionBlock} />
        <NewListnigs lang={params.lang} />
        <BenefitsBlock benefitsBlock={homePage.benefitsBlock} />
        <HowWeWorkBlock work={homePage.howWeWorkBlock} />
        <DevelopersLogos
          logos={homePage.logosBlock?.logos}
          lang={params.lang}
        />
        <ParallaxImage image={homePage.parallaxImage} />
        <ReviewsFullBlockComponent
          block={homePage.reviewsFullBlock}
          lang={params.lang}
        />
        {/* <Reviews reviews={homePage.reviewsBlock} /> */}
        <FormStatic lang={params.lang} />
        <Footer params={params} />
        <ModalBrochure lang={params.lang} formDocument={formDocument} />
      </main>
    </>
  );
}
