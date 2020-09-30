export default {
  type: "document",
  name: "webCopy",
  title: "Web copy",
  fields: [
    {
      name: "showMainPagePopup",
      title: "Toon popup op de hoofdpagina",
      type: "boolean",
    },
    {
      name: "mainPagePopupContent",
      title: "Popup bericht hoofdpagina",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "bookingConfirmation",
      title: "Bericht bij succesvolle boeking",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "bookingError",
      title: "Bericht bij fout in betaling",
      type: "array",
      of: [{ type: "block" }],
    }
  ],
  __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"]
};
