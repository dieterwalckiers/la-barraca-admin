const fs = require("fs-extra");

const root = "/home/dyte/Desktop/lb-archief/productions";

const getOptions = () => {
    const productionName = process.argv[2];
    return {
        productionName,
    };
};

async function filterPicsIn(dirPath) {
    const fileNames = await fs.readdirSync(dirPath);
    for (const fileName of fileNames) {
        console.log(`${dirPath}/${fileName}`);
    }
}

async function listPics(dirPath) {
    const fileNames = await fs.readdirSync(dirPath);

    const { productionName } = getOptions();

    for (const fileName of fileNames.filter(n => { if (!productionName) { return true; } return n === productionName })) {
        console.log(`\n### ${fileName} ###\n`);
        const filePath = `${dirPath}/${fileName}`;
        if (fileName !== "other") {
            await filterPicsIn(filePath);
        }
    }
}

(async function () {
    await listPics(root);
})();