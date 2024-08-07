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
      name: "brochureBlock",
      title: "Brochure Block",
      type: "object",
      fields: [
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
          name: "buttonLabel",
          title: "Button Label",
          type: "string",
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
        }),
      ],
    }),
    defineField({
      name: "homepageTitle",
      title: "Homepage Title",
      type: "string",
    }),
    defineField({
      name: "aboutBlock",
      title: "About Block",
      type: "object",
      fields: [
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
          name: "bullets",
          title: "Bullets",
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
                  name: "description",
                  title: "Description",
                  type: "string",
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "projectsBlock",
      title: "Projects Block",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "projects",
          title: "Projects",
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
                  name: "city",
                  title: "City",
                  type: "string",
                  options: {
                    list: [
                      { title: "Paphos", value: "Paphos" },
                      { title: "Limassol", value: "Limassol" },
                      { title: "Larnaca", value: "Larnaca" },
                    ],
                  },
                }),
                defineField({
                  name: "propertyType",
                  title: "Property Type",
                  type: "string",
                  options: {
                    list: [
                      { title: "Villa", value: "Villa" },
                      { title: "Apartment", value: "Apartment" },
                    ],
                  },
                }),
                defineField({
                  name: "adress",
                  title: "Adress",
                  type: "string",
                }),
                defineField({
                  name: "flatsAmount",
                  title: "Flats Amount",
                  type: "string",
                }),
                defineField({
                  name: "area",
                  title: "Area",
                  type: "string",
                }),
                defineField({
                  name: "price",
                  title: "Price",
                  type: "string",
                }),
                defineField({
                  name: "buttonLabel",
                  title: "Button Label",
                  type: "string",
                }),
                defineField({
                  name: "buttonAltLabel",
                  title: "Button Alternate Label",
                  type: "string",
                }),
              ],
            },
          ],
        }),
      ],
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
