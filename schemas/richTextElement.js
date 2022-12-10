import React from "react"

export default {
  type: "object",
  name: "richTextElement",
  title: "Tekst",
  fields: [
    {
      name: "value",
      title: "Inhoud",
      type: "array",
      of: [{
        type: "block",
        marks: {
          decorators: [
            { title: "Strong", value: "strong" },
            { title: "Emphasis", value: "em" },
            {
              title: "Highlight",
              value: "highlight",
              blockEditor: {
                icon: () => (
                  <span style={{ backgroundColor: "#4a1928", color: "white", padding: 2 }}>H</span>
                ),
                render: (props) => (
                  <span style={{ backgroundColor: "#4a1928", color: "white", padding: 2 }}>{props.children}</span>
                )
              }
            },
            { title: "Underline", value: "underline" },
            { title: "Strike", value: "strike-through" }
          ]
        }
      }],
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
          .filter(child => child._type === "span")
          .map(span => span.text)
          .join("") :
        "";
      title += "...";
      return {
        media: <span>txt</span>,
        title,
      };
    }
  }
};
