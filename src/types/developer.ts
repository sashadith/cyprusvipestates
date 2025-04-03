import { ImageAlt, Seo } from "./project";

export type Developer = {
  _key: string;
  _type: "developer";
  seo: Seo;
  title: string;
  titleFull: string;
  excerpt: string;
  logo: ImageAlt;
  description: any;
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
