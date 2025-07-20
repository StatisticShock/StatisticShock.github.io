import * as cheerio from 'cheerio';
import util, { callbackify } from 'util';
import { ScrapeFunctions, GoogleClass, mfc, sleep, links, main } from '../../scrapeData.js';

const scrapeFunctions = new ScrapeFunctions();

export async function getNewData (elementId: string, json: mfc[]): Promise<[Partial<mfc>, Array<any>, Partial<mfc>[]] | undefined> {
    let oldItemData: mfc = json.filter((item) => {return item.id === elementId})[0];
    let typeOfFigure: string | undefined = undefined;

    for (let [type, link] of links) {
        const response = await fetch(link);
        const html = await response.text();
        const $ = cheerio.load(html);

        const grid = $('.item-icons span a');
        grid.each((i, el) => {
            if ($(el).attr('href')!.includes(elementId)) {
                typeOfFigure = type;
            }
        })
    };

    if (typeOfFigure === undefined) {
        console.log(`Figure isn't in the list anymore.`);
        return;
    };

    if (typeOfFigure !== oldItemData.type) {
        console.log(`Figure now is from the type "${typeOfFigure}".`)
    }

    let newItemData: mfc = await scrapeFunctions.readMFCItem(elementId, typeOfFigure); // Get new data from the item

    console.log(`Fetched item: ${newItemData.title}${String.fromCharCode(10)}`);
    const newKeys = compareKeys(oldItemData, newItemData);

    return [removeUndefinedFromObject(newItemData), newKeys, json];    
};

export async function updateItem (elementId: string, json: Partial<mfc>[], newData: Partial<mfc>): Promise<undefined | Partial<mfc>[]> {
    if (isLooselyEqual(json.filter((item) => item.id === elementId), newData)) {
        console.log('No changes needed.');
        return;
    } else {
        console.log('Item changed.');

        json = json.filter((item) => {return item.id !== elementId});   // Remove item from json
        json.push(newData);                                         // and add the updated item data

        console.log(`Updated item: ${newData.title}`);
        await GoogleClass.mfcJsonGoogle.save(JSON.stringify(json, null, 2));
        console.log('Changes in mfc.json were made.');
        return json;
    };
};

function compareKeys (a: Partial<mfc>, b: Partial<mfc>): string[] {
    let aKeys = Object.keys(a).filter((key) => a[key] !== undefined).sort();
    let bKeys = Object.keys(b).filter((key) => b[key] !== undefined).sort();

    let newKeys = bKeys.filter((key) => {
        return !aKeys.includes(key)
    })

    newKeys.map((key) => {
        console.log(`New key: ${key} ("${b[key]}")`);
    })
    
    return newKeys;
};

function isLooselyEqual(a: any, b: any) {
    function normalize (obj: any): object {
        return Object.entries(obj).filter((entry) => entry[1] !== undefined);
    };
    
    const cleanA = normalize(a);
    const cleanB = normalize(b);

    console.log('Testing if it is equal.');
  
    return util.isDeepStrictEqual(cleanA, cleanB);
};

function removeUndefinedFromObject (object: Partial<mfc>): Partial<mfc> {
    const keys = Object.keys(object);
    keys.forEach((key) => {
        if (object[key] === undefined) {
            delete object[key];
        };
    });

    return object;
};