import { defineField } from "sanity";

const header = {
  name: "header",
  title: "Header",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "phone",
              title: "Phone number",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "menuItems",
      title: "Menu items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "linkItems",
      title: "Link items",
      type: "array",
      description: "Links to social and messengers",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true,
    }),
  ],
};

export default header;
