export default {
  type: "document",
  name: "ourFriends",
  title: "Onze vrienden",
  fields: [

    {
      name: "infoBlock1",
      title: "Infoblok 1",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "infoBlock2",
      title: "Infoblok 2",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "infoBlock3",
      title: "Infoblok 3",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "illustration",
      title: "Illustratie",
      type: "image",
    },
    {
      name: "friendsTitel",
      title: "Titel bij huidige vrienden",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "currentFriends",
      title: "Huidige vrienden",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
  __experimental_actions: ["create", "update", "delete", "publish"]
};
