import { FormStandardDocument } from "./formStandardDocument";
import { GeoPoint, ImageAlt } from "./project";

type ContactType = "Email" | "Phone" | "Link";

export type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
};

export type UnknownBlock = {
  _key: string;
  _type: string;
};

export type VideoBlock = {
  _key: string;
  videoId: string;
  posterImage: Image;
};

export type TextContent = {
  _key: string;
  _type: string;
  content: any;
};

export type DoubleImagesBlock = {
  _key: string;
  _type: string;
  leftImage: Image;
  rightImage: Image;
};

export type FullContact = {
  _key: string;
  _type: string;
  icon: Image;
  title: string;
  label: string;
  type: ContactType;
};

export type ContactFullBlock = {
  _key: string;
  _type: string;
  title: string;
  description: string;
  contacts: FullContact[];
  form: FormStandardDocument;
};

export type Member = {
  _key: string;
  image: ImageAlt;
  name: string;
  position: string;
  description: string;
};

export type TeamBlock = {
  _key: string;
  _type: string;
  title: string;
  members: Member[];
};

export type LocationBlock = {
  _key: string;
  _type: string;
  title: string;
  location: GeoPoint;
};

// === Типы для imageFullBlock ===

/** Элемент текста с флагом подсветки */
export type TextItem = {
  text: string;
  highlighted: boolean;
};

/** Описание блока: массив текстовых элементов и тег-обёртка */
export type DescriptionFull = {
  textItems: TextItem[];
  tag: "h1" | "h2" | "h3" | "p";
};

/** Основное изображение с альтернативным текстом и соотношением сторон */
export type ImageMain = {
  picture: ImageAlt;
  aspectRatio: "16:9" | "4:3" | "1:1";
};

/** Полный блок изображения с опциональным описанием */
export type ImageFullBlock = {
  _key: string;
  _type: "imageFullBlock";
  title: string;
  imageMain: ImageMain;
  hasDescription: boolean;
  description?: DescriptionFull;
};
// === Конец типов для imageFullBlock ===

export type AccordionBlock = {
  _key: string;
  _type: "accordionBlock";
  items: Array<{
    _key: string;
    question: string;
    answer: any; // Убедитесь, что поле называется 'answer', если оно содержит данные
  }>;
};

export type TabsBlock = {
  _key: string;
  _type: string;
  tabTitle: string;
  tabImage: Image;
  tabContent: any;
};

export type Category = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  language: string;
};

export type RelatedArticle = {
  _id: string;
  title: string;
  category: Category;
  slug: {
    [lang: string]: {
      current: string;
    };
  };
  publishedAt: string;
  previewImage: Image;
};

export type Blog = {
  _id: string;
  _type: string;
  title: string;
  // slug: string;
  seo: Seo;
  category: Category;
  publishedAt: string;
  firstContent: any;
  previewImage: Image;
  contentBlocks: Array<TextContent | AccordionBlock>;
  videoBlock: VideoBlock;
  relatedArticles: RelatedArticle[];
  language: string;
  slug: {
    [lang: string]: {
      current: string;
    };
  };
  _translations: [
    {
      slug: {
        [lang: string]: {
          current: string;
        };
      };
    },
  ];
};
