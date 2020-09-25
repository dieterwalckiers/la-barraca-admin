export default {
  type: "document",
  name: "confirmationEmail",
  title: "Bevestigingsmail",
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
    },
    {
      name: "infoBlock1",
      title: "Infoblok 1",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "showUpcoming",
      title: "Toon overzichtje van de aanstaande producties",
      type: "boolean"
    },
    {
      name: "infoBlock2",
      title: "Infoblok 2",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "footer",
      title: "Footer",
      type: "array",
      of: [{ type: "block" }],
    }
  ],
  // __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"]
};
