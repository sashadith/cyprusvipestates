import { Metadata } from "next";
import React from "react";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import { i18n } from "@/i18n.config";
import { getTranslations } from "next-intl/server";
import { Translation } from "@/types/homepage";
import { getFormStandardDocumentByLang } from "@/sanity/sanity.utils";
import { FormStandardDocument } from "@/types/formStandardDocument";
import WhatsAppButton from "@/app/components/WhatsAppButton/WhatsAppButton";
import PartnersHero from "@/app/components/PartnersPage/PartnersHero/PartnersHero";
import ModalBrochure from "@/app/components/ModalBrochure/ModalBrochure";
import PartnersBenefits from "@/app/components/PartnersPage/PartnersBenefits/PartnersBenefits";
import PartnersCta from "@/app/components/PartnersPage/PartnersCta/PartnersCta";
import PartnersStars from "@/app/components/PartnersPage/PartnersStars/PartnersStars";
import PartnersCount from "@/app/components/PartnersPage/PartnersCount/PartnersCount";
import PartnersContact from "@/app/components/PartnersPage/PartnersContact/PartnersContact";
import ModalPartners from "@/app/components/ModalPartners/ModalPartners";

type Props = {
  params: { lang: string };
};

const metadataByLang = {
  de: {
    title:
      "Partnerprogramm für Immobilienagenturen und Makler – Cyprus VIP Estates",
    description:
      "Werde Partner von Cyprus VIP Estates – verdiene bis zu 50 % Provision beim Verkauf exklusiver Immobilien auf Zypern.",
  },
  en: {
    title: "Partner Program for Real Estate Agents – Cyprus VIP Estates",
    description:
      "Become a partner of Cyprus VIP Estates – earn up to 50% commission by promoting luxury properties in Cyprus.",
  },
  pl: {
    title: "Program partnerski dla agentów nieruchomości – Cyprus VIP Estates",
    description:
      "Zostań partnerem Cyprus VIP Estates – zarabiaj do 50% prowizji, promując luksusowe nieruchomości na Cyprze.",
  },
  ru: {
    title:
      "Партнёрская программа для агентов по недвижимости – Cyprus VIP Estates",
    description:
      "Станьте партнёром Cyprus VIP Estates — зарабатывайте до 50% комиссии, продвигая элитную недвижимость на Кипре.",
  },
};

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;

  const fallback = metadataByLang.de;
  const meta = metadataByLang[lang as keyof typeof metadataByLang] || fallback;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: lang === "de" ? `/partners` : `/${lang}/partners`,
      languages: {
        de: "/partners",
        en: "/en/partners",
        pl: "/pl/partners",
        ru: "/ru/partners",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url:
        lang === "de"
          ? "https://cyprusvipestates.com/partners"
          : `https://cyprusvipestates.com/${lang}/partners`,
      siteName: "Cyprus VIP Estates",
      locale: lang,
      type: "website",
    },
  };
}

const PartnersPage = async ({ params }: Props) => {
  const { lang } = params;

  const formDocument: FormStandardDocument =
    await getFormStandardDocumentByLang(lang);

  // const t = await getTranslations({ locale: lang, namespace: "partners" });

  const translations: Translation[] = i18n.languages
    .filter((l) => l.id !== lang)
    .map((l) => ({
      language: l.id,
      path: l.id === "de" ? `/partners` : `/${l.id}/partners`,
    }));

  return (
    <>
      <Header params={params} translations={translations} />
      <main className="main-partners">
        <div className="partners-wrapper">
          <PartnersHero lang={lang} />
          <PartnersBenefits lang={lang} />
          <PartnersCta lang={lang} />
          <PartnersStars lang={lang} />
          <PartnersCount lang={lang} />
          <PartnersContact lang={lang} form={formDocument} />
        </div>
        <ModalPartners lang={params.lang} formDocument={formDocument} />
      </main>

      <Footer params={params} />
    </>
  );
};

export default PartnersPage;
