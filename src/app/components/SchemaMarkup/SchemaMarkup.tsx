// components/SchemaMarkup.tsx
import Script from "next/script";
import { urlFor } from "@/sanity/sanity.client";

interface SchemaMarkupProps {
  project: any;
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ project }) => {
  const schemaType =
    project.keyFeatures.propertyType === "Apartment" ? "Apartment" : "House";

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
    image: project.images?.map((img: any) => urlFor(img).url()),
    address: {
      "@type": "PostalAddress",
      addressLocality: project.keyFeatures.city,
      addressCountry: "CY",
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
    <Script
      id="schema-markup"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(jsonLd)}
    </Script>
  );
};

export default SchemaMarkup;
