// 
// IT IS INTENDED TO DOWNLOAD IMAGES FROM MFC BASED ON THE CSV FILE 
// 
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import readline from 'readline';
const csv = '../mfc.csv';
const csvOutput = '../mfcOutput.csv';
const outputUrl = csvOutput;
const sleepTime = 875;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getCSVData(url) {
    try {
        let response = await fsPromises.readFile(url, 'utf-8');
        let responseWithNoQuotation = response.replaceAll('"', '');
        let data = responseWithNoQuotation.split(/\r?\n/); //Puts each line of the csv in a single line
        let splitData = [];
        data.forEach(row => {
            splitData.push(row.split(/;/));
        });
        return splitData;
    }
    catch (error) {
        console.error(error.message);
    }
}
function arrayToObject(array) {
    let object = {
        id: array[0],
        title: array[1],
        root: array[2],
        category: array[3],
        releaseDate: array[4],
        releasePrice: array[5],
        scale: array[6],
        barcode: array[7],
        status: array[8],
        count: array[9],
        score: array[10],
        paymentDate: array[11],
        shippingDate: array[12],
        collectingDate: array[13],
        price: array[14],
        shop: array[15],
        shippingMethod: array[16],
        trackingNumber: array[17],
        wishability: array[18],
        note: array[19],
    };
    return object;
}
async function downloadImage(url, filename) {
    try {
        const response = await axios({
            url,
            responseType: 'stream', // Stream mode for efficiency
        });
        const writer = fs.createWriteStream(filename);
        response.data.pipe(writer);
        writer.on('finish', () => console.log(`Downloaded: ${filename}`));
        writer.on('error', err => console.error('Error writing file:', err));
    }
    catch (error) {
        console.error('Error downloading image:', error.status, url);
    }
}
async function fetchItemData(url) {
    const resItem = await fetch(url);
    const textItem = await resItem.text(); // Wait for text() to resolve
    const $ = cheerio.load(textItem); // Loads the text as a page
    const dataContentItem = $('.data.row > .data-field'); // Similar to a document.querySelector()
    if (dataContentItem.length == 0) {
        console.error(`Couldn't fetch ${url} sucessfully.`);
    }
    let character;
    let characterSwitch;
    let originSwitch;
    let classification;
    dataContentItem.each((i, el) => {
        if ($(el).children('.data-label').text().includes('Personage') || $(el).children('.data-label').text().includes('Título')) { // Tests if the header "Personagem", "Personagens" or "Título" exists
            character = $(el).children('.data-value').text();
            characterSwitch = $(el).find('.data-value a span').map((i, el) => $(el).attr('switch')).get()[0] == '' ? $(el).find('.data-value a span').map((i, el) => $(el).text()).get() : $(el).find('.data-value a span').map((i, el) => $(el).attr('switch')).get();
            console.log("characterSwitches", characterSwitch);
        }
        ;
        if ($(el).children('.data-label').text().includes('Origem')) { // Tests if the header "Origem" exists
            originSwitch = $(el).find('.data-value a span').attr('switch') == '' ? $(el).find('.data-value a span').text() : $(el).find('.data-value a span').attr('switch');
            console.log("originSwitches", [originSwitch]);
        }
        ;
        if ($(el).children('.data-label').text().includes('Classificação')) { // Tests if the header "Classificação" exists
            classification = $(el).find('.data-value a span').text();
            console.log("classification", [classification]);
        }
        ;
    });
    let characterJp = characterSwitch == undefined ? '' : characterSwitch.join(', ');
    classification = classification == undefined ? '' : classification;
    const imgSrc = $('.item-picture .main img').attr('src');
    await sleep(sleepTime);
    if (character == undefined)
        return [resItem.status, '', '', '', ''];
    else
        return [character, imgSrc, characterJp, originSwitch, classification];
}
async function processFigures() {
    let csvResponse = await fsPromises.readFile(csv, 'utf-8');
    let csvArr = csvResponse.split(/\r?\n/); //Gets each row of the csv file as a string
    // Get each character ID and Name in ouput file to avoid teching data my output alread have
    let csvOutputResponse;
    let charactersNamesInOutput = [[]];
    try {
        csvOutputResponse = await fsPromises.readFile(csvOutput, 'utf-8');
    }
    catch {
        csvOutputResponse = null;
    }
    if (csvOutputResponse !== null) {
        let csvOutputArr = csvOutputResponse.split(/\r?\n/); //Gets each row of the csv file as a string
        charactersNamesInOutput = csvOutputArr.map((row) => {
            let rowArr = row.split('";"').map((item) => item = item.replaceAll('"', ''));
            let characterName = (rowArr[20] == undefined) || (rowArr[20] == 'undefined') ? '' : rowArr[20];
            let originalCharacterName = (rowArr[21] == undefined) || (rowArr[21] == 'undefined') ? '503' : rowArr[21];
            let characterId = (rowArr[0] == undefined) || (rowArr[0] == 'undefined') ? '' : rowArr[0];
            let originName = (rowArr[22] == undefined) || (rowArr[22] == 'undefined') ? '503' : rowArr[22];
            let itemClassification = (rowArr[23] == undefined) || (rowArr[23] == 'undefined') ? '503' : rowArr[23];
            return [characterId, characterName, originalCharacterName, originName, itemClassification];
        });
    }
    ;
    //To get the actual data
    let data = await getCSVData(csv);
    let dataArray = data.map(arrayToObject);
    let fet;
    let imgPath;
    csvArr[0] = `${csvArr[0]};"Character";"Original Character Name";"Origin";"Classification"`;
    await (async function () {
        for (let i = 1; i < dataArray.length; i++) {
            let characterDataAlreadyInOutput = charactersNamesInOutput.filter((row) => {
                return row[0] == dataArray[i].id;
            });
            if (characterDataAlreadyInOutput.length == 0 ||
                characterDataAlreadyInOutput[0][1] == '' ||
                characterDataAlreadyInOutput[0][1] == '503' ||
                characterDataAlreadyInOutput[0][2] == '503' ||
                characterDataAlreadyInOutput[0][3] == '503' ||
                characterDataAlreadyInOutput[0][4] == '503') { // If entry doesn't exist in CSV output, fetch it. THIS LINE MUST BE CHANGED TO VERIFIFY EVERYTHING THAT IS ADDED TO MFCO.csv VIA CODE
                fet = await fetchItemData(`https://pt.myfigurecollection.net/item/${dataArray[i].id}`);
                console.log(String.fromCharCode(10), `Fetched ${fet[0]} from ID`, dataArray[i].id);
            }
            else { // Else, gets its name directly from the output
                // CHANGE THIS LINE EACH TIME AN ITEM IS ADDED TO THE CSV FILE. CURRENTLY, THERE ARE 24 ITEMS BY LINE IN mfco.csv
                fet = [
                    characterDataAlreadyInOutput[0][1],
                    '',
                    characterDataAlreadyInOutput[0][2],
                    characterDataAlreadyInOutput[0][3],
                    characterDataAlreadyInOutput[0][4]
                ];
                console.log(String.fromCharCode(10), `${fet[0]} from ID`, dataArray[i].id, 'already in CSV output');
            }
            csvArr[i] = csvArr[i] + `;"${fet[0]}";"${fet[2]}";"${fet[3]}";"${fet[4]}"`;
            imgPath = `../images/mfc/${dataArray[i].id}.jpg`;
            if (!fs.existsSync(imgPath)) {
                await downloadImage(`${fet[1]}`, imgPath);
            }
            else {
                console.log(`${imgPath} already exists`);
            }
            ;
        }
        ;
    })();
    fs.writeFileSync(outputUrl, csvArr.join(String.fromCharCode(10)));
}
;
await processFigures();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question(String.fromCharCode(10) + "Hit 'Enter' key to close...", () => {
    rl.close();
});
