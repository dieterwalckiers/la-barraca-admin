export default {
  type: "document",
  name: "extraReservationInfo",
  title: "Extra info bij reservatie",
  fields: [
    {
      name: "linkText",
      title: "Link tekst link-naar-sectie",
      description: "(context: link die vanuit registratieformulier naar meer-info sectie verwijst op website)",
      type: "string",
    },
    {
      name: "title",
      title: "Titel sectie link-naar-sectie",
      description: "(context: link die vanuit registratieformulier naar meer-info sectie verwijst op website)",
      type: "string",
    },
    {
      name: "infoBlock",
      title: "Tekst sectie link-naar-sectie",
      description: "(context: link die vanuit registratieformulier naar meer-info sectie verwijst op website)",
      type: "array",
      of: [{ type: "block" }],
    }
  ],
  actions: ["create", "update", "delete", "publish"]
};
