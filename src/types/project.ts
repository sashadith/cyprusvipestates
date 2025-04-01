export type AccordionBlock = {
  _key: string;
  _type: "accordionBlock";
  items: Array<{
    _key: string;
    question: string;
    answer: any; // Убедитесь, что поле называется 'answer', если оно содержит данные
  }>;
};

type PropertyType = "Apartment" | "Villa";

type PropertyPurpose = "Sale" | "Rent";

type PropertyTypeClassification =
  | "Residential"
  | "Commercial"
  | "Investment"
  | "Exclusive";

type MarketType = "Primary" | "Secondary";

type Cities = "Paphos" | "Limassol" | "Larnaca";

type EnergyEfficiency = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type ImageAlt = {
  _key: string;
  _type: "image";
  alt?: string; // Добавлено поле alt для текстового описания изображения
  asset: {
    _ref: string;
    _type: "reference";
  };
};

export type Developer = {
  _id: string;
  _type: string;
  title: string;
  logo: ImageAlt;
  description: any;
  slug: string;
  language: string;
};

export type GeoPoint = {
  _type: "geopoint";
  lat: number;
  lng: number;
  alt?: number;
};

export type KeyFeatures = {
  city: Cities;
  propertyType: PropertyType;
  bedrooms: string;
  coveredArea: string;
  plotSize: string;
  energyEfficiency: EnergyEfficiency;
  price: number;
  lang: string;
};

export type Distances = {
  beach: string;
  shops: string;
  airport: string;
  hospital: string;
  school: string;
  cityCenter: string;
  golfCourt: string;
  restaurants: string;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
};

export type Project = {
  _id: string;
  _type: "project";
  seo: Seo;
  title: string;
  excerpt: string;
  previewImage: ImageAlt;
  videoId: string;
  videoPreview: ImageAlt;
  images: ImageAlt[];
  description: any;
  location: GeoPoint;
  developer: Developer;
  keyFeatures: KeyFeatures;
  distances: Distances;
  fullDescription: any;
  faq: AccordionBlock;
  // isActual: boolean;
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
