import { Storage } from '@google-cloud/storage';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import * as fs from 'fs'
import { pipeline } from 'stream';
import util from 'util';
import * as pathImport from 'path';

dotenv.config({path: pathImport.resolve(import.meta.dirname + '/.env')});
export class GoogleClass {
    static serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
    static storage = new Storage({ credentials: GoogleClass.serviceAccount });
    static bucket = GoogleClass.storage.bucket('statisticshock_github_io');
    static mfcJsonGoogle = GoogleClass.bucket.file('mfc.json');
    static publicBucket = GoogleClass.storage.bucket('statisticshock_github_io_public');
}

const streamPipeline = util.promisify(pipeline);

// To log to a .log file
const dirName = 'logs';
const logDir = pathImport.resolve(dirName);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const date = new Date();
const formattedDate = date.toLocaleDateString().split('/')[2] + '-' + date.toLocaleDateString().split('/')[1] + '-' + date.toLocaleDateString().split('/')[0];
const logFile = fs.createWriteStream(pathImport.join(logDir, `debug_${formattedDate}.log`), { flags: 'a' });
const log = function (message: string | number) {
    console.log(message);
    logFile.write(message + ' [' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ']' + '\n');
};

const mfcLink: string = 'https://pt.myfigurecollection.net';
export type mfc = {
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
}

export async function sleep (ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}

export const links = [
    ['Owned','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
    ['Ordered','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
    ['Wished','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
];

async function downloadImage(url: string, path: string): Promise<void> {
    const response = await fetch(url);

    if (!response.ok) log(`Failed to download: ${response.statusText}`);

    await streamPipeline(response.body as any, fs.createWriteStream(path));
}

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
            const [exists] = await GoogleClass.publicBucket.file(path.replace('temp/','')).exists();
            if (exists) {
                log(path.replace('temp/','') + ' already uploaded.')
                continue;
            } else {
                await downloadImage(finalLink, path);
                GoogleClass.publicBucket.upload(path);
                log(path.replace('temp/','') + ' uploaded to bucket.')
                await sleep(1000);
                fs.unlink(path, (err) => {
                    if (err) {
                        log(err.message);
                    };
                });
            };
        };
    }

    async function deleteOldImages(): Promise<void> {
        let imageFilesToKeep = imgLinks.map((link) => link.replace(/https\:\/\/static\.myfigurecollection\.net\/upload\/items\/[1-2]\//,'').split('-')[0] + '.jpg');
        
        const [imageFiles] = await GoogleClass.publicBucket.getFiles();
        const imageFilesToDelete = imageFiles.filter((x) => !imageFilesToKeep.includes(x.name))
        imageFilesToDelete.forEach((fileToDelete) => {
            log(`Deleting ${fileToDelete.name}...`)
            fileToDelete.delete();
        });
    }

    await downloadNewImages();
    await deleteOldImages();
}

export class ScrapeFunctions {
    async readMFCItem (elementId: string, typeOfFigure: string): Promise<mfc> {
        const response = await fetch(`${mfcLink}/item/${elementId}`);
        const html = await response.text();
        const $ = cheerio.load(html);

        log('Fetching ' + $('h1.title').text());
        
        let id: string = elementId;
        let href: string = `${mfcLink}/item/${elementId}`;
        let img: string = $('a.main img').attr('src').replaceAll(/https\:\/\/static\.myfigurecollection\.net\/upload\/items\/[0-2]\//g,'https://storage.googleapis.com/statisticshock_github_io_public/').split('-')[0] + '.jpg';
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

        const dataFields = $$('.data-field');
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
                characterJap = $$(element).find('.data-value a span').map((i, item) => $$(item).attr('switch')).get().join(', ')
            };
            if ($$(element).find('.data-label').text().includes('Origem')) {
                origin = $$(element).find('.data-value a span').attr('switch');
            }
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
}

async function fetchData(): Promise<void> {
    const scrapeFunctions = new ScrapeFunctions();

    console.log('Starting to fetch items...')
    let json: Array<mfc> = await scrapeFunctions.fetchJson();
    if (json instanceof Array) {
        log('JSON file sucessfully loaded')
    } else {
        log("Couldn't fetch JSON file.");
        return;
    }
    let changes: boolean = false;
    let figuresIdsToKeep: string[] = [];

    for (const [typeOfFigure, link] of links) {
        const response = await fetch(link);
        const html = await response.text();
        const $ = cheerio.load(html);

        const itemIcons = $('.item-icon');
        
        for (const el of itemIcons.toArray()) {
            const elementId: string = $(el).find('a').attr('href').replace('/item/','');
            figuresIdsToKeep.push(elementId);

            await sleep(900);

            let index: number = json.findIndex((obj) => obj.id === elementId);
            
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

                let itemData: mfc = await scrapeFunctions.readMFCItem(elementId, typeOfFigure);

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

export async function main(): Promise<void> {
    setInterval(() => {
        console.log('Memory usage:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');
    }, 5000);

    try {
        await fetchData();
        await scrapeImages();
    } catch (err) {
        log('Error in script: ' + err.message);
    } finally {
        console.log('Closing conections...');
        setTimeout(() => process.exit(0), 1500); // Closes everything
    }
}