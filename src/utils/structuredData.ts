import {
  ContactFullBlock,
  TeamBlock,
  LocationBlock,
  ReviewsFullBlock,
} from "@/types/blog";

/**
 * Тип входных данных для StructuredData
 */
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

// Type guards для проверки блока
export function isContactFullBlock(b: any): b is ContactFullBlock {
  return b._type === "contactFullBlock";
}
export function isLocationBlock(b: any): b is LocationBlock {
  return b._type === "locationBlock";
}
export function isTeamBlock(b: any): b is TeamBlock {
  return b._type === "teamBlock";
}
export function isReviewsFullBlock(b: any): b is ReviewsFullBlock {
  return b._type === "reviewsFullBlock";
}

/**
 * Генерация JSON-LD разметки по schema.org
 */
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
  let pageType: "AboutPage" | "ContactPage" | "WebPage" = "WebPage";
  if (aboutKeywords.some((kw) => slugLower.includes(kw))) {
    pageType = "AboutPage";
  } else if (contactsKeywords.some((kw) => slugLower.includes(kw))) {
    pageType = "ContactPage";
  }

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": pageType,
    name: metaTitle,
    description: metaDescription,
    url,
    hasPart: [] as any[],
  };

  for (const block of blocks) {
    if (isContactFullBlock(block)) {
      // ContactFullBlock.contacts: FullContact[]
      block.contacts.forEach((c) => {
        const cp: any = {
          "@type": "ContactPoint",
          contactType: c.type.toLowerCase(),
          availableLanguage: lang.toUpperCase(),
        };
        if (c.type === "Phone") {
          cp.telephone = c.label;
        } else if (c.type === "Email") {
          cp.email = c.label;
        } else if (c.type === "Link") {
          cp.url = c.label;
        }
        jsonLd.hasPart.push(cp);
      });
    } else if (isLocationBlock(block)) {
      jsonLd.hasPart.push({
        "@type": "Place",
        name: block.title,
        geo: {
          "@type": "GeoCoordinates",
          latitude: block.location.lat,
          longitude: block.location.lng,
        },
      });
    } else if (isTeamBlock(block)) {
      jsonLd.hasPart.push({
        "@type": "Organization",
        name: block.title,
        member: block.members.map((m) => ({
          "@type": "Person",
          name: m.name,
          jobTitle: m.position,
          description: m.description,
        })),
      });
    } else if (isReviewsFullBlock(block)) {
      block.reviews.forEach((r) => {
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
