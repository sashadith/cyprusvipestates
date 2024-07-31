export type Image = {
  _key: string;
  _ref: string;
  _type: string;
  url: string;
};

type navLink = {
  _key: string;
  label: string;
  link: string;
};

export type Header = {
  _type: "header";
  _id: string;
  _rev: string;
  logo: Image;
  logoMobile: Image;
  navLinks: navLink[];
};
