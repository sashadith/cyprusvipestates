// src/app/[lang]/partners/page.tsx
import React from "react";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import { i18n } from "@/i18n.config";
import { getTranslations } from "next-intl/server";
import { Translation } from "@/types/homepage";
import WhatsAppButton from "@/app/components/WhatsAppButton/WhatsAppButton";
import PartnersHero from "@/app/components/PartnersPage/PartnersHero/PartnersHero";
import ModalBrochure from "@/app/components/ModalBrochure/ModalBrochure";

type Props = {
  params: { lang: string };
};

const PartnersPage = async ({ params }: Props) => {
  const { lang } = params;

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
        </div>
      </main>

      <Footer params={params} />
    </>
  );
};

export default PartnersPage;
