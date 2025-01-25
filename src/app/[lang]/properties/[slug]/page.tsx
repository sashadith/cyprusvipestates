import React from "react";
import { Metadata } from "next";
import {
  getFormStandardDocumentByLang,
  getPropertyByLang,
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

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(params.lang);

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

  const MapWithNoSSR = dynamic(
    () => import("../../../components/PropertyMap/PropertyMap"),
    {
      ssr: false,
    }
  );

  return (
    <>
      <Header params={params} translations={translations} />
      <PropertySlider images={property.images} />
      <PropertyIntro
        title={property.title}
        price={property.price}
        images={property.images}
        videoId={property.videoId}
        floorSize={property.floorSize}
        rooms={property.rooms}
        lang={lang}
      />
      <PropertyDistances distances={property.distances || {}} />
      <PropertyFeatures
        city={property.city}
        district={property.district}
        type={property.type}
        rooms={property.rooms}
        floorSize={property.floorSize}
        hasParking={property.hasParking}
        hasPool={property.hasPool}
        lang={lang}
      />
      <PropertyDescription description={property.description} />
      <MapWithNoSSR lat={property.location.lat} lng={property.location.lng} />
      <Footer params={params} />
      <ModalBrochure lang={params.lang} formDocument={formDocument} />
    </>
  );
};

export default PropertyPage;
