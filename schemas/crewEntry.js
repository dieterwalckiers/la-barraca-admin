export default {
  name: "crewEntry",
  title: "Crew members",
  type: "object",
  fields: [
    {
      name: "functionName",
      title: "Functie",
      type: "string",
      description: "Regie? Cast? Techniek? ..."
    },
    {
      name: "people",
      title: "Namen",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags"
      },
      description: "Typ de namen en druk op enter na elke naam"
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
