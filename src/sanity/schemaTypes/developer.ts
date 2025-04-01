import { defineField } from "sanity";

export const developers = [
  { title: "Korantina Homes", value: "Korantina Homes" },
  { title: "Olias Homes", value: "Olias Homes" },
  { title: "Medousa Developers", value: "Medousa Developers" },
  { title: "Kuutio Homes", value: "Kuutio Homes" },
  { title: "Luma Development", value: "Luma Development" },
  { title: "Domenica Group", value: "Domenica Group" },
  { title: "Leptos Estates", value: "Leptos Estates" },
  { title: "Pafilia", value: "Pafilia" },
  { title: "Aristo Developers", value: "Aristo Developers" },
  { title: "Island Blue", value: "Island Blue" },
  { title: "INEX Development", value: "INEX Development" },
  { title: "Prospecta Development", value: "Prospecta Development" },
  { title: "AGG Luxury Homes", value: "AGG Luxury Homes" },
  { title: "Square One", value: "Square One" },
  { title: "MITO Developers", value: "MITO Developers" },
];

export default {
  name: "developer",
  title: "Developer",
  type: "document",
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          description: "Max 60 characters",
          validation: (Rule) =>
            Rule.required()
              .max(60)
              .error("Title should be less than 60 characters"),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "string",
          description: "Max 160 characters",
          validation: (Rule) =>
            Rule.required()
              .max(160)
              .error("Description should be less than 160 characters"),
        }),
      ],
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      options: {
        list: developers,
      },
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "contentBlock",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localizedSlug",
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true,
    }),
  ],
};
