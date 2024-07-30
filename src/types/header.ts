type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

type Phone = {
  _key: string;
  phone: string;
  phoneLabel: string;
};

type LinkItem = {
  _key: string;
  label: string;
  link: string;
};

export type Header = {
  _type: "header";
  _id: string;
  _rev: string;
  logo: Image;
  phones: Phone[];
  menuItems: LinkItem[];
  linkItems: LinkItem[];
};
