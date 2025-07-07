export default {
    name: "partnerLogo",
    title: "Partner logo",
    type: "object",
    fields: [
        {
            name: "logo",
            title: "Logo",
            type: "image"
        },
        {
            name: "partnerName",
            title: "Naam",
            type: "string"
        },
        {
            name: "partnerUrl",
            title: "Website url",
            type: "string"
        }
    ],
    preview: {
        select: {
            media: "logo",
            title: "partnerName",
        },
        prepare(selection) {
            const { media, title } = selection;
            return {
                title,
                media,
            };
        },
    },
    actions: [/*'create',*/ "update", /*'delete',*/ "publish"]
};
