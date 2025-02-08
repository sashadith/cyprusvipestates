import { groq } from "next-sanity";
import { client } from "./sanity.client";
import { Homepage } from "@/types/homepage";
import { Header } from "@/types/header";
import { FormStandardDocument } from "@/types/formStandardDocument";
import { Singlepage } from "@/types/singlepage";
import { Property } from "@/types/property";
import { SanityFile } from "@/types/sanityFile";
import { PropertiesPage } from "@/types/propertiesPage";
import { Project } from "@/types/project";

export async function getHeaderByLang(lang: string): Promise<Header> {
  const headerQuery = groq`*[_type == "header" && language == $lang][0] {
    _id,
    logo,
    logoMobile,
    navLinks,
  }`;

  const header = await client.fetch(headerQuery, { lang });

  return header;
}

export async function getHomePageByLang(lang: string): Promise<Homepage> {
  const homepageQuery = groq`*[_type == 'homepage' && language == $lang][0] {
    _id,
    title,
    seo,
    sliderMain[]{
      _key,
      _type,
      image,
      title,
      description,
      type,
      linkLabel,
      linkDestination,
      buttonLabel,
    },
    brochureBlock,
    homepageTitle,
    aboutBlock,
    projectsBlock,
    parallaxImage,
    language,
    slug,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const homepage = await client.fetch(
    homepageQuery,
    { lang },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return homepage;
}

export async function getFooterByLang(lang: string) {
  const footerQuery = groq`*[_type == "footer" && language == $lang][0] {
    _id,
    logo,
    socialLinks,
    companyTitle,
    companyParagraphs,
    vatNumber,
    contactTitle,
    contacts,
    newsletterTitle,
    newsletterButtonLabel,
    copyright,
    policyLinks,
  }`;

  const footer = await client.fetch(footerQuery, { lang });

  return footer;
}

export async function getFormStandardDocumentByLang(
  lang: string
): Promise<FormStandardDocument> {
  const formStandardDocumentQuery = groq`*[_type == "formStandardDocument" && language == $lang][0] {
  _id,
  form,
  language
  }`;

  const formStandardDocument = await client.fetch(formStandardDocumentQuery, {
    lang,
  });

  return formStandardDocument;
}

export async function getSinglePageByLang(
  lang: string,
  slug: string
): Promise<Singlepage> {
  const singlePageQuery = groq`*[_type == 'singlepage' && slug[$lang].current == $slug][0] {
    _id,
    title,
    slug,
    seo,
    previewImage,
    contentBlocks,
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const singlePage = await client.fetch(singlePageQuery, { lang, slug });

  return singlePage;
}

export async function getPropertyByLang(
  lang: string,
  slug: string
): Promise<Property | null> {
  const propertyQuery = groq`*[_type == "property" && slug[$lang].current == $slug][0] {
    _id,
    seo,
    slug,
    title,
    excerpt,
    previewImage,
    price,
    videoId,
    videoPreview,
    images,
    address,
    city,
    district,
    description,
    type,
    purpose,
    propertyType,
    location,
    floorSize,
    rooms,
    hasParking,
    hasPool,
    distances,
    marketType,
    isActual,
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const property = await client.fetch(
    propertyQuery,
    { lang, slug },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return property;
}

export async function getProjectByLang(
  lang: string,
  slug: string
): Promise<Project | null> {
  const projectQuery = groq`*[_type == "project" && slug[$lang].current == $slug][0] {
    _id,
    seo,
    slug,
    title,
    excerpt,
    previewImage,
    videoId,
    videoPreview,
    images,
    description,
    location,
    developer,
    keyFeatures,
    distances[]{
      _key,
      _type,
      label,
      value,
      icon,
    },
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const project = await client.fetch(
    projectQuery,
    { lang, slug },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return project;
}

export async function getThreeProjectsBySameCity(
  lang: string,
  city: string,
  excludeProjectId?: string // чтобы исключить текущий проект
) {
  const query = groq`
    *[
      _type == "project" &&
      keyFeatures.city == $city &&
      language == $lang &&
      ($excludeProjectId == null || _id != $excludeProjectId)
    ]{
      _id,
      title,
      "slug": slug[$lang],
      previewImage,
      keyFeatures
    }
  `;
  const projects = await client.fetch(query, { lang, city, excludeProjectId });

  // Перемешиваем полученный массив случайным образом
  const shuffledProjects = projects.sort(() => Math.random() - 0.5);

  // Берем ровно первые 4 проекта (если их меньше 4 – вернутся все)
  return shuffledProjects.slice(0, 3);
}

// Функция для получения списка проектов с фильтрами и пагинацией
export async function getFilteredProjects(
  lang: string,
  skip: number,
  limit: number,
  filters: {
    city?: string;
    priceFrom?: number | null;
    priceTo?: number | null;
    roomsFrom?: number | null;
    roomsTo?: number | null;
  }
) {
  const {
    city = "",
    priceFrom = null,
    priceTo = null,
    roomsFrom = null,
    roomsTo = null,
  } = filters;
  const query = groq`
    *[
      _type == "project" &&
      language == $lang &&
      ($city == "" || keyFeatures.city == $city) &&
      ($priceFrom == null || price >= $priceFrom) &&
      ($priceTo == null || price <= $priceTo) &&
      ($roomsFrom == null || keyFeatures.bedrooms >= $roomsFrom) &&
      ($roomsTo == null || keyFeatures.bedrooms <= $roomsTo)
    ] | order(price asc)[${skip}...${skip + limit}]{
      _id,
      title,
      "slug": slug[$lang],
      previewImage,
      keyFeatures,
      price
    }
  `;
  return await client.fetch(query, {
    lang,
    city,
    priceFrom,
    priceTo,
    roomsFrom,
    roomsTo,
  });
}

// Функция для получения общего количества отфильтрованных проектов
export async function getFilteredProjectsCount(
  lang: string,
  filters: {
    city?: string;
    priceFrom?: number | null;
    priceTo?: number | null;
    roomsFrom?: number | null;
    roomsTo?: number | null;
  }
) {
  const {
    city = "",
    priceFrom = null,
    priceTo = null,
    roomsFrom = null,
    roomsTo = null,
  } = filters;
  const query = groq`
    count(
      *[
        _type == "project" &&
        language == $lang &&
        ($city == "" || keyFeatures.city == $city) &&
        ($priceFrom == null || price >= $priceFrom) &&
        ($priceTo == null || price <= $priceTo) &&
        ($roomsFrom == null || keyFeatures.bedrooms >= $roomsFrom) &&
        ($roomsTo == null || keyFeatures.bedrooms <= $roomsTo)
      ]
    )
  `;
  return await client.fetch(query, {
    lang,
    city,
    priceFrom,
    priceTo,
    roomsFrom,
    roomsTo,
  });
}

export async function getAllProperties(lang: string) {
  const query = groq`*[_type == "property" && language == $lang] | order(publishedAt desc) {
    _id,
    title,
    price,
    city,
    images,
    slug
  }`;

  const properties = await client.fetch(query, { lang });
  return properties;
}

export async function getFileBySlug(slug: string): Promise<SanityFile | null> {
  const query = groq`*[_type == "docFile" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    file {
      asset-> {
        url
      }
    }
  }`;

  const file: SanityFile | null = await client.fetch(query, { slug });
  return file;
}

export async function getPropertiesPageByLang(
  lang: string
): Promise<PropertiesPage> {
  const propertiesPageQuery = groq`*[_type == "propertiesPage" && language == $lang][0] {
    _id,
    metaTitle,
    metaDescription,
    title,
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const propertiesPage = await client.fetch(
    propertiesPageQuery,
    { lang },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return propertiesPage;
}
