const fs = require("fs-extra");

let productions = new Map();
let others = [];

const root = "/home/dyte/Desktop/lb-archief/raw";
const resultsRoot = "/home/dyte/Desktop/lb-archief/raw-perproduction";

async function processFile(filePath, workingDir) {
    // console.log(`file ${filePath}`);
    const fileName = [...filePath.split("/")].pop();
    const captureGroups = fileName.match(/^([a-zA-Z0-9.éèáë]*)_(.)*.(jpg|JPG|jpeg|JPEG)$/)
    if (!captureGroups || captureGroups.length < 2) {
        others.push(filePath);
        // console.log(`unexpected filename format ${fileName} in ${workingDir}`);
        return;
    }
    const productionName = captureGroups[1].toLowerCase();
    productions.set(productionName, [...(productions.get(productionName) || []), filePath]);
}

async function processDirectory(dirPath) {
    // console.log(`dir ${dirPath}`);
    const fileNames = await fs.readdirSync(dirPath);
    for (const fileName of fileNames) {
        const filePath = `${dirPath}/${fileName}`;
        const isDir = await fs.statSync(filePath).isDirectory();
        if (isDir) {
            await processDirectory(filePath);
        } else {
            await processFile(filePath, dirPath);
        }
    }
}

async function processResults() {
    for (const productionName of Array.from(productions.keys()).slice(2, 5)) {
        console.log(`prod ${productionName}`);
        const pics = productions.get(productionName);
        console.log(`${pics.length} pics`);
        const prodPath = `${resultsRoot}/${productionName}`;
        await fs.mkdirsSync(prodPath);
        for (const picPath of pics) {
            await fs.moveSync(picPath, `${prodPath}/${[...picPath.split("/")].pop()}`, { overwrite: true });
        }
    }
    await fs.mkdirsSync(`${resultsRoot}/other`);
    for (const otherPath of others) {
        await fs.moveSync(otherPath, `${resultsRoot}/other/${[...otherPath.split("/")].pop()}`, { overwrite: true });
    }
}

(async function () {
    await processDirectory(root);
    // console.log("productions", productions);
    await processResults();
})();