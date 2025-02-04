// 
// IT IS INTENDED TO DOWNLOAD IMAGES FROM MFC BASED ON THE CSV FILE 
// 

import { promises as fsPromises } from 'fs';
import fs from 'fs';
import axios from 'axios';

const url: string = '../myFigureCollection.csv'

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

let data: Array<Array<string>> = await getCSVData(url);
let dataObject: Array<object>  = data.map(arrayToObject); 

dataObject.forEach((object: imgMFCItem) => {
    if (object.id === 'ID')         return; //Ignore the first line
    if (object.status === 'Wished') return; //Ignore itens not obtained yet
    
    let imgUrl: string = `https://static.myfigurecollection.net/upload/items/2/${object.id}-${object.trackingNumber}.jpg`

    downloadImage(imgUrl, `../images/mfc/${object.id}.jpg`)
});