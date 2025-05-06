import {
  AccordionBlock,
  Seo,
  TextContent,
  ContactFullBlock,
  TeamBlock,
  LocationBlock,
  ImageFullBlock,
  DoubleTextBlock,
  ButtonBlock,
  ImageBulletsBlock,
  ReviewsFullBlock,
  ProjectsSectionBlock,
  FaqBlock,
  FormMinimalBlock,
  HowWeWorkBlock,
  BulletsBlock,
} from "./blog";
import { BenefitsBlock, Image } from "./homepage";
import { ImageAlt, Project } from "./project";

export type ProjectSection = {
  title: string;
  projects: Project[];
};

export type Singlepage = {
  _id: string;
  _type: string;
  title: string;
  seo: Seo;
  excerpt: string;
  previewImage: ImageAlt;
  allowIntroBlock: boolean;
  contentBlocks: Array<
    | TextContent
    | AccordionBlock
    | ContactFullBlock
    | TeamBlock
    | LocationBlock
    | ImageFullBlock
    | DoubleTextBlock
    | ButtonBlock
    | ImageBulletsBlock
    | BenefitsBlock
    | ReviewsFullBlock
    | ProjectsSectionBlock
    | FaqBlock
    | FormMinimalBlock
    | HowWeWorkBlock
    | BulletsBlock
  >;
  projectSection?: ProjectSection;
  subpages?: Singlepage[];
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
