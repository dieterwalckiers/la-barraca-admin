export default {
  type: "document",
  name: "page",
  title: "Pagina",
  fields: [
    {
      name: "title",
      title: "Titel",
      type: "string"
    },
    {
      name: "elements",
      title: "Elementen",
      type: "array",
      of: [
        { type: "titleElement" },
        { type: "richTextElement" },
        { type: "accentedPaneElement" },
        { type: "imageElement" },
      ]
    }
  ],
  preview: {
    select: {
      title: "title"
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: `Pagina: ${title}`
      };
    }
  }
};
