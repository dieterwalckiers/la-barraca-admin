export default {
  type: "document",
  name: "reminderEmail",
  title: "Reminder mail",
  fields: [
    {
      name: "headerImage",
      title: "Header-afbeelding",
      type: "image",
    },
    {
      name: "subject",
      title: "Onderwerp",
      description: "beschikbare variabelen: <%name%> (bv 'Jos'), <%date%> (bv 'zaterdag 18 november 2023'), <%time%> (bv '20:00u') <%productionname%> (bv 'De kersenthuin'), <%numberpeoplelabel%> (bv.'met 2 personen', 'met 5 personen waaronder 2 aan reductietarief', leeg bij 1 persoon)",
      type: "string",
    },
    {
      name: "mainMessage",
      title: "Hoofdbericht",
      description: "beschikbare variabelen: zie Onderwerp",
      type: "array",
      of: [{ type: "block" }],
    }
  ],
  __experimental_actions: ['create', "update", 'delete', "publish"]
};
