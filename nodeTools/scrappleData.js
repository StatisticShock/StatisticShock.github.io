// 
// IT IS INTENDED TO DOWNLOAD IMAGES FROM MFC BASED ON THE CSV FILE 
// 
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
const csv = '../myFigureCollection.csv';
const csvOutput = '../myFigureCollectionOutput.csv';
const outputUrl = csvOutput;
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
    const res = await fetch(url);
    const text = await res.text(); // Wait for text() to resolve
    const $ = cheerio.load(text); // Loads the text as a page
    const dataContent = $('.data.row > .data-field'); // SImilar to a document.querySelector()
    if (dataContent.length == 0) {
        console.error(`Couldn't fetch ${url} sucessfully.`);
    }
    let character;
    dataContent.each((i, el) => {
        if ($(el).children('.data-label').text().includes('Personage') || $(el).children('.data-label').text().includes('Título')) { // Tests if the header "Personagem", "Personagens" ou "Título" existe
            character = $(el).children('.data-value').text();
        }
        ;
    });
    const imgSrc = $('.item-picture .main img').attr('src');
    await sleep(825); // Sleeps by 825ms
    if (character == undefined)
        return [res.status, ''];
    else
        return [character, imgSrc];
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
            console.log(row.split('";"').length);
            let characterName = row.split('";"')[20] == undefined ? '' : row.split('";"')[20].replaceAll('"', '');
            let characterId = row.split('";"')[0].replaceAll('"', '');
            return [characterId, characterName];
        });
    }
    ;
    //To get the actual data
    let data = await getCSVData(csv);
    let dataArray = data.map(arrayToObject);
    let fet;
    let imgPath;
    csvArr[0] = csvArr[0] + `;"Character"`;
    await (async function () {
        for (let i = 1; i < dataArray.length; i++) {
            let characterDataAlreadyInOutput = charactersNamesInOutput.filter((row) => {
                return row[0] == dataArray[i].id;
            });
            if (characterDataAlreadyInOutput.length == 0 || characterDataAlreadyInOutput[0][1] == '') { // If entry doesn't exist in CSV output, fetch it
                fet = await fetchItemData(`https://pt.myfigurecollection.net/item/${dataArray[i].id}`);
                console.log(`Fetched ${fet[0]} from ID`, dataArray[i].id);
            }
            else { // Else, gets its name directly from the output
                fet = [characterDataAlreadyInOutput[0][1], ''];
                console.log(`${fet[0]} from ID`, dataArray[i].id, 'already in CSV output');
            }
            csvArr[i] = csvArr[i] + `;"${fet[0]}"`;
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
processFigures();
