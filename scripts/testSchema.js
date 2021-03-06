exports.testSchema = {
    name: "testSchema",
    types: [
        {
            type: "object",
            name: "production",
            title: "Productie",
            fields: [
                {
                    name: "title",
                    title: "Naam",
                    type: "string",
                },
                {
                    name: "slug",
                    title: "Slug",
                    type: "slug",
                    description: "Id om een unieke productie-link mee samen te stellen. Bv. \"ode-aan-lorca\", dan wordt dat labarraca.be/ode-aan-lorca. Je kan dit laten genereren of zelf invullen",
                    options: {
                        source: (doc, { parent }) => parent && parent.title,
                        maxLength: 96
                    },
                    validation: Rule => Rule.required()
                },
                {
                    name: "shortDescription",
                    description: "1 à 2 zinnen",
                    title: "Teaser",
                    type: "text",
                    rows: 4,
                },
                {
                    name: "backgroundInformation",
                    title: "Beschrijving",
                    type: "array",
                    of: [{ type: "block" }],
                },
                {
                    name: "crew",
                    title: "Crew",
                    type: "array",
                    of: [{ type: "crewEntry" }],
                },
                {
                    name: "mainImage",
                    title: "Productie coverbeeld",
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                },
                {
                    name: "images",
                    title: "Productiebeelden",
                    type: "array",
                    of: [
                        {
                            type: "image",
                            options: {
                                hotspot: true,
                            },
                        },
                    ],
                },
                {
                    name: "vimeoId",
                    title: "Vimeo ID",
                    description: "De 012345678 in https://vimeo.com/012345678",
                    type: "string",
                },
                {
                    name: "performanceCalendar",
                    title: "Voorstellingen",
                    type: "string",
                },
                {
                    name: "seats",
                    title: "Aantal plaatsen",
                    description: "Indien leeg wordt de waarde uit de algemene instellingen genomen",
                    type: "number",
                },
                {
                    name: "ticketPrice",
                    title: "Ticket prijs",
                    description: "Indien leeg wordt de waarde uit de algemene instellingen genomen",
                    type: "number"
                },
                {
                    name: "ticketPriceStudents",
                    title: "Ticket studentenprijs",
                    description: "Indien leeg wordt de waarde uit de algemene instellingen genomen",
                    type: "number"
                },
                {
                    name: "ticketLink",
                    title: "Link naar externe ticketpagina",
                    description: "Indien ingevuld verwijst de 'Reserveer nu' knop hiernaar ipv ons eigen reservatieformulier",
                    type: "string"
                }
            ],
            preview: {
                select: {
                    media: "mainImage",
                    title: "title",
                },
                prepare(selection) {
                    const { media, title } = selection;
                    return {
                        title,
                        media,
                    };
                },
            },
        }
    ]
};