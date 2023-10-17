export default {
  type: "document",
  name: "reminderEmail",
  title: "Reminder mail",
  fields: [
    {
      name: "headerImage",
      title: "Header-afbeelding",
      type: "image",
    },
    {
      name: "subject",
      title: "Onderwerp",
      type: "string",
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
