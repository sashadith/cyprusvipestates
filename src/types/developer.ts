import { ImageAlt, Seo } from "./project";

type Developers =
  | "Korantina Homes"
  | "Olias Homes"
  | "Medousa Developers"
  | "Kuutio Homes"
  | "Luma Development"
  | "Domenica Group"
  | "Leptos Estates"
  | "Pafilia"
  | "Aristo Developers"
  | "Island Blue"
  | "INEX Development"
  | "Prospecta Development"
  | "AGG Luxury Homes"
  | "Square One"
  | "MITO Developers";

export type Developer = {
  _key: string;
  _type: "developer";
  seo: Seo;
  title: Developers;
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
