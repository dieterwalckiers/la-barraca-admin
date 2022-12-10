import React from "react"

export default {
  type: "object",
  name: "imageElement",
  title: "Afbeelding",
  fields: [
    {
      name: "value",
      title: "Afbeelding",
      type: "image",
    },
    {
      name: "hasParallax",
      title: "Parallax effect",
      type: "boolean",
    },
    {
      name: "width",
      type: "number",
      title: "Breedte",
      hidden: ({ parent }) => parent.hasParallax,
      initialValue: 100,
    },
    {
      name: "widthType",
      title: "Breedte in:",
      type: "string",
      options: {
        list: [
          { title: "%", value: "perc" },
          { title: "px", value: "pix" },
        ]
      },
      initialValue: "perc",
      hidden: ({ parent }) => parent.hasParallax,
    },
    {
      name: "height",
      type: "number",
      title: "Hoogte in px",
      hidden: ({ parent }) => !(parent.hasParallax),
      initialValue: 400,
    },
  ],
  preview: {
    select: {
      image: "value.asset"
    },
    prepare(selection) {
      return {
        media: selection.image,
        title: " "
      };
    }
  }
};
