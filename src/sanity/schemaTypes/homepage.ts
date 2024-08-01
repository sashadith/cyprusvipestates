import { defineField, defineType } from "sanity";

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localizedSlug",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "sliderMain",
      title: "Slider Main",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Link", value: "link" },
                  { title: "Button", value: "button" },
                ],
              },
            }),
            defineField({
              name: "linkLabel",
              title: "Link Label",
              type: "string",
              hidden: ({ parent }) => parent?.type !== "link",
            }),
            defineField({
              name: "linkDestination",
              title: "Link Destination",
              type: "string",
              hidden: ({ parent }) => parent?.type !== "link",
            }),
            defineField({
              name: "buttonLabel",
              title: "Button Label",
              type: "string",
              hidden: ({ parent }) => parent?.type !== "button",
            }),
            // defineField({
            //   name: "file",
            //   title: "File",
            //   type: "file",
            //   hidden: ({ parent }) => parent?.type !== "button",
            // }),
          ],
        },
      ],
    }),
    defineField({
      name: "homepageTitle",
      title: "Homepage Title",
      type: "string",
    }),
    // optional
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true,
    }),
  ],
});
