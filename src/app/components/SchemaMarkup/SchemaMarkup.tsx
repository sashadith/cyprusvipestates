import Head from "next/head";
import { urlFor } from "@/sanity/sanity.client";

interface SchemaMarkupProps {
  project: any;
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ project }) => {
  // Определяем тип объекта недвижимости.
  // Здесь в качестве примера: если тип "Apartment" – используем тип "Apartment", иначе "House".
  const schemaType =
    project.keyFeatures.propertyType === "Apartment" ? "Apartment" : "House";

  // Формируем дополнительные характеристики в виде массива PropertyValue
  const additionalProperties = [
    {
      "@type": "PropertyValue",
      name: "Bedrooms",
      value: project.keyFeatures.bedrooms,
    },
    {
      "@type": "PropertyValue",
      name: "Covered Area",
      value: project.keyFeatures.coveredArea,
    },
    {
      "@type": "PropertyValue",
      name: "Plot Size",
      value: project.keyFeatures.plotSize,
    },
    {
      "@type": "PropertyValue",
      name: "Energy Efficiency",
      value: project.keyFeatures.energyEfficiency,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: project.title,
    description: project.excerpt,
    // Если есть несколько изображений, создаём массив URL
    image: project.images?.map((img: any) => urlFor(img).url()),
    address: {
      "@type": "PostalAddress",
      addressLocality: project.keyFeatures.city,
      addressCountry: "CY", // ISO-код для Кипра
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: project.location.lat,
      longitude: project.location.lng,
    },
    offers: {
      "@type": "Offer",
      price: project.keyFeatures.price,
      priceCurrency: "EUR",
      // Пример: если объект на продажу, ставим InStock, если на аренду – ForRent
      availability:
        project.propertyPurpose === "Sale"
          ? "https://schema.org/InStock"
          : "https://schema.org/ForRent",
    },
    seller: {
      "@type": "Organization",
      name: project.developer?.name,
      logo: project.developer?.logo
        ? urlFor(project.developer.logo).url()
        : undefined,
    },
    additionalProperty: additionalProperties,
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Head>
  );
};

export default SchemaMarkup;
