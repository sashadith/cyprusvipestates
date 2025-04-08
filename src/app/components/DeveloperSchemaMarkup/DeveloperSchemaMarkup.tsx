// components/DeveloperSchemaMarkup.tsx
import Script from "next/script";
import { urlFor } from "@/sanity/sanity.client";

interface DeveloperSchemaMarkupProps {
  developer: any;
  pageUrl: string;
}

const DeveloperSchemaMarkup: React.FC<DeveloperSchemaMarkupProps> = ({
  developer,
  pageUrl,
}) => {
  // Формируем JSON‑LD для застройщика как организации
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: developer.title, // или, если есть поле titleFull, можно его использовать
    url: pageUrl,
    logo: developer.logo ? urlFor(developer.logo).url() : undefined,
    description:
      developer.excerpt ||
      (typeof developer.description === "string" ? developer.description : ""),
    // Дополнительно можно добавить ссылки на соцсети или контактные данные, если они есть
  };

  return (
    <Script
      id="schema-org-developer"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(schemaOrgJSONLD)}
    </Script>
  );
};

export default DeveloperSchemaMarkup;
