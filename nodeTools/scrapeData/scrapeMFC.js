import * as Google from '@google-cloud/storage';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { pipeline } from 'stream';
import util from 'util';
import * as pathImport from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import puppeteer from 'puppeteer';
dotenv.config({ path: pathImport.resolve(import.meta.dirname + '/.env') });
export class GoogleClass {
    static serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
    static storage = new Google.Storage({ credentials: GoogleClass.serviceAccount });
    static publicBucket = GoogleClass.storage.bucket('statisticshock_github_io_public');
}
;
const streamPipeline = util.promisify(pipeline);
let logIsRunByBot = false;
function log(message, isRunByBot) {
    const isBot = isRunByBot ?? logIsRunByBot;
    const dirName = `logs${isBot ? '/bot' : ''}`;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = pathImport.dirname(__filename);
    const logDir = pathImport.resolve(__dirname, dirName);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    ;
    const startDate = new Date(new Date().getTime() - (3 * 60 * 60 * 1000));
    const date = startDate.toISOString().split('T')[0];
    const logFile = fs.createWriteStream(pathImport.join(logDir, isBot ? 'log.txt' : `debug_${date}.log`), { flags: 'a' });
    console.log(message);
    logFile.write(`[${Intl.DateTimeFormat('pt-BR', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date())}] ${message}\n`);
}
;
function leftPad(string, totalCharacters) {
    if (string.length >= totalCharacters)
        return string;
    else {
        let spaces = '';
        for (let i = 1; i <= (totalCharacters - string.length); i++) {
            spaces += ' ';
        }
        ;
        return spaces + string;
    }
    ;
}
;
const execute = util.promisify(exec);
const unlink = util.promisify(fs.unlink);
const mfcLink = 'https://pt.myfigurecollection.net';
async function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}
;
export const links = [
    ['Owned', 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
    ['Ordered', 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
    ['Wished', 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
];
const imgLinks = [];
const server = 'https://statisticshock-index.fly.dev/';
const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
});
async function scrapeImages() {
    const mainImageFolder = 'mfc/main_images/';
    const iconImageFolder = 'mfc/icons/';
    async function downloadImageFromUrl(url, path) {
        const response = await fetch(url);
        if (!response.ok)
            log(`Failed to download: ${response.statusText}`);
        await streamPipeline(response.body, fs.createWriteStream(path));
    }
    ;
    async function convertToWebp(imgPath) {
        try {
            await execute(`ffmpeg -i "${imgPath}" -y -lossless 1 "${imgPath.replace('.jpg', '.webp')}"`);
        }
        catch (e) {
            log(e.code);
            log(e.message);
        }
        ;
    }
    ;
    async function downloadNewImages() {
        const [existingImages] = await GoogleClass.publicBucket.getFiles({ prefix: 'mfc' });
        const existingIconImages = [];
        const existingMainImages = [];
        for (const file of existingImages) {
            if (file.name.includes(mainImageFolder) && file.name.includes('.webp'))
                existingMainImages.push(file.name.replace(mainImageFolder, ''));
            else if (file.name.includes(iconImageFolder) && file.name.includes('.webp'))
                existingIconImages.push(file.name.replace(iconImageFolder, ''));
        }
        ;
        for (const [imgLink, downloadedFileName] of imgLinks) {
            const folderPath = process.env.TEMP_PATH;
            const convertedFileName = downloadedFileName.replace('jpg', 'webp');
            const downloadedFilePath = folderPath + downloadedFileName;
            const convertedFilePath = folderPath + convertedFileName;
            if (existingIconImages.indexOf(convertedFileName) !== -1) {
                console.log(`${convertedFileName} already exists in the folder ${iconImageFolder}.`);
            }
            else {
                console.log(`Trying to download file "${downloadedFileName}"...`);
                await downloadImageFromUrl(imgLink, downloadedFilePath)
                    .then(async () => {
                    console.log(`Converting "${downloadedFileName}" to WEBP...`);
                    await convertToWebp(downloadedFilePath).then(async () => {
                        console.log(`Trying to upload file "${convertedFileName}"`);
                        await GoogleClass.publicBucket.upload(convertedFilePath, { destination: iconImageFolder + convertedFileName }).then(() => log(`Successfully uploaded ${'"' + leftPad(convertedFileName, 9) + '"'} to bucket "${GoogleClass.publicBucket.name}" in the folder "${iconImageFolder}".`));
                        await Promise.all([unlink(convertedFilePath), unlink(downloadedFilePath)]);
                    });
                })
                    .catch((err) => log(`FAILED: ${err.message}`));
            }
            ;
            if (existingMainImages.indexOf(convertedFileName) !== -1) {
                console.log(`${convertedFileName} already exists in the folder ${mainImageFolder}.`);
            }
            else {
                let routeOfImage = '/2/';
                let routeOfIcon = '/0/';
                const response = await fetch(imgLink.replace(routeOfIcon, routeOfImage));
                routeOfImage = response.status === 404 ? '/1/' : '/2/';
                console.log(`Trying to download file "${downloadedFilePath}"...`);
                await downloadImageFromUrl(imgLink.replace(routeOfIcon, routeOfImage), downloadedFilePath)
                    .then(async () => {
                    console.log(`Converting "${downloadedFileName}" to WEBP...`);
                    await convertToWebp(downloadedFilePath).then(async () => {
                        console.log(`Trying to upload file "${convertedFileName}"`);
                        await GoogleClass.publicBucket.upload(convertedFilePath, { destination: mainImageFolder + convertedFileName }).then(() => log(`Successfully uploaded ${'"' + leftPad(convertedFileName, 9) + '"'} to bucket "${GoogleClass.publicBucket.name}" in the folder "${mainImageFolder}".`));
                        await Promise.all([unlink(convertedFilePath), unlink(downloadedFilePath)]);
                    });
                })
                    .catch((err) => log(`FAILED: ${err.message}`));
            }
            ;
        }
        ;
    }
    ;
    async function deleteOldImages() {
        const imageFilesToKeep = imgLinks.map((linksArray) => linksArray[1].replace('.jpg', '.webp'));
        const [imageFiles] = await GoogleClass.publicBucket.getFiles({ prefix: 'mfc' });
        const imageFilesToDelete = imageFiles.filter((x) => {
            const shouldKeep = imageFilesToKeep.includes((x.name.split('/').pop()));
            const isFolder = x.name.substring(x.name.length - 1) === '/';
            return !shouldKeep && !isFolder;
        });
        for (const fileToDelete of imageFilesToDelete) {
            log(`Deleting file ${fileToDelete.name}...`);
            await fileToDelete.delete();
        }
        ;
    }
    ;
    await downloadNewImages();
    await deleteOldImages();
}
;
class ScrapeFunctions {
    static async readMFCItem(elementId, typeOfFigure) {
        let id = elementId;
        let href = `${mfcLink}/item/${elementId}`;
        let img = `https://storage.googleapis.com/statisticshock_github_io_public/mfc/main_images/${elementId}.webp`;
        let icon = `https://storage.googleapis.com/statisticshock_github_io_public/mfc/icons/${elementId}.webp`;
        let character;
        let characterJap;
        let source;
        let sourceJap;
        let classification;
        let category;
        let type = typeOfFigure;
        let title;
        let tags;
        const page = await browser.newPage();
        await page.setUserAgent({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
        });
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });
        await page.goto(`${mfcLink}/item/${elementId}`, { waitUntil: 'domcontentloaded' });
        const figureHtml = await page.content();
        await page.close();
        const $$ = cheerio.load(figureHtml);
        if ($$('h1.title').text() !== '') {
            log('Fetching ' + $$('h1.title').text());
        }
        else {
            log(figureHtml);
        }
        title = $$('h1.title').text();
        const dataFields = $$('.object-wrapper .data-wrapper .data-field');
        for (const element of dataFields.toArray()) {
            if ($$(element).find('.data-label').text().includes('Categoria')) {
                category = $$(element).find('.data-value').text();
            }
            ;
            if ($$(element).find('.data-label').text().includes('Classificaç')) {
                if ($$(element).find('.data-value a span').filter((i, el) => $$(el).attr('switch') !== '').length === 0) {
                    classification = $$(element).find('.data-value a span').map((i, el) => $$(el).text()).toArray().join(', ');
                }
                else {
                    classification = $$(element).find('.data-value a span').map((i, el) => $$(el).attr('switch')).toArray().join(', ');
                }
                ;
            }
            ;
            if ($$(element).find('.data-label').text().includes('Personag') || $$(element).find('.data-label').text().includes('Título')) {
                character = $$(element).find('.data-value').text();
                characterJap = $$(element).find('.data-value a span').map((i, item) => $$(item).attr('switch')).get().join(', ');
            }
            ;
            if ($$(element).find('.data-label').text().includes('Origem')) {
                source = $$(element).find('.data-value span[switch]').text();
                sourceJap = $$(element).find('.data-value span[switch]').attr('switch');
            }
            ;
        }
        ;
        if ($$('.object-tags').find('.object-tag')) {
            tags = $$('.object-tags').text().split('\?').join(' \• ').slice(0, -3);
        }
        ;
        const itemData = {
            id: id,
            href: href,
            icon: icon,
            img: img,
            character: character,
            characterJap: characterJap,
            sourceJap: sourceJap,
            source: source,
            classification: classification,
            category: category,
            tags: tags,
            type: type,
            title: title,
        };
        return itemData;
    }
    ;
}
;
async function fetchData(addingData) {
    console.log('Starting to fetch items...');
    const json = (await fetch(server + 'contents/mfc/').then((res) => res.json()))['mfc'];
    const newFiguresJson = [];
    const figuresToUpdateJson = [];
    const figuresToDeleteJson = [];
    const figuresIdsToKeep = [];
    if (json instanceof Array) {
        log('JSON file sucessfully loaded');
    }
    else {
        log("Couldn't fetch JSON file.");
        return;
    }
    ;
    const changes = [];
    if (addingData) {
        const maxKeys = json.reduce((prev, curr) => {
            if (Number(prev) < Object.keys(curr).filter((key) => key !== 'tags').length)
                prev = Object.keys(curr).filter((key) => key !== 'tags').length;
            return prev;
        }, 0);
        const itemsToUpdate = json.filter((figure) => Object.keys(figure).filter((key) => key !== 'tags').length < maxKeys);
        if (itemsToUpdate.length > 0) {
            for (const item of itemsToUpdate) {
                const index = json.indexOf(item);
                let type = undefined;
                for (const [typeOfFigure, link] of links) {
                    const response = await fetch(link);
                    const html = await response.text();
                    const $ = cheerio.load(html);
                    const itemIcons = $('.item-icon');
                    if (!type) {
                        for (const el of itemIcons.toArray()) {
                            const elementId = $(el).find('a').attr('href').replace('/item/', '');
                            if (elementId === item.id)
                                type = typeOfFigure;
                        }
                        ;
                    }
                    ;
                    await sleep(900);
                }
                ;
                const itemData = await ScrapeFunctions.readMFCItem(item.id, type);
                if (item !== itemData) {
                    changes.push('item data changed: ' + item.id);
                    figuresToUpdateJson.push([item, itemData]);
                    await sleep(900);
                }
            }
            ;
        }
        ;
    }
    ;
    let html;
    for (const [typeOfFigure, link] of links) {
        const dateFormat = Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        log(`\n[${dateFormat.format(new Date())}] Trying to access the url "${link}"...`);
        try {
            const page = await browser.newPage();
            await page.setUserAgent({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
            });
            await page.goto(link, { waitUntil: 'domcontentloaded' });
            html = await page.content();
            await page.close();
        }
        catch (err) {
            log('Failed with error: ' + err);
            return;
        }
        finally {
            log(`[${dateFormat.format(new Date())}] Succeded.`);
        }
        ;
        const $ = cheerio.load(html);
        const itemIcons = $('.item-icon');
        for (const el of itemIcons.toArray()) {
            const elementId = $(el).find('a').attr('href').replace('/item/', '');
            figuresIdsToKeep.push(elementId);
            const imgSrc = $(el).find('img').attr('src');
            if (imgSrc)
                imgLinks.push([imgSrc, imgSrc.split('/').pop().split('-')[0] + '.jpg']);
            await sleep(900);
            const index = json.findIndex((obj) => obj.id === elementId);
            if (index > 0) {
                if (json[index].type !== typeOfFigure) {
                    changes.push('item type changed: ' + elementId);
                    const oldFigure = new Object(json[index]);
                    const newFigure = new Object(json[index]);
                    newFigure.type = typeOfFigure;
                    figuresToUpdateJson.push([oldFigure, newFigure]);
                }
                ;
            }
            ;
            if (json.some((mfcObj) => mfcObj.id === elementId)) {
                continue;
            }
            else {
                changes.push('new item: ' + elementId);
                const itemData = await ScrapeFunctions.readMFCItem(elementId, typeOfFigure)
                    .then((res) => {
                    console.log(`[${Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())}] Trying to access figure from ID ${elementId}`);
                    return res;
                });
                newFiguresJson.push(itemData);
            }
            ;
        }
        ;
        await sleep(1000);
    }
    ;
    json.filter((figure) => !(figuresIdsToKeep.includes(figure.id.toString()))).forEach((figure) => figuresToDeleteJson.push(figure));
    if (figuresToDeleteJson.length > 0) {
        figuresToDeleteJson.forEach((figure) => changes.push(`Deletion of figure ${figure.id}`));
    }
    ;
    if (changes.length > 0) {
        log(`Changes:\n${changes.reduce((prev, curr) => { return prev + '• ' + curr + '\n'; }, '')}`);
        const methods = [
            {
                method: 'POST',
                object: newFiguresJson,
                comment: `${newFiguresJson.length} additions in "mfc" were made.`,
            },
            {
                method: 'DELETE',
                object: figuresToDeleteJson,
                comment: `${figuresToDeleteJson.length} deletions in "mfc" were made.`,
            },
            {
                method: 'PUT',
                object: figuresToUpdateJson,
                comment: `${figuresToUpdateJson.length} updates in "mfc" were made.`,
            }
        ];
        methods.forEach(async (method) => {
            let logThisMethod = true;
            const maxItemsPerRequest = 10;
            for (let j = 0; j < Math.ceil(method.object.length / maxItemsPerRequest); j++) {
                const chunk = method.object.slice(j * maxItemsPerRequest, (j + 1) * maxItemsPerRequest);
                await fetch(`${server}mfc/`, {
                    method: method.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(chunk),
                }).catch((err) => {
                    log(`Error: ${err.message}`);
                    logThisMethod = false;
                });
            }
            ;
            await sleep(7500);
            if (logThisMethod)
                log(method.comment);
        });
    }
    else {
        log('No changes in "mfc" were made.');
    }
}
;
export async function main(addingData, isRunByBot) {
    logIsRunByBot = isRunByBot ?? false;
    if (isRunByBot)
        log('ESTA EXECUÇÃO FOI ATIVADA POR CLEYTON PELO TELEGRAM.\n\n');
    try {
        await fetchData(addingData);
        await scrapeImages();
    }
    catch (err) {
        log('Error in script: ' + err.message);
    }
    finally {
        console.log('Closing conections...');
        setTimeout(() => process.exit(0), 1500);
    }
    ;
}
;
export async function fillData() {
    await main(true, true);
}
;
