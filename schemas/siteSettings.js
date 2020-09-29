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
      name: "maxSeatsPerBooking",
      title: "Maximum aantal plaatsen per bestelling",
      type: "number"
    },
    {
      name: "lastSeatsWarningTreshold",
      title: "Toon 'laatste plaatsen' waarschuwing bij minder dan X plaatsen",
      type: "number"
    },
    {
      name: "ticketPrice",
      title: "Ticket prijs",
      type: "number"
    },
    {
      name: "ticketPriceStudents",
      title: "Ticket studentenprijs",
      type: "number"
    },
    {
      name: "partnerLogos",
      title: "Partner logo's",
      type: "array",
      of: [{ type: "partnerLogo" }]
    },
    {
      name: "supporterLogos",
      title: "Steun-van logo's",
      type: "array",
      of: [{ type: "partnerLogo" }]
    }
  ],
  __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"]
};