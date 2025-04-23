import { defineField } from "sanity";

const singlepage = {
  name: "singlepage",
  title: "Single Page",
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
      name: "excerpt",
      title: "Excerpt",
      type: "string",
      description:
        "Краткое описание страницы, которое будет отображаться в превью",
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
      name: "allowIntroBlock",
      title: "Allow Intro Block",
      type: "boolean",
    }),
    defineField({
      name: "contentBlocks",
      title: "Main Content",
      type: "array",
      description:
        "Блоки контента, которые будут отображаться в статье. Это основное содержание статьи",
      of: [
        { type: "textContent" },
        { type: "doubleTextBlock" },
        { type: "accordionBlock" },
        { type: "contactFullBlock" },
        { type: "teamBlock" },
        { type: "locationBlock" },
        { type: "imageFullBlock" },
        { type: "buttonBlock" },
        { type: "imageBulletsBlock" },
        { type: "benefitsBlock" },
        { type: "reviewsFullBlock" },
      ],
    }),
    // Раздел для ручного выбора проектов с фильтрацией по языку
    defineField({
      name: "projectSection",
      title: "Секция проектов",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Заголовок секции проектов",
          type: "string",
          description: "Например, «Проекты для семей»",
        }),
        defineField({
          name: "projects",
          title: "Выбранные проекты",
          type: "array",
          of: [
            {
              type: "reference",
              to: [{ type: "project" }],
              options: {
                filter: ({ document }) => ({
                  filter: "language == $language",
                  params: { language: document.language },
                }),
              },
            },
          ],
          description:
            "Выберите проекты, которые необходимо отобразить на странице (SEO-оптимизированная подборка)",
        }),
      ],
    }),
    // Поле для подстраниц с фильтрацией по языку
    defineField({
      name: "subpages",
      title: "Подстраницы",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "singlepage" }],
          options: {
            filter: ({ document }) => ({
              filter: "language == $language",
              params: { language: document.language },
            }),
          },
        },
      ],
      description:
        "Выберите подстраницы, которые будут вложены в эту страницу. Отображаются только страницы с тем же языком.",
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true,
    }),
  ],
};

export default singlepage;
