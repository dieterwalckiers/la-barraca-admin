export default {
  type: "object",
  name: "production",
  title: "Production",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "crew",
      title: "Crew",
      type: "array",
      of: [{ type: "crewEntry" }]
    },
    {
      name: "mainImage",
      title: "Production cover image",
      type: "image"
    },
    {
      name: "images",
      title: "Production images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      media: "mainImage",
      title: "title"
    },
    prepare(selection) {
      const { media, title } = selection;
      return {
        title,
        media
      };
    }
  }
};
