export default {
  name: "crewMember",
  title: "Crew member",
  type: "object",
  fields: [{
    name: "function",
    title: "Function",
    type: "string"
  },
  {
    name: "people",
    title: "People",
    type: "array",
    of: [{ type: "string" }],
    options: {
      layout: "tags"
    }
  }]
}