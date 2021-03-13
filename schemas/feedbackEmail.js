export default {
  type: "document",
  name: "feedbackEmail",
  title: "Feedback mail",
  fields: [
    {
      name: "headerImage",
      title: "Header-afbeelding",
      type: "image",
    },
    {
      name: "mainMessage",
      title: "Hoofdbericht",
      type: "array",
      of: [{ type: "block" }],
    }
  ],
  __experimental_actions: ['create', "update", 'delete', "publish"]
};
