import React from "react"

export default {
  type: "object",
  name: "accentedPaneElement",
  title: "Bordeaux kader",
  fields: [
    {
      name: "value",
      title: "Inhoud",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
  preview: {
    select: {
      value: "value",
    },
    prepare(selection) {
      const block = (selection.value || []).find(block => block._type === "block")
      let title = block
        ? block.children
          .filter(child => child._type === 'span')
          .map(span => span.text)
          .join("") :
        "";
      title += "...";
      return {
        media: (
          <span style={{ backgroundColor: "#4a1928", color: "white" }}>
            txt
          </span>
        ),
        title,
      };
    }
  }
};
