export default {
  type: "document",
  name: "season",
  title: "Season",
  fields: [
    {
      name: "startYear",
      title: "Start year",
      type: "string"
    },
    {
      name: "endYear",
      title: "End year",
      type: "string"
    },
    {
      name: "productions",
      title: "Productions",
      type: "array",
      of: [
        { type: "production" }
      ]
    }
  ]
}