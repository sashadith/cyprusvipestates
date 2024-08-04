type City = "Paphos" | "Limassol" | "Larnaca";
type PropertyType = "Apartment" | "Villa";

export type Translation = {
  path: string;
  language: string;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
};

export type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

export type File = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

export type Brochure = {
  _key: string;
  _type: string;
  title: string;
  description: string;
  buttonLabel: string;
  image: Image;
};

export type Slide = {
  _key: string;
  _type: string;
  image: Image;
  title: string;
  description: string;
  type: "link" | "button";
  linkLabel?: string;
  linkDestination?: string;
  buttonLabel?: string;
};

export type Bullet = {
  _key: string;
  _type: string;
  image: Image;
  text: string;
};

export type AboutBlock = {
  _key: string;
  _type: string;
  title: string;
  description: string;
  bullets: Bullet[];
};

export type Project = {
  _key: string;
  _type: string;
  title: string;
  description: string;
  image: Image;
  city: City;
  propertyType: PropertyType;
  adress: string;
  flatsAmount: string;
  area: string;
  price: string;
  buttonLabel: string;
  buttonAltLabel: string;
};

export type ProjectsBlock = {
  _key: string;
  _type: string;
  title: string;
  projects: Project[];
};

export type Homepage = {
  _type: "homepage";
  _id: string;
  _rev: string;
  title: string;
  seo: Seo;
  sliderMain: Slide[];
  homepageTitle: string;
  brochureBlock: Brochure;
  aboutBlock: AboutBlock;
  projectsBlock: ProjectsBlock;
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
