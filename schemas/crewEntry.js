export default {
  name: "crewEntry",
  title: "Crew members",
  type: "object",
  fields: [
    {
      name: "functionName",
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
    }
  ],
  preview: {
    select: {
      functionName: "functionName",
      people: "people"
    },
    prepare(selection) {
      const { functionName, people } = selection;
      return {
        title: functionName,
        subtitle: people.join(",")
      };
    }
  }
};
