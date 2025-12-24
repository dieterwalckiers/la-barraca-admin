export default {
  type: "document",
  name: "feedbackEmail",
  title: "Feedback mail",
  preview: {
    prepare() {
      return { title: "Feedback mail" };
    },
  },
  fields: [
    {
      name: "headerImage",
      title: "Header-afbeelding",
      type: "image",
    },
    {
      name: "mainMessage",
      title: "Hoofdbericht",
      description: "beschikbare variabelen: <%name%> (bv 'Jos'), <%productionname%>, <%linktoreactionform%> (link naar het reactie-formulier op de website)",
      type: "array",
      of: [{ type: "block" }],
    }
  ],
  __experimental_actions: ['create', "update", 'delete', "publish"]
};
