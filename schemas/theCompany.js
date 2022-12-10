export default {
  type: "document",
  name: "theCompany",
  title: "Het gezelschap",
  fields: [
    {
      name: "title",
      title: "Titel",
      type: "string",
    },
    {
      name: "infoBlock1",
      title: "Infoblok 1",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
  // __experimental_actions: ["create", "update", "delete", "publish"]
};
