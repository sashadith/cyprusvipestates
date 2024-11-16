import React from "react";
import { Metadata } from "next";
import { getPropertyByLang } from "@/sanity/sanity.utils";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import { i18n } from "@/i18n.config";
import { Translation } from "@/types/homepage";
import PropertyIntro from "@/app/components/PropertyIntro/PropertyIntro";
import PropertyDescription from "@/app/components/PropertyDescription/PropertyDescription";

type Props = {
  params: { lang: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;
  const data = await getPropertyByLang(lang, slug);

  return {
    title: data?.seo.metaTitle,
    description: data?.seo.metaDescription,
  };
}

const PropertyPage = async ({ params }: Props) => {
  const { lang, slug } = params;
  const property = await getPropertyByLang(lang, slug);

  if (!property) {
    return null;
  }

  const propertyPageTranslationSlugs: {
    [key: string]: { current: string };
  }[] = property?._translations.map((item) => {
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
            path: `/${lang.id}/property/${translationSlug}`,
          },
        ]
      : acc;
  }, []);

  console.log("property", property);

  return (
    <>
      <Header params={params} translations={translations} />
      <PropertyIntro
        title={property.title}
        price={property.price}
        images={property.images}
        videoId={property.videoId}
        area={property.area}
        rooms={property.rooms}
        lang={lang}
      />
      <PropertyDescription description={property.description} />
      <Footer params={params} />
    </>
  );
};

export default PropertyPage;
