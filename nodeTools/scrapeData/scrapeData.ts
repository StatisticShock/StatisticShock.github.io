import * as Google from '@google-cloud/storage';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { pipeline } from 'stream';
import util from 'util';
import * as pathImport from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

dotenv.config({path: pathImport.resolve(import.meta.dirname + '/.env')});

export class GoogleClass {
    static serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
    static storage: Google.Storage = new Google.Storage({ credentials: GoogleClass.serviceAccount });
    static bucket: Google.Bucket = GoogleClass.storage.bucket('statisticshock_github_io');
    static mfcJsonGoogle: Google.File = GoogleClass.bucket.file('mfc.json');
    static publicBucket: Google.Bucket = GoogleClass.storage.bucket('statisticshock_github_io_public');
};

const streamPipeline = util.promisify(pipeline);

// To log to a .log file
const dirName = 'logs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathImport.dirname(__filename);
const logDir = pathImport.resolve(__dirname, dirName);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const date = new Date().toISOString().split('T')[0];
const logFile = fs.createWriteStream(pathImport.join(logDir, `debug_${date}.log`), { flags: 'a' });
const log = function (message: string | number) {
    console.log(message);
    logFile.write(`${message} [${Intl.DateTimeFormat('pt-BR', {hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(new Date())}]\n`);
};
const execute = util.promisify(exec);

const mfcLink: string = 'https://pt.myfigurecollection.net';
export type mfc = {
    [k: string]: string;

    id: string,
    href: string,
    img: string,
    character: string,
    characterJap: string,
    origin: string,
    classification: string,
    category: string,
    type: string,
    title: string,
};

export async function sleep (ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
};

export const links = [
    ['Owned','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
    ['Ordered','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
    ['Wished','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
];

async function downloadImage(url: string, path: string): Promise<void> {
    const response = await fetch(url);

    if (!response.ok) log(`Failed to download: ${response.statusText}`);

    await streamPipeline(response.body as any, fs.createWriteStream(path));
};

async function scrapeImages(): Promise<void> {
    let imgLinks: string[] = [];
    async function downloadNewImages(): Promise<void> {
        for (const [type, link] of links) {
            const response = await fetch(link);
            const html = await response.text();
            const $ = cheerio.load(html);

            $('.item-icon a img').each((i, el) => {
                const imgSrc = $(el).attr('src');
                if (imgSrc) {
                    imgLinks.push(imgSrc.replace('/0/', '/2/'));
                }
            });
        }

        for (const imgLink of imgLinks) {
            let response = await fetch(imgLink);
            let finalLink: string;

            if (response.status === 404) {
                finalLink = imgLink.replace('/2/', '/1/');
            } else {
                finalLink = imgLink;
            };

            let path: string = 'temp/' + finalLink.split(/\/[1-2]\//)[1].split('-')[0] + '.jpg';
            let finalPath: string = path.replace('jpg', 'webp');

            const [exists] = await GoogleClass.publicBucket.file(finalPath.replace('temp','mfc')).exists();
            if (exists) {
                log(finalPath.replace('temp/','mfc/') + ' already uploaded.')
                continue;
            } else {
                await downloadImage(finalLink, path);
                await convertToWebp(path);
                GoogleClass.publicBucket.upload(finalPath, { destination: finalPath.replace('temp', 'mfc')});
                log(finalPath.replace('temp/','') + ' uploaded to bucket.')
                await sleep(1000);
                fs.unlink(path, (err) => {
                    if (err) {
                        log(err.message);
                    };
                });
                fs.unlink(finalPath, (err) => {
                    if (err) {
                        log(err.message);
                    };
                });
            };
        };
    }

    async function deleteOldImages(): Promise<void> {
        let imageFilesToKeep: Array<string> = imgLinks.map((link) => 'mfc/' + link.replace(/https\:\/\/static\.myfigurecollection\.net\/upload\/items\/[1-2]\//,'').split('-')[0] + '.webp');
        
        const [imageFiles] = await GoogleClass.publicBucket.getFiles();
        const imageFilesToDelete = imageFiles.filter((x) => !imageFilesToKeep.includes(x.name))
        for (const fileToDelete of imageFilesToDelete) {
            if (!fileToDelete.name.includes('mfc/')) continue; //Skip every link that is not from "mfc" folder
            log(`Deleting ${fileToDelete.name}...`)
            fileToDelete.delete();
        };
    };

    await downloadNewImages();
    await deleteOldImages();
};

async function convertToWebp (imgPath) {
    try {
        await execute(`ffmpeg -i "${imgPath}" -y -lossless 1 "${imgPath.replace('jpg','webp')}"`)
    } catch (e) {
        log(e.code);
        log(e.message);
    };
};

export class ScrapeFunctions {
    async readMFCItem (elementId: string, typeOfFigure: string): Promise<mfc> {
        let response = await fetch(`${mfcLink}/item/${elementId}`);
        
        if (!response.ok) {
            await sleep(10000);
            response = await fetch(`${mfcLink}/item/${elementId}`);
        }
        
        const html = await response.text();

        const $ = cheerio.load(html);

        log('Fetching ' + $('h1.title').text());
        
        let id: string = elementId;
        let href: string = `${mfcLink}/item/${elementId}`;
        let img: string = $('a.main img').attr('src').replaceAll(/https\:\/\/static\.myfigurecollection\.net\/upload\/items\/[0-2]\//g,'https://storage.googleapis.com/statisticshock_github_io_public/mfc/').split('-')[0] + '.webp';
        let character: string;
        let characterJap: string;
        let origin: string;
        let classification: string;
        let category: string;
        let type: string = typeOfFigure;
        let title: string = $('h1.title').text();

        const figureResponse = await fetch(`${mfcLink}/item/${elementId}`);
        const figureHtml = await figureResponse.text();
        const $$ = cheerio.load(figureHtml);

        const dataFields = $$('.object-wrapper .data-wrapper .data-field');
        for (const element of dataFields.toArray()) {
            if ($$(element).find('.data-label').text().includes('Categoria')) {
                category = $$(element).find('.data-value').text();
            };
            if ($$(element).find('.data-label').text().includes('Classificaç')) {
                if ($$(element).find('.data-value a span').attr('switch') == '') {
                    classification = $$(element).find('.data-value a span').text()
                } else {
                    classification = $$(element).find('.data-value a span').attr('switch');
                }
            };
            if ($$(element).find('.data-label').text().includes('Personag') || $$(element).find('.data-label').text().includes('Título')) {
                character = $$(element).find('.data-value').text();
                characterJap = $$(element).find('.data-value a span').map((i, item) => $$(item).attr('switch')).get().join(', ');
            };
            if ($$(element).find('.data-label').text().includes('Origem')) {
                origin = $$(element).find('.data-value span[switch]').attr('switch');
            };
        };

        const itemData : mfc = {
            id: id,
            href: href,
            img: img,
            character: character, 
            characterJap: characterJap,
            origin: origin,
            classification: classification, 
            category: category,
            type: type,
            title: title,
        }

        return itemData;
    }

    async fetchJson(): Promise<Array<mfc>> {
        let json: Array<mfc> = JSON.parse(await fetch('https://statisticshock-github-io.onrender.com/figurecollection/').then(res => res.text()));
        return json;
    }
};

async function fetchData(addingData?: boolean): Promise<void> {
    const scrapeFunctions = new ScrapeFunctions();

    console.log('Starting to fetch items...')
    let json: Array<mfc> = await scrapeFunctions.fetchJson();
    if (json instanceof Array) {
        log('JSON file sucessfully loaded');
    } else {
        log("Couldn't fetch JSON file.");
        return;
    }
    let changes: boolean = false;
    let figuresIdsToKeep: string[] = [];

    if (addingData) {
        const itemsToUpdate: Array<mfc> = json.filter((obj) => Object.keys(obj).length < 10);

        if (itemsToUpdate.length > 0) {
            for (const item of itemsToUpdate) {
                const index = json.indexOf(item);

                let type: string | undefined = undefined;

                for (const [typeOfFigure, link] of links) { //To check item type
                    const response = await fetch(link);
                    const html = await response.text();
                    const $ = cheerio.load(html);

                    const itemIcons = $('.item-icon');
                    if (!type) {
                        for (const el of itemIcons.toArray()) {
                            const elementId: string = $(el).find('a').attr('href').replace('/item/','');
                            if (elementId === item.id) type = typeOfFigure;
                        };
                    };

                    await sleep(900);
                };

                const itemData: mfc = await scrapeFunctions.readMFCItem(item.id, type);

                if (item !== itemData) {
                    changes = true;
                    json[index] = itemData;
                    log(`Updated.`);
                    log(`Type: ${itemData.type}`)
                    await sleep(900);
                }
            };
        };

        if (changes) {
            GoogleClass.mfcJsonGoogle.save(JSON.stringify(json, null, 2));
            log('Changes in the file "mfc.json" were made.');
        }
    } else {
        for (const [typeOfFigure, link] of links) {
            const response = await fetch(link);
            const html = await response.text();
            const $ = cheerio.load(html);

            const itemIcons = $('.item-icon');
            
            for (const el of itemIcons.toArray()) {
                const elementId: string = $(el).find('a').attr('href').replace('/item/','');
                figuresIdsToKeep.push(elementId);

                await sleep(900);

                const index: number = json.findIndex((obj) => obj.id === elementId);
                
                if (index > 0) {
                    if (json[index].type !== typeOfFigure) {
                        changes = true;
                        json[index].type = typeOfFigure;
                    };
                };

                if (json.some((mfcObj) => mfcObj.id === elementId)) {
                    continue;
                } else {
                    changes = true;

                    const itemData: mfc = await scrapeFunctions.readMFCItem(elementId, typeOfFigure);

                    json.push(itemData);
                };
            };

            await sleep(1000);
        };

        let outputJson = json.filter((obj) => {
            return figuresIdsToKeep.includes(obj.id);
        });
        if (outputJson.length < json.length) {
            changes = true;
        }

        if (changes) {
            GoogleClass.mfcJsonGoogle.save(JSON.stringify(outputJson, null, 2));
            log('Changes in the file "mfc.json" were made.');
        }
    };
};

export async function main(addingData?: boolean): Promise<void> {
    setInterval(() => {
        console.log('Memory usage:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');
    }, 5000);

    try {
        await fetchData(addingData);
        await scrapeImages();
    } catch (err) {
        log('Error in script: ' + err.message);
    } finally {
        console.log('Closing conections...');
        setTimeout(() => process.exit(0), 1500); // Closes everything
    }
};

export async function fillData (): Promise<void> {
   await main(true);
}