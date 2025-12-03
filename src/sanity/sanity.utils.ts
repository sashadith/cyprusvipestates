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
import { ProjectsPage } from "@/types/projectsPage";
import { Developer } from "@/types/developer";
import { Blog } from "@/types/blog";
import { BlogPage } from "@/types/blogPage";

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
    descriptionBlock{
      _key,
      _type,
      title,
      descriptionFields[]{
        _key,
        _type,
        descriptionField
      }
    },
    projectsBlock,
    logosBlock,
    parallaxImage,
    benefitsBlock,
    howWeWorkBlock,
    reviewsFullBlock,
    reviewsBlock,
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
): Promise<Singlepage | null> {
  const singlePageQuery = groq`
    *[
      _type == "singlepage" &&
      language == $lang &&
      slug[$lang].current == $slug
    ][0] {
      _id,
      title,
      slug,
      seo,
      excerpt,
      previewImage,
      allowIntroBlock,
      contentBlocks[] {
      _type == "textContent" => {
          _key,
          _type,
          backgroundColor,
          paddingVertical,
          paddingHorizontal,
          marginTop,
          marginBottom,
          textAlign,
          textColor,
          backgroundFull,
          content[] {
          ...,
            _type == "image" => {
              _key,
              _type,
              alt,
              asset->{
                _ref,
                url,
                metadata { dimensions { width, height } }
              }
            }
          }
        },
        _type == "landingTextFirst" => {
          _key,
          _type,
          backgroundColor,
          paddingVertical,
          paddingHorizontal,
          marginTop,
          marginBottom,
          textAlign,
          textColor,
          backgroundFull,
          content[] {
          ...,
            _type == "image" => {
              _key,
              _type,
              alt,
              asset->{
                _ref,
                url,
                metadata { dimensions { width, height } }
              }
            }
          }
        },
        _type == "landingTextSecond" => {
          _key,
          _type,
          backgroundColor,
          paddingVertical,
          paddingHorizontal,
          marginTop,
          marginBottom,
          textAlign,
          textColor,
          backgroundFull,
          content[] {
          ...,
            _type == "image" => {
              _key,
              _type,
              alt,
              asset->{
                _ref,
                url,
                metadata { dimensions { width, height } }
              }
            }
          }
        },
        _type == "contactFullBlock" => {
          _key,
          _type,
          title,
          description,
          contacts,
          form->{
            _id,
            _type,
            language,
            form{ 
              inputName,
              inputPhone,
              inputCountry,
              inputEmail,
              inputMessage,
              buttonText,
              agreementText,
              agreementLinkLabel,
              agreementLinkDestination,
              validationNameRequired,
              validationPhoneRequired,
              validationCountryRequired,
              validationEmailRequired,
              validationEmailInvalid,
              validationMessageRequired,
              validationAgreementRequired,
              validationAgreementOneOf,
              successMessage,
              errorMessage
            }
          }
        },
        _type == "formMinimalBlock" => {
          _key,
          _type,
          title,
          buttonText,
          form->{
            _id,
            _type,
            language,
            form{
              inputName,
              inputPhone,
              inputCountry,
              inputEmail,
              inputMessage,
              buttonText,
              agreementText,
              agreementLinkLabel,
              agreementLinkDestination,
              validationNameRequired,
              validationPhoneRequired,
              validationCountryRequired,
              validationEmailRequired,
              validationEmailInvalid,
              validationMessageRequired,
              validationAgreementRequired,
              validationAgreementOneOf,
              successMessage,
              errorMessage
            }
          },
          marginTop,
          marginBottom
        },
        _type == "projectsSectionBlock" => {
          _key,
          _type,
          title,
          filterCity,
          filterPropertyType,
          projects[]->{
            _id,
            title,
            excerpt,
            previewImage,
            "slug": slug[$lang].current,
            keyFeatures
          },
          "filteredProjects": *[
            _type == "project" &&
            language == $lang &&
            (!defined(^.filterCity) || keyFeatures.city == ^.filterCity) &&
            (!defined(^.filterPropertyType) || keyFeatures.propertyType == ^.filterPropertyType) &&
            defined(previewImage.asset) &&
            !(_id in [
              "project-akamantis-gardens-de",
              "project-akamantis-gardens-en",
              "project-akamantis-gardens-pl",
              "project-akamantis-gardens-ru",
              "drafts.project-akamantis-gardens-en"
            ])
          ] | order(keyFeatures.price asc)[]{
            _id,
            title,
            "slug": slug[$lang].current,
            previewImage,
            keyFeatures
          },
          marginTop,
          marginBottom
        },
        _type == "landingProjectsBlock" => {
          _key,
          _type,
          title,
          filterCity,
          filterPropertyType,
          projects[]->{
            _id,
            title,
            excerpt,
            previewImage,
            "slug": slug[$lang].current,
            keyFeatures
          },
          "filteredProjects": *[
            _type == "project" &&
            language == $lang &&
            (!defined(^.filterCity) || keyFeatures.city == ^.filterCity) &&
            (!defined(^.filterPropertyType) || keyFeatures.propertyType == ^.filterPropertyType) &&
            defined(previewImage.asset) &&
            !(_id in [
              "project-akamantis-gardens-de",
              "project-akamantis-gardens-en",
              "project-akamantis-gardens-pl",
              "project-akamantis-gardens-ru",
              "drafts.project-akamantis-gardens-en"
            ])
          ] | order(keyFeatures.price asc)[]{
            _id,
            title,
            "slug": slug[$lang].current,
            previewImage,
            keyFeatures
          },
        },
        _type != "textContent" &&
        _type != "landingProjectsBlock" &&
        _type != "landingTextFirst" &&
        _type != "landingTextSecond" &&
        _type != "contactFullBlock" &&
        _type != "formMinimalBlock" &&
        _type != "projectsSectionBlock" => @
      },
      "parentPage": parentPage->{
        _id,
        title,
        slug,
        "_translations": *[
          _type == "translation.metadata" &&
          references(^._id)
        ].translations[].value->{
          slug
        }
      },
      language,
      "_translations": *[
        _type == "translation.metadata" &&
        references(^._id)
      ].translations[].value->{
        slug
      }
    }
  `;

  return await client.fetch(singlePageQuery, { lang, slug });
}

export async function getAllSinglePagesByLang(lang: string): Promise<
  {
    _id: string;
    slug: { [lang: string]: { current: string } };
    parentPage?: { slug: { [lang: string]: { current: string } } };
  }[]
> {
  const query = groq`
    *[_type == "singlepage" && language == $lang]{
      _id,
      "slug": slug,
      "parentPage": parentPage->{ slug }
    }
  `;
  return await client.fetch(query, { lang });
}

export async function getAllPathsForLang(lang: string): Promise<string[][]> {
  const items: { current: string; parent?: string }[] = await client.fetch(
    groq`
      *[_type=='singlepage' && language==$lang]{
        "current": slug[$lang].current,
        "parent": parentPage->slug[$lang].current
      }
    `,
    { lang }
  );

  // строим дерево — точно так же, как в generateStaticParams
  const map: Record<string, string[]> = {};
  items.forEach(({ current, parent }) => {
    if (!parent) map[current] = [current];
  });
  let added = true;
  while (added) {
    added = false;
    items.forEach(({ current, parent }) => {
      if (parent && map[parent] && !map[current]) {
        map[current] = [...map[parent], current];
        added = true;
      }
    });
  }
  return Object.values(map);
}

// === Blog Post ===
export async function getBlogPostByLang(
  lang: string,
  slug: string
): Promise<Blog> {
  const blogQuery = groq`
    *[
      _type == "blog" &&
      language == $lang &&
      slug[$lang].current == $slug
    ][0] {
      _id,
      title,
      slug,
      seo {
        metaTitle,
        metaDescription
      },
      publishedAt,
      category->{
        _id,
        title,
        slug
      },
      previewImage {
        asset->{
          _id,
          url,
          metadata { dimensions { width, height } }
        },
        alt
      },
      excerpt,
      contentBlocks[] {
        // === текстовый блок ===
        _type == "textContent" => {
          _key,
          _type,
          backgroundColor,
          paddingVertical,
          paddingHorizontal,
          marginTop,
          marginBottom,
          textAlign,
          textColor,
          backgroundFull,
          content[] {
            ..., // все стандартные поля блоков Portable Text
            // для вставленных картинок вытянем размеры
            _type == "image" => {
              _key,
              _type,
              alt,
              asset->{
                _id,
                url,
                metadata { dimensions { width, height } }
              }
            }
          }
        },
        // === минимальная форма ===
        _type == "formMinimalBlock" => {
          _key,
          _type,
          title,
          buttonText,
          marginTop,
          marginBottom,
          form->{
            _id,
            _type,
            language,
            form {
              inputName,
              inputPhone,
              inputCountry,
              inputEmail,
              inputMessage,
              buttonText,
              agreementText,
              agreementLinkLabel,
              agreementLinkDestination,
              validationNameRequired,
              validationPhoneRequired,
              validationCountryRequired,
              validationEmailRequired,
              validationEmailInvalid,
              validationMessageRequired,
              validationAgreementRequired,
              validationAgreementOneOf,
              successMessage,
              errorMessage
            }
          }
        },
        // === секция проектов ===
        _type == "projectsSectionBlock" => {
          _key,
          _type,
          title,
          filterCity,
          filterPropertyType,
          projects[]->{
            _id,
            title,
            excerpt,
            previewImage {
              asset->{
                _id,
                url,
                metadata { dimensions { width, height } }
              },
              alt
            },
            "slug": slug[$lang].current,
            keyFeatures
          },
          "filteredProjects": *[
            _type == "project" &&
            language == $lang &&
            (!defined(^.filterCity) || keyFeatures.city == ^.filterCity) &&
            (!defined(^.filterPropertyType) || keyFeatures.propertyType == ^.filterPropertyType) &&
            !(_id in [
              "project-akamantis-gardens-de",
              "project-akamantis-gardens-en",
              "project-akamantis-gardens-pl",
              "project-akamantis-gardens-ru",
              "drafts.project-akamantis-gardens-en"
            ]) &&
            !(_id match "drafts.*")
          ] | order(keyFeatures.price asc)[] {
            _id,
            title,
            previewImage {
              asset->{
                _id,
                url,
                metadata { dimensions { width, height } }
              },
              alt
            },
            "slug": slug[$lang].current,
            keyFeatures
          },
          marginTop,
          marginBottom
        },
        // все прочие блоки пропускаем «как есть»
        _type != "textContent" &&
        _type != "contactFullBlock" &&
        _type != "formMinimalBlock" &&
        _type != "projectsSectionBlock" => @
      },
      videoBlock {
        videoId,
        posterImage {
          asset->{
            _id,
            url,
            metadata { dimensions { width, height } }
          },
          alt
        }
      },
      popularProperties[] {
        label,
        link
      },
      language,
      "_translations": *[
        _type == "translation.metadata" &&
        references(^._id)
      ].translations[].value-> {
        slug
      }
    }
  `;

  const blog = await client.fetch(
    blogQuery,
    { lang, slug },
    { next: { revalidate: 60 } }
  );
  return blog;
}
// === Blog Post ===

// === Blog Page All ===
export async function getBlogPageByLang(lang: string): Promise<BlogPage> {
  const blogPageQuery = groq`*[_type == "blogPage" && language == $lang][0] {
    _id,
    title,
    metaTitle,
    metaDescription,
    content,
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const blogPage = await client.fetch(
    blogPageQuery,
    { lang },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return blogPage;
}
// === Blog Page All ===

// === Blog Posts All ===
export async function getBlogPostsByLang(lang: string): Promise<Blog[]> {
  const blogPostsQuery = groq`*[_type == 'blog' && language == $lang] | order(publishedAt desc) {
    _id,
    title,
    slug,
    previewImage,
    category->{
      title,
      slug
    },
    publishedAt,
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const blogPosts = await client.fetch(
    blogPostsQuery,
    { lang },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return blogPosts;
}
// === Blog Posts All ===

// === Blog Posts with Pagination ===
export async function getBlogPostsByLangWithPagination(
  lang: string,
  limit: number,
  offset: number
): Promise<Blog[]> {
  const blogPostsQuery = groq`
    *[_type == "blog" && language == $lang] | order(publishedAt desc)[$offset...$offset + $limit] {
      _id,
      title,
      excerpt,
      slug,
      previewImage,
      category->{
        title,
        slug
      },
      publishedAt,
      language,
      "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
        slug,
      },
    }
  `;

  const blogPosts = await client.fetch(
    blogPostsQuery,
    { lang, limit, offset },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return blogPosts;
}
// === Blog Posts with Pagination ===

// === Blog Posts Count ===
export async function getTotalBlogPostsByLang(lang: string): Promise<number> {
  const totalPostsQuery = groq`count(*[_type == "blog" && language == $lang])`;
  const total = await client.fetch(totalPostsQuery, { lang });
  return total;
}
// === Blog Posts Count ===

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

export async function getProjectsPageByLang(
  lang: string
): Promise<ProjectsPage> {
  const projectsPageQuery = groq`*[_type == "projectsPage" && language == $lang][0] {
    _id,
    seo,
    title,
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const projects = await client.fetch(
    projectsPageQuery,
    { lang },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return projects;
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
    description[]{
      ...,
        _type == "image" => {
              _key,
              _type,
              alt,
              asset->{
                _id,
                url,
                metadata { dimensions { width, height } }
              }
            }
      },
    location,
    developer,
    keyFeatures,
    distances,
    fullDescription[]{
      ...,
      _type == "image" => {
        _key,
        _type,
        alt,
        asset->{
          _id,
          url,
          metadata { dimensions { width, height } }
        }
      }
    },
    faq,
    isSold,
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

export async function getAllDevelopersByLang(
  lang: string
): Promise<Developer[]> {
  const query = groq`
    *[_type == "developer" && language == $lang] | order(_createdAt desc) {
      _id,
      title,
      slug
    }
  `;
  const developers = await client.fetch(query, { lang });
  return developers;
}

export async function getDeveloperByLang(
  lang: string,
  slug: string
): Promise<Developer | null> {
  const developerQuery = groq`*[_type == "developer" && slug[$lang].current == $slug][0] {
    _id,
    seo,
    slug,
    title,
    titleFull,
    excerpt,
    logo,
    description[]{
      ...,
      _type == "image" => {
        _key,
        _type,
        alt,
        asset->{
          _id,
          url,
          metadata { dimensions { width, height } }
        }
      },
    },
    language,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      slug,
    },
  }`;

  const developer = await client.fetch(developerQuery, { lang, slug });

  return developer;
}

export async function getProjectsByDeveloper(
  lang: string,
  developerId: string
): Promise<Project[]> {
  const query = groq`
    *[
      _type == "project" &&
      language == $lang &&
      developer._ref == $developerId
    ] | order(_createdAt desc) {
      _id,
      title,
      slug,
      previewImage,
      keyFeatures,
      language
    }
  `;

  const projects = await client.fetch(query, { lang, developerId });
  return projects;
}

export async function getThreeProjectsBySameCity(
  lang: string,
  city: string,
  excludeProjectId?: string // чтобы исключить текущий проект
) {
  const query = groq`
    *[
      _type == "project" &&
      language == $lang &&
      keyFeatures.city == $city &&
      defined(previewImage.asset) &&
      isSold != true &&
      !(_id in [
        "project-akamantis-gardens-de",
        "project-akamantis-gardens-en",
        "project-akamantis-gardens-pl",
        "project-akamantis-gardens-ru",
        "drafts.project-akamantis-gardens-en"
      ]) &&
      !(_id match "drafts.*") &&
      ($excludeProjectId == null || _id != $excludeProjectId)
    ] | order(_createdAt desc)[0...3] {
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

export async function getLastFiveProjectsByLang(
  lang: string
): Promise<Project[]> {
  const lastFiveProjectsQuery = groq`
    *[
      _type == "project" &&
      language == $lang &&
      defined(previewImage) &&
      !(_id in [
        "project-akamantis-gardens-de",
        "project-akamantis-gardens-en",
        "project-akamantis-gardens-pl",
        "project-akamantis-gardens-ru",
        "drafts.project-akamantis-gardens-en"
      ])
    ] | order(_createdAt desc)[0...5] {
      _id,
      title,
      slug,
      previewImage,
      keyFeatures
    }
  `;

  const projects = await client.fetch(
    lastFiveProjectsQuery,
    { lang },
    {
      next: { revalidate: 60 },
    }
  );

  return projects;
}

export async function getAllProjectsByLang(lang: string): Promise<Project[]> {
  const allProjectsQuery = groq`*[_type == "project" && language == $lang] | order(_createdAt desc) {
    _id,
    title,
    slug,
    previewImage,
    keyFeatures,
    language
  }`;

  const projects = await client.fetch(allProjectsQuery, { lang });
  return projects;
}

export async function getFilteredProjects(
  lang: string,
  skip: number,
  limit: number,
  filters: {
    city?: string;
    priceFrom?: number | null;
    priceTo?: number | null;
    propertyType?: string;
    q?: string;
    sort?: string;
    // ⬇⬇⬇ новенькое:
    north?: number | null;
    south?: number | null;
    east?: number | null;
    west?: number | null;
  }
) {
  const {
    city = "",
    priceFrom = null,
    priceTo = null,
    propertyType = "",
    q = "",
    sort = "priceAsc",
    north = null,
    south = null,
    east = null,
    west = null,
  } = filters;

  const orderClause =
    sort === "priceAsc"
      ? "keyFeatures.price asc"
      : sort === "priceDesc"
        ? "keyFeatures.price desc"
        : sort === "titleAsc"
          ? "title asc"
          : sort === "titleDesc"
            ? "title desc"
            : "_createdAt desc";

  const qPattern = q && q.length >= 3 ? `${q}*` : "";

  const query = groq`
*[
  _type == "project" &&
  language == $lang &&
  defined(previewImage.asset) &&
  isSold != true &&
  !(_id in [
    "project-akamantis-gardens-de",
    "project-akamantis-gardens-en",
    "project-akamantis-gardens-pl",
    "project-akamantis-gardens-ru",
    "drafts.project-akamantis-gardens-en"
  ]) &&
  ($city == "" || keyFeatures.city == $city) &&
  ($propertyType == "" || keyFeatures.propertyType == $propertyType) &&
  ($priceFrom == null || keyFeatures.price >= $priceFrom) &&
  ($priceTo == null || keyFeatures.price <= $priceTo) &&
  (
    $qPattern == "" ||
    title match $qPattern ||
    excerpt match $qPattern
  ) &&
  // ⬇⬇⬇ bbox (включается только если все 4 заданы)
  (
    $north == null || $south == null || $east == null || $west == null ||
    (defined(location.lat) && defined(location.lng) &&
    location.lat <= $north && location.lat >= $south &&
    location.lng <= $east  && location.lng >= $west)
  )
]
| order(
  ($qPattern != "" && title match $qPattern) desc,
  ($qPattern != "" && excerpt match $qPattern) desc,
  ${orderClause}
)
[${skip}...${skip + limit}]{
  _id,
  title,
  "slug": slug[$lang],
  previewImage,
  keyFeatures,
  isSold,
  videoId,
  "isNew": _id in *[
    _type == "project" &&
    language == $lang &&
    !(_id match "drafts.*")
  ] | order(_createdAt desc)[0...15]._id
}`;

  return client.fetch(query, {
    lang,
    city,
    priceFrom,
    priceTo,
    propertyType,
    qPattern,
    north,
    south,
    east,
    west,
  });
}

export async function getFilteredProjectsCount(
  lang: string,
  filters: {
    city?: string;
    priceFrom?: number | null;
    priceTo?: number | null;
    propertyType?: string;
    q?: string;
    // ⬇⬇⬇
    north?: number | null;
    south?: number | null;
    east?: number | null;
    west?: number | null;
  }
) {
  const {
    city = "",
    priceFrom = null,
    priceTo = null,
    propertyType = "",
    q = "",
    north = null,
    south = null,
    east = null,
    west = null,
  } = filters;

  const qPattern = q && q.length >= 3 ? `${q}*` : "";

  const query = groq`
count(*[
  _type == "project" &&
  language == $lang &&
  defined(previewImage.asset) &&
  isSold != true &&
  !(_id in [
    "project-akamantis-gardens-de",
    "project-akamantis-gardens-en",
    "project-akamantis-gardens-pl",
    "project-akamantis-gardens-ru",
    "drafts.project-akamantis-gardens-en"
  ]) &&
  ($city == "" || keyFeatures.city == $city) &&
  ($propertyType == "" || keyFeatures.propertyType == $propertyType) &&
  ($priceFrom == null || keyFeatures.price >= $priceFrom) &&
  ($priceTo == null || keyFeatures.price <= $priceTo) &&
  (
    $qPattern == "" ||
    title match $qPattern ||
    excerpt match $qPattern
  ) &&
  (
    $north == null || $south == null || $east == null || $west == null ||
    (defined(location.lat) && defined(location.lng) &&
    location.lat <= $north && location.lat >= $south &&
    location.lng <= $east  && location.lng >= $west)
  )
])`;

  return client.fetch(query, {
    lang,
    city,
    priceFrom,
    priceTo,
    propertyType,
    qPattern,
    north,
    south,
    east,
    west,
  });
}

export async function getFilteredProjectLocationsByLang(
  lang: string,
  filters: {
    city?: string;
    priceFrom?: number | null;
    priceTo?: number | null;
    propertyType?: string;
    q?: string;
    // ⬇⬇⬇
    north?: number | null;
    south?: number | null;
    east?: number | null;
    west?: number | null;
  }
) {
  const {
    city = "",
    priceFrom = null,
    priceTo = null,
    propertyType = "",
    q = "",
    north = null,
    south = null,
    east = null,
    west = null,
  } = filters;

  const qPattern = q && q.length >= 3 ? `${q}*` : "";

  const query = groq`
*[
  _type == "project" &&
  language == $lang &&
  defined(location.lat) && defined(location.lng) &&
  isSold != true &&
  !(_id in [
    "project-akamantis-gardens-de",
    "project-akamantis-gardens-en",
    "project-akamantis-gardens-pl",
    "project-akamantis-gardens-ru",
    "drafts.project-akamantis-gardens-en"
  ]) &&
  ($city == "" || keyFeatures.city == $city) &&
  ($propertyType == "" || keyFeatures.propertyType == $propertyType) &&
  ($priceFrom == null || keyFeatures.price >= $priceFrom) &&
  ($priceTo == null || keyFeatures.price <= $priceTo) &&
  (
    $qPattern == "" ||
    title match $qPattern ||
    excerpt match $qPattern
  ) &&
  (
    $north == null || $south == null || $east == null || $west == null ||
    (location.lat <= $north && location.lat >= $south &&
    location.lng <= $east  && location.lng >= $west)
  )
]{
  _id,
  title,
  "slug": slug[$lang].current,
  "location": { "lat": location.lat, "lng": location.lng },
  "city": keyFeatures.city,
  "price": keyFeatures.price,
  "previewUrl": coalesce(previewImage.asset->url, images[0].asset->url),
  "previewAlt": coalesce(previewImage.alt, title)
}`;
  return client.fetch(query, {
    lang,
    city,
    priceFrom,
    priceTo,
    propertyType,
    qPattern,
    north,
    south,
    east,
    west,
  });
}

export async function getAllProjectsLocationsByLang(lang: string): Promise<
  {
    _id: string;
    title: string;
    slug: string;
    location: { lat: number; lng: number };
    city?: string;
    price?: number;
    previewUrl?: string; // ⟵ добавили
    previewAlt?: string; // ⟵ добавили
  }[]
> {
  const query = groq`
    *[
      _type == "project" &&
      language == $lang &&
      defined(location.lat) && defined(location.lng) &&
      !(_id match "drafts.*")
    ]{
      _id,
      title,
      "slug": slug[$lang].current,
      location,
      "city": keyFeatures.city,
      "price": keyFeatures.price,
      // основной превью
      "previewUrl": coalesce(previewImage.asset->url, images[0].asset->url),
      "previewAlt": coalesce(previewImage.alt, title)
    }
  `;
  return await client.fetch(query, { lang });
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
