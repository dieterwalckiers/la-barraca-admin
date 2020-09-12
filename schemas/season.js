export default {
  type: "document",
  name: "season",
  title: "Seizoen",
  fields: [
    {
      name: "startYear",
      title: "Startjaar",
      type: "string"
    },
    {
      name: "endYear",
      title: "Eindjaar",
      type: "string"
    },
    {
      name: "isCurrent",
      title: "Dit is het huidige seizoen",
      type: "boolean"
    },
    {
      name: "productions",
      title: "Producties",
      type: "array",
      of: [{ type: "production" }]
    }
  ],
  preview: {
    select: {
      startYear: "startYear",
      endYear: "endYear"
    },
    prepare(selection) {
      const { startYear, endYear } = selection;
      return {
        title: `${startYear} - ${endYear}`
      };
    }
  }
};
