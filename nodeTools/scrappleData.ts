// 
// IT IS INTENDED TO DOWNLOAD IMAGES FROM MFC BASED ON THE CSV FILE 
// 

import { promises as fsPromises } from 'fs';
import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';


const url: string = '../myFigureCollection.csv'
const outputUrl: string = '../myFigureCollectionOutput.csv'

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCSVData(url: string) {
    try {
        let response = await fsPromises.readFile(url, 'utf-8');
        let responseWithNoQuotation = response.replaceAll('"','');
        let data = responseWithNoQuotation.split(/\r?\n/); //Puts each line of the csv in a single line
        let splitData: Array<Array<string>> = [];

        data.forEach(row => {   //Splits each line by ';' characters
            splitData.push(row.split(/;/));
        });
        return splitData
    } catch (error: any) {
        console.error(error.message)
    }
}

interface imgMFCItem {
    id: string,
    title: string,
    root: string,
    category: string,
    releaseDate: string,
    releasePrice: string,
    scale: string,
    barcode: string,
    status: string,
    count: string,
    score: string,
    paymentDate: string,
    shippingDate: string,
    collectingDate: string,
    price: string,
    shop: string,
    shippingMethod: string,
    trackingNumber: string,
    wishability: string,
    note: string,
    character?: string,
    imgSrc?: string,
}

function arrayToObject (array: Array<string>): imgMFCItem {    
    let object: imgMFCItem = {
        id:             array[0],
        title:          array[1],
        root:           array[2],
        category:       array[3],
        releaseDate:    array[4],
        releasePrice:   array[5],
        scale:          array[6],
        barcode:        array[7],
        status:         array[8],
        count:          array[9],
        score:          array[10],
        paymentDate:    array[11],
        shippingDate:   array[12],
        collectingDate: array[13],
        price:          array[14],
        shop:           array[15],
        shippingMethod: array[16],
        trackingNumber: array[17],
        wishability:    array[18],
        note:           array[19],
    }
    return object;
}

async function downloadImage(url: string, filename: string) {
    try {
        const response = await axios({
            url,
            responseType: 'stream', // Stream mode for efficiency
        });

        const writer = fs.createWriteStream(filename);
        response.data.pipe(writer);

        writer.on('finish', () => console.log(`Downloaded: ${filename}`));
        writer.on('error', err => console.error('Error writing file:', err));
    } catch (error) {
        console.error('Error downloading image:', error.status, url);
    }
}

async function fetchItemData(url: string) {
    const res: Response = await fetch(url);
    const text: string = await res.text(); // Wait for text() to resolve
    
    const $ = cheerio.load(text);          // Loads the text as a page

    const dataContent = $('.data.row > .data-field'); // SImilar to a document.querySelector()
    
    if (dataContent.length == 0) {console.error(`Couldn't fetch ${url} sucessfully.`)}

    let character: string;

    dataContent.each((i, el) => {
        if ($(el).children('.data-label').text().includes('Personage') || $(el).children('.data-label').text().includes('Título')) { // Tests if the header "Personagem", "Personagens" ou "Título" existe
            character = $(el).children('.data-value').text();
        };
    });

    const imgSrc: string = $('.item-picture .main img').attr('src');

    await sleep(825); // Sleeps by 825ms

    if (character == undefined) return [res.status,'']
    else return [character, imgSrc];
}

async function processFigures(): Promise<void> {
    let response: string = await fsPromises.readFile(url, 'utf-8');
    let arr: Array<string> = response.split(/\r?\n/);
    
    let data: Array<Array<string>>   = await getCSVData(url);
    let dataArray: Array<imgMFCItem> = data.map(arrayToObject); 
    let fet: Array<string | number>;
    let imgPath: string;

    arr[0] = arr[0] + `;"Character"`;

    await (async function () {for (let i = 1; i < dataArray.length; i++) {
        fet = await fetchItemData(`https://pt.myfigurecollection.net/item/${dataArray[i].id}`);
        console.log(fet[0]);
        arr[i] = arr[i] + `;"${fet[0]}"`;
        imgPath = `../images/mfc/${dataArray[i].id}.jpg`;

        if (!fs.existsSync(imgPath)) {
            await downloadImage(`${fet[1]}`, imgPath);
        } else {
            console.log(`${imgPath} already exists`)
        };
    };})();

    fs.writeFileSync(outputUrl, arr.join(String.fromCharCode(10)));
};

processFigures();