export type Seo = {
  metaTitle: string;
  metaDescription: string;
};

export type Homepage = {
  _type: "homepage";
  _id: string;
  _rev: string;
  title: string;
  seo: Seo;
  homepageTitle: string;
  homepageDescription: string;
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
