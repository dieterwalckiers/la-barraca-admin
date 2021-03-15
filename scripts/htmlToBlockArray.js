const Schema = require("@sanity/schema").default;
const blockTools = require("@sanity/block-tools");
const productionSchema = require("./testSchema").testSchema;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Start with compiling a schema we can work against
const compiledProductionSchema = Schema.compile(productionSchema);
const blockContentType = compiledProductionSchema.get("production").fields.find(f => f.name === "backgroundInformation").type;

const blocks = blockTools.htmlToBlocks(
    `
<h3>Het verhaal</h3>
<p>Vijf stijlvolle jongedames zijn in bewaring in een ruimte. Twee mannen schijnen voor hen te zorgen. Waarom zijn ze daar? Waarom lijkt het hen niet te deren? Is liefde een kaartspel, of zijn het misschien soldiers of love? En dan is er ook nog de imp. Zijn gedrag is soms wild en onbeheersbaar, en dan weer gespannen ingehouden. Hij bestaat om te misleiden, om te straffen en te strelen. Maar nooit zonder reden.</p>
<p>Een loodzware sfeer wordt doorbroken met zwarte humor, ongemakkelijke stiltes en groteske uitbarstingen. De meest tedere aanrakingen en blikken worden afgewisseld met harde woorden en gebaren. De toeschouwer wordt ondergedompeld in een bad van confituur. Een beeld zegt soms zoveel meer dan duizend woorden …</p>
<h3>De auteur en regisseur</h3>
<p><strong>Werner Verelst</strong> is geen onbekende in het Gentse amateurtheater. In 2008 werd bij theatergezelschap La Barraca zijn eerste zelfgeschreven stuk op de planken gebracht: 21122012 – Theorema van de Liefde. In de periode 2009-2014 schreef en regisseerde hij achtereenvolgens Split, Heldenlicht en Pimpf.</p>
<p>In 2015 volgde een bewerking van een klassieke Griekse tragedie: Medea Suburbia, geregisseerd door Isabel van Neste. Naast zijn bezigheden in het theater werkt Werner als individueel begeleider bij De Sleutel, en is hij ook zelfstandig psychotherapeut.</p>
<p>Gevraagd naar zijn beweegredenen om theater te maken, zegt hij dit:</p>
<p><em>‘Als schrijver en regisseur begin ik vanuit een niets, en probeer ik vanuit dingen die mij raken als mens iets volledig nieuws te maken dat op zich weer anderen kan raken. Ik laat schijnbaar onmogelijk met elkaar verenigbare werelden heel even kruisen, en ik ga hierbij het lastige, het wrange niet uit de weg. In een sfeer van licht onbehagen laat ik emoties met elkaar botsen en in elkaar haken, de sfeer is unheimlich of uncanny, een goeie Nederlandse vertaling heb ik daarvoor nog niet gevonden. Woorden, beelden, blikken, lichamen, klanken, schaduwen en licht … En jouw versie van het verhaal is altijd de juiste.’</em></p>
    `,
    blockContentType,
    {
        parseHtml: html => new JSDOM(html).window.document
    }
);

console.log("blocks", JSON.stringify(blocks));
