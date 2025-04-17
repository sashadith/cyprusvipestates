import { AccordionBlock, Seo, TextContent } from "./blog";
import { Image } from "./homepage";
import { Project } from "./project";

export type ProjectSection = {
  title: string;
  projects: Project[];
};

export type Singlepage = {
  _id: string;
  _type: string;
  title: string;
  seo: Seo;
  previewImage: Image;
  contentBlocks: Array<TextContent | AccordionBlock>;
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
