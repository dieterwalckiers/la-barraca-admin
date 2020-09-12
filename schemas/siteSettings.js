export default {
    name: "siteSettings",
    title: "Instellingen",
    type: "document",
    fields: [
      {
        name: "seats",
        title: "Beschikbare plaatsen",
        type: "number"
      },
      {
        name: "lastSeatsWarningTreshold",
        title: "Toon 'laatste plaatsen' waarschuwing bij minder dan X plaatsen",
        type: "number"
      },
    ],
    __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"]
  };
  