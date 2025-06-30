export default {
  type: "document",
  name: "confirmationEmail",
  title: "Bevestigingsmail",
  fields: [
    {
      name: "headerImage",
      title: "Header-afbeelding",
      type: "image",
    },
    {
      name: "mainMessage",
      title: "Hoofdbericht",
      description: "beschikbare variabelen: <%name%> (bv 'Jos'), <%date%> (bv 'zaterdag 18 november 2023'), <%time%> (bv '20:00u'), <%productionname%> (bv 'De kersenthuin'), <%numberpeoplelabel%> (bv.'met 2 personen', 'met 5 personen waaronder 2 aan reductietarief', leeg bij 1 persoon)",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "infoBlock1",
      title: "Infoblok 1",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "showUpcoming",
      title: "Toon overzichtje van de aanstaande producties",
      type: "boolean"
    },
    {
      name: "infoBlock2",
      title: "Infoblok 2",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "footer",
      title: "Footer",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "attachment",
      title: "Bijlage",
      type: "file",
    },
    {
      name: "attachmentFilename",
      title: "Bijlage bestandsnaam",
      type: "string",
    }
  ],
  __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"]
};
