import { defineField } from "sanity";

const blog = {
  name: "blog",
  title: "Blog",
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
      name: "publishedAt",
      title: "Date of publication",
      type: "datetime",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      options: {
        filter: ({ document }) => {
          return {
            filter: "language == $language",
            params: { language: document.language },
          };
        },
      },
    }),
    defineField({
      name: "previewImage",
      title: "Preview Image",
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
      description: "Основное изображение страницы",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "string",
      description:
        "Краткое описание страницы, которое будет отображаться в превью",
    }),
    defineField({
      name: "contentBlocks",
      title: "Main Content",
      type: "array",
      description:
        "Блоки контента, которые будут отображаться в статье. Это основное содержание статьи",
      of: [
        { type: "textContent" },
        { type: "accordionBlock" },
        { type: "contactFullBlock" },
        { type: "faqBlock" },
        { type: "teamBlock" },
        { type: "locationBlock" },
        { type: "imageFullBlock" },
        { type: "buttonBlock" },
        { type: "imageBulletsBlock" },
        { type: "benefitsBlock" },
        { type: "reviewsFullBlock" },
        { type: "formMinimalBlock" },
        { type: "howWeWorkBlock" },
        { type: "bulletsBlock" },
        { type: "projectsSectionBlock" },
      ],
    }),
    defineField({
      name: "videoBlock",
      title: "Video Block",
      type: "object",
      fields: [
        defineField({
          name: "videoId",
          title: "Video ID",
          type: "string",
        }),
        defineField({
          name: "posterImage",
          title: "Video Image",
          type: "image",
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "popularProperties",
      title: "Popular Properties",
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
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true,
    }),
  ],
};

export default blog;
