const fs = require("fs-extra");

const root = "/home/dyte/Desktop/lb-archief/productions";

function twoDig(n) {
    if (`${n}`.length === 1) {
        return `0${n}`;
    }
    return n;
}

async function filterPicsIn(dirPath) {
    const fileNames = await fs.readdirSync(dirPath);
    const productionName = fileNames[0].match(/^([a-zA-Z0-9.éèáë]*)_(.)*.(jpg|JPG|jpeg|JPEG)$/)[1];
    console.log("prod", productionName);

    let stop = false;
    let n = 1;
    while (!stop) {
        const nName = `${productionName}_${twoDig(n)}.jpg`;
        const nPath = `${dirPath}/${nName}`;
        // console.log("testing", `${dirPath}/${nName} gives ${await fs.existsSync(`${dirPath}/${nName}`)}`);
        if (await fs.existsSync(nPath)) {
            for (const fn of fileNames.filter(fn => fn.startsWith(`${productionName}_${twoDig(n)}`) && fn !== nName)) {
                console.log("rming", `${dirPath}/${fn}`);
                await fs.removeSync(`${dirPath}/${fn}`);
            }
            n++;
        } else {
            stop = true;
        }
    }
}

async function filterPics(dirPath) {
    const fileNames = await fs.readdirSync(dirPath);
    for (const fileName of fileNames) {
        const filePath = `${dirPath}/${fileName}`;
        if (fileName !== "other") {
            await filterPicsIn(filePath);
        }
    }
}

(async function () {
    await filterPics(root);
})();