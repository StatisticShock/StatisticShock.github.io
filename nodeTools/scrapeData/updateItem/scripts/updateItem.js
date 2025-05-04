import * as cheerio from 'cheerio';
import util from 'util';
import { ScrapeFunctions, GoogleClass, links } from '../../scrapeData.js';
const scrapeFunctions = new ScrapeFunctions();
export async function updateItem(elementId, json) {
    let oldItemData = json.filter((item) => { return item.id === elementId; })[0];
    let typeOfFigure;
    for (let [type, link] of links) {
        const response = await fetch(link);
        const html = await response.text();
        const $ = cheerio.load(html);
        const grid = $('.item-icons span a');
        grid.each((i, el) => {
            if ($(el).attr('href').includes(elementId)) {
                typeOfFigure = type;
            }
        });
    }
    ;
    if (typeOfFigure === undefined) {
        console.log(`Figure isn't in the list anymore.`);
        return;
    }
    ;
    if (typeOfFigure !== oldItemData.type) {
        console.log(`Figure now is from the type "${typeOfFigure}".`);
    }
    let newItemData = await scrapeFunctions.readMFCItem(elementId, typeOfFigure); // Get new data from the item
    console.log(`Fetched item: ${newItemData.title}`);
    if (isLooselyEqual(newItemData, oldItemData)) {
        console.log('No changes needed.');
        return 'Nenhuma mudança necessária.';
    }
    else {
        console.log('Item changed.');
        json = json.filter((item) => { return item.id !== elementId; }); // Remove item from json
        json.push(newItemData); // and add the updated item data
        console.log(`Updated item: ${newItemData.title}`);
        GoogleClass.mfcJsonGoogle.save(JSON.stringify(json, null, 2));
        console.log('Changes in mfc.json were made.');
        return compareKeys(oldItemData, newItemData);
    }
    ;
}
;
function compareKeys(a, b) {
    let aKeys = Object.keys(a).sort();
    let bKeys = Object.keys(b).sort();
    let newKeys = bKeys.filter((key) => {
        return !aKeys.includes(key);
    });
    newKeys.map((key) => {
        console.log(b[key]);
    });
    console.log(newKeys);
    return newKeys;
}
function isLooselyEqual(a, b) {
    const normalize = obj => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
    const cleanA = normalize(a);
    const cleanB = normalize(b);
    return util.isDeepStrictEqual(cleanA, cleanB);
}
