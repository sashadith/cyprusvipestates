// app/utils/structuredData.ts

import {
  ContactFullBlock,
  TeamBlock,
  LocationBlock,
  ReviewsFullBlock,
  ReviewFull,
} from "@/types/blog";

export type PageInput = {
  slug: string;
  lang: string;
  metaTitle: string;
  metaDescription: string;
  url: string;
  blocks: Array<
    ContactFullBlock | TeamBlock | LocationBlock | ReviewsFullBlock
  >;
};

// Type guards
function isContactFullBlock(b: any): b is ContactFullBlock {
  return b._type === "contactFullBlock";
}
function isLocationBlock(b: any): b is LocationBlock {
  return b._type === "locationBlock";
}
function isTeamBlock(b: any): b is TeamBlock {
  return b._type === "teamBlock";
}
function isReviewsFullBlock(b: any): b is ReviewsFullBlock {
  return b._type === "reviewsFullBlock";
}

export function generateStructuredData({
  slug,
  lang,
  metaTitle,
  metaDescription,
  url,
  blocks,
}: PageInput) {
  const aboutKeywords = ["ueber-uns", "about", "o-kompanii", "o-nas"];
  const contactsKeywords = ["kontakt", "contacts", "kontakty"];
  const slugLower = slug.toLowerCase();

  // Определяем тип страницы
  const pageType: "AboutPage" | "ContactPage" | "WebPage" = aboutKeywords.some(
    (kw) => slugLower.includes(kw)
  )
    ? "AboutPage"
    : contactsKeywords.some((kw) => slugLower.includes(kw))
      ? "ContactPage"
      : "WebPage";

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": pageType,
    name: metaTitle,
    description: metaDescription,
    url,
  };

  if (pageType === "ContactPage") {
    // Сбор ContactPoint-ов
    const contactPoints = blocks.filter(isContactFullBlock).flatMap((b) =>
      b.contacts.map((c) => {
        const cp: any = {
          "@type": "ContactPoint",
          contactType: c.type.toLowerCase(),
          availableLanguage: lang.toUpperCase(),
        };
        if (c.type === "Phone") cp.telephone = c.label;
        if (c.type === "Email") cp.email = c.label;
        if (c.type === "Link") cp.url = c.label;
        return cp;
      })
    );

    // Блок Location
    const loc = blocks.find(isLocationBlock);
    const place = loc
      ? {
          "@type": "Place",
          name: loc.title,
          geo: {
            "@type": "GeoCoordinates",
            latitude: loc.location.lat,
            longitude: loc.location.lng,
          },
        }
      : undefined;

    // Блок Team
    const members = blocks.filter(isTeamBlock).flatMap((b) =>
      b.members.map((m) => ({
        "@type": "Person",
        name: m.name,
        jobTitle: m.position,
        description: m.description,
      }))
    );

    jsonLd.mainEntity = {
      "@type": "Organization",
      name: metaTitle, // или реальное имя вашей компании
      url,
      ...(contactPoints.length && { contactPoint: contactPoints }),
      ...(place && { location: place }),
      ...(members.length && { member: members }),
    };

    return jsonLd;
  }

  // Для AboutPage и WebPage: пока обрабатываем только Reviews
  jsonLd.hasPart = [];

  for (const block of blocks) {
    if (isReviewsFullBlock(block)) {
      block.reviews.forEach((r: ReviewFull) => {
        jsonLd.hasPart.push({
          "@type": "Review",
          author: { "@type": "Person", name: r.name },
          reviewBody:
            typeof r.text === "string" ? r.text : JSON.stringify(r.text),
        });
      });
    }
  }

  return jsonLd;
}
