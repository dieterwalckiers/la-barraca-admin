export default {
  type: "document",
  name: "extraReservationInfo",
  title: "Extra info bij reservatie",
  fields: [
    {
      name: "linkText",
      title: "Tekst van de link bij registratieformulier",
      type: "string",
    },
    {
      name: "title",
      title: "Titel",
      type: "string",
    },
    {
      name: "infoBlock",
      title: "Infoblok 1",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
  __experimental_actions: ["create", "update", "delete", "publish"]
};
