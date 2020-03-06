export default {
  type: "object",
  name: "production",
  title: "Production",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "crew",
      title: "Crew",
      type: "array",
      of: [{ type: "crewMember" }]
    },
    {
      name: "images",
      title: "Production images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true
          }
        }
      ]
    }
  ]
}
