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
    },
    {
      name: "internalFeedbackLabel",
      title: "Interne feedback vraag",
      type: "string",
    },
    {
      name: "internalFeedbackLabel2",
      title: "Interne feedback duiding vraag",
      type: "string",
    },
    {
      name: "internalFeedbackLabel2Info",
      title: "Interne feedback duiding vraag - info",
      type: "string",
    },
    {
      name: "performanceFeedbackLabel",
      title: "Voorstelling feedback vraag",
      type: "string",
    },
    {
      name: "performanceFeedbackLabel2",
      title: "Voorstelling feedback vraag - info",
      type: "string",
    },
    {
      name: "termsAndConditions",
      title: "Algemene voorwaarden",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
  __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"]
};
