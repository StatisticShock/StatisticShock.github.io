import CustomFunctions from "./functions.js";
import { constants } from "./constants.js";
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import ScrapeFunctions from './scrapeMFC.js';
import GoogleClass from './googleClass.js';
const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
});
async function fetchData(scrapeData, scrapeImages) {
    console.log('Starting to fetch items...');
    const figureMap = {};
    const figuresChanges = {
        toAdd: [],
        toUpdate: [],
        toDelete: []
    };
    const figureActions = {
        toAdd: 'POST',
        toUpdate: 'PUT',
        toDelete: 'DELETE'
    };
    const changes = {
        aditions: [],
        deletions: [],
        updates: []
    };
    const changelogs = [
        { type: 'aditions', message: 'Added figures:' },
        { type: 'updates', message: 'Updated figures:' },
        { type: 'deletions', message: 'Deleted figures:' }
    ];
    if (scrapeData) {
        const json = (await fetch(`${constants.server}contents/mfc/`).then((res) => res.json()))['mfc'];
        if (Array.isArray(json)) {
            CustomFunctions.log('JSON file sucessfully loaded');
        }
        else {
            CustomFunctions.log("Couldn't fetch JSON file.");
            return;
        }
        ;
        for (const figure of json) {
            figureMap[figure.id] = {
                type: figure.type,
                operation: 'delete'
            };
        }
        for (const link of constants.links) {
            const page = await browser.newPage();
            await page.setUserAgent({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' });
            await page.evaluateOnNewDocument(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); });
            await page.goto(link[1]);
            const $ = cheerio.load(await page.content());
            await page.close();
            const ids = $('span.item-icon a').toArray().map((el, i) => $(el).attr('href').split('/').pop());
            ids.forEach((id) => {
                if (!figureMap[id]) {
                    figureMap[id] = {
                        type: link[0],
                        operation: 'add'
                    };
                }
                else if (figureMap[id].type !== link[0]) {
                    figureMap[id] = {
                        type: link[0],
                        operation: 'update'
                    };
                }
                else if (figureMap[id].type === link[0]) {
                    figureMap[id] = {
                        type: link[0],
                        operation: 'none'
                    };
                }
                ;
            });
            await CustomFunctions.sleep(1000 + Math.floor(Math.random() * 5) * 1000);
        }
        ;
        for (const [id, data] of Object.entries(figureMap)) {
            if (data.operation === 'none')
                continue;
            const mfc = await ScrapeFunctions.readMFCItem({
                elementId: id,
                typeOfFigure: data.type,
                browser: browser
            });
            if (mfc === null)
                continue;
            switch (data.operation) {
                case 'add':
                    figuresChanges.toAdd.push(mfc);
                    changes.aditions.push(id);
                    break;
                case 'update':
                    figuresChanges.toUpdate.push([json.filter((figure) => figure.id === id)[0], mfc]);
                    changes.updates.push(id);
                    break;
                case 'delete':
                    figuresChanges.toDelete.push(mfc);
                    changes.deletions.push(id);
                    break;
                default:
                    break;
            }
        }
        ;
        const maxUploadsPerRequest = 15;
        for (const [key, value] of Object.entries(figureActions)) {
            if (figuresChanges[key].length > 0) {
                let point = 0;
                do {
                    await fetch(`${constants.server}mfc`, {
                        method: value,
                        body: JSON.stringify(figuresChanges[key].slice(point, point + maxUploadsPerRequest)),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    point += maxUploadsPerRequest;
                } while (point <= figuresChanges[key].length);
            }
            ;
        }
        ;
    }
    ;
    if (scrapeImages) {
        const json = (await fetch(`${constants.server}contents/mfc/`).then((res) => res.json()))['mfc'];
        if (Array.isArray(json)) {
            CustomFunctions.log('JSON file sucessfully loaded');
        }
        else {
            CustomFunctions.log("Couldn't fetch JSON file.");
            return;
        }
        ;
        const folderMap = [
            { folderName: 'icons', size: 'icon' },
            { folderName: 'main_images', size: 'main' }
        ];
        for (const folder of folderMap) {
            const [files] = await GoogleClass.bucket.getFiles({ prefix: `mfc/${folder.folderName}` });
            const filenames = files.map((file) => file.name);
            for (const figure of json) {
                if (!filenames.includes(`mfc/${folder.folderName}/${figure.id}`)) {
                    const fileToUpload = await ScrapeFunctions.scrapeImage({
                        sufix: figure.img_sufix,
                        type: folder.size
                    });
                    if (fileToUpload) {
                        const destFilename = fileToUpload.split('/').pop();
                        const destination = `mfc/${folder.folderName}/${destFilename}`;
                        await GoogleClass.bucket.upload(fileToUpload, { destination: destination });
                        CustomFunctions.log(`File uploaded to ${destination}`);
                        await CustomFunctions.sleep(300);
                        await CustomFunctions.unlink(fileToUpload);
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
    }
    ;
    for (const changelog of changelogs) {
        if (changes[changelog.type].length > 0) {
            CustomFunctions.log(changelog.message + changes[changelog.type].reduce((prev, curr) => { return prev + '\n• figure from ID ' + curr; }, '') + '\n');
            await CustomFunctions.sleep(150);
        }
        ;
    }
    ;
}
;
export async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('Closing conections...');
        setTimeout(() => process.exit(0), 2000);
        return;
    }
    ;
    const badArgs = args.filter((arg) => arg !== 'data' && arg !== 'images' && arg !== 'bot');
    if (badArgs.length > 0) {
        CustomFunctions.log('Invalid arguments:\n' + badArgs.reduce((prev, curr) => { return prev + '\n• ' + curr; }, ''));
        console.log('Closing conections...');
        setTimeout(() => process.exit(0), 2000);
        return;
    }
    ;
    const scrapeData = args.includes('data');
    const scrapeImages = args.includes('images');
    const isRunByBot = args.includes('bot');
    if (isRunByBot)
        CustomFunctions.log('ESTA EXECUÇÃO FOI ATIVADA POR CLEYTON PELO TELEGRAM.\n\n');
    try {
        await fetchData(scrapeData, scrapeImages);
    }
    catch (err) {
        CustomFunctions.log('Error in script: ' + err.message);
    }
    finally {
        console.log('Closing connections...');
        setTimeout(() => process.exit(0), 2000);
    }
    ;
}
;
