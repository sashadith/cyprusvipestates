import { defineField } from "sanity";

export const propertyTypes = [
  { title: "Apartment", value: "Apartment" },
  { title: "Villa", value: "Villa" },
  { title: "Townhouse", value: "Townhouse" },
  { title: "Semi-detached villa", value: "Semi-detached villa" },
  { title: "Office", value: "Office" },
  { title: "Shop", value: "Shop" },
];

export const propertyTypesClassification = [
  { title: "Residential", value: "Residential" },
  { title: "Commercial", value: "Commercial" },
  { title: "Investment", value: "Investment" },
  { title: "Exclusive", value: "Exclusive" },
];

export const energyEfficiency = [
  { title: "A", value: "A" },
  { title: "B", value: "B" },
  { title: "C", value: "C" },
  { title: "D", value: "D" },
  { title: "E", value: "E" },
  { title: "F", value: "F" },
  { title: "G", value: "G" },
];

export const propertyPurpose = [
  { title: "Sale", value: "Sale" },
  { title: "Rent", value: "Rent" },
];

export const propertyType = [
  { title: "Residential", value: "Residential" },
  { title: "Commercial", value: "Commercial" },
  { title: "Investment", value: "Investment" },
  { title: "Exclusive", value: "Exclusive" },
];

const cities = [
  { title: "Paphos", value: "Paphos" },
  { title: "Limassol", value: "Limassol" },
  { title: "Larnaca", value: "Larnaca" },
];

export const market = [
  { title: "Primary", value: "Primary" },
  { title: "Secondary", value: "Secondary" },
];

const project = {
  name: "project",
  title: "Project",
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
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "title",
      title: "Object name",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .max(200)
          .error("Name should be less than 200 characters"),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.required()
          .max(200)
          .error("Excerpt should be less than 200 characters"),
    }),
    defineField({
      name: "previewImage",
      title: "Preview image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localizedSlug",
    }),
    defineField({
      name: "videoId",
      title: "YouTube Video ID",
      type: "string",
    }),
    defineField({
      name: "videoPreview",
      title: "Video preview",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "images",
      title: "Property images",
      type: "array",
      of: [
        {
          type: "image",
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(3).error("Minimum 3 images"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "contentBlock",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "geopoint",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "developer",
      title: "Developer",
      type: "object",
      fields: [
        {
          name: "name",
          title: "Name",
          type: "string",
        },
        {
          name: "logo",
          title: "Logo",
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "keyFeatures",
      title: "Key features",
      type: "object",
      fields: [
        {
          name: "city",
          title: "City",
          type: "string",
          options: {
            list: cities,
          },
        },
        {
          name: "propertyType",
          title: "Property type",
          type: "string",
          options: {
            list: propertyTypes,
          },
        },
        {
          name: "bedrooms",
          title: "Bedrooms",
          type: "string",
        },
        {
          name: "coveredArea",
          title: "Covered area",
          type: "string",
        },
        {
          name: "plotSize",
          title: "Plot size",
          type: "string",
        },
        {
          name: "energyEfficiency",
          title: "Energy efficiency",
          type: "string",
          options: {
            list: energyEfficiency,
          },
        },
        {
          name: "price",
          title: "Price",
          type: "number",
        },
      ],
    }),
    defineField({
      name: "distances",
      title: "Distances",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" }, // Например, "Distance to the beach"
            { name: "value", title: "Distance", type: "string" },
            {
              name: "icon",
              title: "Icon",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", title: "Alt Text", type: "string" }],
            },
          ],
        },
      ],
    }),
    // defineField({
    //   name: "distances",
    //   title: "Distances",
    //   type: "object",
    //   fields: [
    //     {
    //       name: "toBeach",
    //       title: "Distance to the beach",
    //       type: "object",
    //       fields: [
    //         { name: "value", title: "Distance", type: "string" },
    //         {
    //           name: "icon",
    //           title: "Icon",
    //           type: "image",
    //           fields: [
    //             {
    //               name: "alt",
    //               title: "Alt Text",
    //               type: "string",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       name: "toShop",
    //       title: "Distance to the shop",
    //       type: "object",
    //       fields: [
    //         { name: "value", title: "Distance", type: "string" },
    //         {
    //           name: "icon",
    //           title: "Icon",
    //           type: "image",
    //           fields: [
    //             {
    //               name: "alt",
    //               title: "Alt Text",
    //               type: "string",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       name: "toAirport",
    //       title: "Distance to the airport",
    //       type: "object",
    //       fields: [
    //         { name: "value", title: "Distance", type: "string" },
    //         {
    //           name: "icon",
    //           title: "Icon",
    //           type: "image",
    //           fields: [
    //             {
    //               name: "alt",
    //               title: "Alt Text",
    //               type: "string",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       name: "toHospital",
    //       title: "Distance to the hospital",
    //       type: "object",
    //       fields: [
    //         { name: "value", title: "Distance", type: "string" },
    //         {
    //           name: "icon",
    //           title: "Icon",
    //           type: "image",
    //           fields: [
    //             {
    //               name: "alt",
    //               title: "Alt Text",
    //               type: "string",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       name: "toSchool",
    //       title: "Distance to the school",
    //       type: "object",
    //       fields: [
    //         { name: "value", title: "Distance", type: "string" },
    //         {
    //           name: "icon",
    //           title: "Icon",
    //           type: "image",
    //           fields: [
    //             {
    //               name: "alt",
    //               title: "Alt Text",
    //               type: "string",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       name: "toCenter",
    //       title: "Distance to the center",
    //       type: "object",
    //       fields: [
    //         { name: "value", title: "Distance", type: "string" },
    //         {
    //           name: "icon",
    //           title: "Icon",
    //           type: "image",
    //           fields: [
    //             {
    //               name: "alt",
    //               title: "Alt Text",
    //               type: "string",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       name: "toGolf",
    //       title: "Distance to the golf club",
    //       type: "object",
    //       fields: [
    //         { name: "value", title: "Distance", type: "string" },
    //         {
    //           name: "icon",
    //           title: "Icon",
    //           type: "image",
    //           fields: [
    //             {
    //               name: "alt",
    //               title: "Alt Text",
    //               type: "string",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
      },
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true,
    }),
  ],
};

export default project;
