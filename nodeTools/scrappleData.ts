// 
// IT IS INTENDED TO DOWNLOAD IMAGES FROM MFC BASED ON THE CSV FILE 
// 

import { promises as fsPromises } from 'fs';
import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';


const csv: string = '../myFigureCollection.csv'
const csvOutput: string = '../myFigureCollectionOutput.csv'
const outputUrl: string = csvOutput;
const sleepTime: number = 875;

function sleep (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCSVData (url: string) {
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

async function downloadImage (url: string, filename: string) {
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

async function fetchItemData (url: string) {
    const resItem: Response = await fetch(url);
    const textItem: string = await resItem.text();          // Wait for text() to resolve
    const $ = cheerio.load(textItem);                       // Loads the text as a page
    const dataContentItem = $('.data.row > .data-field');   // Similar to a document.querySelector()

    if (dataContentItem.length == 0) {
        console.error(`Couldn't fetch ${url} sucessfully.`);
    }

    let character: string;
    let characterSwitch: Array<string>;

    dataContentItem.each((i, el) => {
        if ($(el).children('.data-label').text().includes('Personage') || $(el).children('.data-label').text().includes('Título')) { // Tests if the header "Personagem", "Personagens" ou "Título" existe
            character = $(el).children('.data-value').text();
            characterSwitch = $(el).find('.data-value a span').map((i, el) => $(el).attr('switch')).get();
            console.log("characterSwitches", characterSwitch);
        };
    });

    let characterJp: string = characterSwitch == undefined ? '' : characterSwitch.join(', ');

    const imgSrc: string = $('.item-picture .main img').attr('src');

    await sleep(sleepTime);

    if (character == undefined) return [resItem.status, '', '']
    else return [character, imgSrc, characterJp];
}

async function processFigures (): Promise<void> {
    let csvResponse: string = await fsPromises.readFile(csv, 'utf-8');
    let csvArr: Array<string> = csvResponse.split(/\r?\n/); //Gets each row of the csv file as a string


    // Get each character ID and Name in ouput file to avoid teching data my output alread have
    let csvOutputResponse: string | null;
    let charactersNamesInOutput: Array<Array<string>> = [[]];

    try {
        csvOutputResponse = await fsPromises.readFile(csvOutput, 'utf-8');
    } catch {
        csvOutputResponse = null;
    }

    if (csvOutputResponse !== null) {
        let csvOutputArr: Array<string> = csvOutputResponse.split(/\r?\n/); //Gets each row of the csv file as a string
        charactersNamesInOutput = csvOutputArr.map((row) => {
            let rowArr: Array<string>         = row.split('";"').map((item) => item = item.replaceAll('"',''));
            let characterName: string         = (rowArr[20] == undefined) || (rowArr[20] == 'undefined') ? ''    : rowArr[20];
            let originalCharacterName: string = (rowArr[21] == undefined) || (rowArr[21] == 'undefined') ? '503' : rowArr[21];
            let characterId: string           = (rowArr[0] == undefined)  || (rowArr[0] == 'undefined')  ? ''    : rowArr[0];
            return [characterId, characterName, originalCharacterName];
        });
    };
    
    //To get the actual data
    let data: string[][] = await getCSVData(csv);
    let dataArray: imgMFCItem[] = data.map(arrayToObject); 
    let fet: Array<string | number>;
    let imgPath: string;

    csvArr[0] = csvArr[0] + `;"Character";"Original Character Name"`;

    await (async function () {for (let i = 1; i < dataArray.length; i++) {
        let characterDataAlreadyInOutput: string[][] = charactersNamesInOutput.filter((row) => {    // Tests if entry exists in CSV output
            return row[0] == dataArray[i].id;
        });

        if (characterDataAlreadyInOutput.length == 0 || characterDataAlreadyInOutput[0][1] == '' || characterDataAlreadyInOutput[0][1] == '503' || characterDataAlreadyInOutput[0][2] == '503') { // If entry doesn't exist in CSV output, fetch it
            fet = await fetchItemData(`https://pt.myfigurecollection.net/item/${dataArray[i].id}`);
            console.log(`Fetched ${fet[0]} from ID`, dataArray[i].id);
        } else {                                                                                    // Else, gets its name directly from the output
            fet = [characterDataAlreadyInOutput[0][1], '', characterDataAlreadyInOutput[0][2]];
            console.log(`${fet[0]} from ID`,dataArray[i].id,'already in CSV output');
        }
        
        csvArr[i] = csvArr[i] + `;"${fet[0]}";"${fet[2]}"`;
        imgPath = `../images/mfc/${dataArray[i].id}.jpg`;

        if (!fs.existsSync(imgPath)) {
            await downloadImage(`${fet[1]}`, imgPath);
        } else {
            console.log(`${imgPath} already exists`)
        };
    };})();

    fs.writeFileSync(outputUrl, csvArr.join(String.fromCharCode(10)));
};

processFigures();