import { defineType, defineField } from "sanity";

const textContent = defineType({
  name: "textContent",
  title: "Text Content Block",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content Editor",
      type: "contentBlock",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
    }),
    defineField({
      name: "paddingVertical",
      title: "Vertical Padding",
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
      name: "paddingHorizontal",
      title: "Horizontal Padding",
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
      name: "textAlign",
      title: "Text Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
      },
      initialValue: "left",
    }),
  ],
});

export default textContent;
