import { AccordionBlock, Seo, TextContent } from "./blog";
import { Image } from "./homepage";

export type Singlepage = {
  _id: string;
  _type: string;
  title: string;
  // slug: string;
  seo: Seo;
  previewImage: Image;
  contentBlocks: Array<TextContent | AccordionBlock>;
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
