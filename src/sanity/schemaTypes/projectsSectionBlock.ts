// schemas/blocks/projectsBlock.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "projectsSectionBlock",
  title: "Projects Section Block",
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
        defineField({
          name: "projectRef",
          title: "Project Reference",
          type: "reference",
          to: [{ type: "project" }],
          options: {
            filter: ({ document }) => ({
              filter: "language == $language",
              params: { language: document.language },
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "marginTop",
      title: "Margin Top",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
      },
    }),
    defineField({
      name: "marginBottom",
      title: "Margin Bottom",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
      },
    }),
  ],
});
