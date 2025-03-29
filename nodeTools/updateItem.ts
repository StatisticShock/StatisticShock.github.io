import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import * as fs from 'fs'
import * as pathImport from 'path';
import util from 'util';

dotenv.config();
const serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
const storage = new Storage({ credentials: serviceAccount });
const bucket = storage.bucket('statisticshock_github_io');
const mfcJsonGoogle = bucket.file('mfc.json');

import ScrapeFunctions, { mfc, sleep } from './scrapeData.js'
const scrapeFunctions = new ScrapeFunctions();

// To log to a .log file
const dirName = 'updateLogs';
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
const silentLog = function (message: string | number) {
    logFile.write(message + ' [' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ']' + '\n');
};


export async function updateItem (elementId: string, json: mfc[]): Promise<void> {
    let oldItemData: mfc = json.filter((item) => {return item.id === elementId})[0];
    let typeOfFigure: string = oldItemData.type;

    let newItemData: mfc = await scrapeFunctions.readMFCItem(elementId, typeOfFigure); // Get new data from teh item

    log(`Fetched item: ${newItemData.title}`);

    if (util.isDeepStrictEqual(newItemData, oldItemData)) {
        log('No changes needed.');
        return;
    } else {
        log('Item changed.');

        json = json.filter((item) => {return item.id !== elementId});   // Remove item from json
        json.push(newItemData);                                            // and add the updated item data

        log(`Updated item: ${newItemData.title}`);
        mfcJsonGoogle.save(JSON.stringify(json, null, 2));
        log('Changes in mfc.json were made.')
    }    
}

import * as readline from 'readline'
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion (question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        })
    })
}

async function getTypeOfFigures (): Promise<string> {
    type answer = {
        i: string,
        answer: string,
    }
    const defaultAnswers: Array<answer> = [
        {i: '1', answer: 'Owned'},
        {i: '2', answer: 'Ordered'},
        {i: '3', answer: 'Wished'}
    ]

    let question = 'Which type of figures you want?\n'

    for (let obj of defaultAnswers) {
        question = `${question}${obj.i}: ${obj.answer}\n`
    }

    question = question + '>>'

    let typeOfFigureIndex: string

    while(typeOfFigureIndex === undefined || defaultAnswers.filter((element) => {return element.i === typeOfFigureIndex}).length === 0) { //Tests both if the question wasn't delivered yet or if the answer is not valid.
        typeOfFigureIndex = await askQuestion(question);
    }

    let typeOfFigure: string = defaultAnswers.filter((element) => {return element.i === typeOfFigureIndex})[0].answer;

    silentLog('Which type of figures you want?');
    log(`Selected "${typeOfFigure}".`);

    return typeOfFigure;
}

async function getFigureIdByType (typeOfFigure: string, jsonFile: mfc[]): Promise<string> {
    let filteredJson: mfc[] = jsonFile.filter((element) => {return element.type === typeOfFigure});

    let question: string = 'Which Figure should be updated?\n';

    for (let figureData of filteredJson) {
        question = `${question}${figureData.id}: ${figureData.title}\n`
    }
    
    question = question + '>>';

    let answer: string;

    while (answer === undefined || filteredJson.filter((element) => {return element.id === answer}).length === 0) { //Tests both if the question wasn't delivered yet or if the answer is not valid.
        answer = await askQuestion(question);
    }
    
    silentLog(`Which Figure should be updated?\n>>${answer}: ${filteredJson.filter((element) => {return element.id === answer})[0].title}`);

    return answer;
}

async function main (json?: mfc[]): Promise<void> {
    if (!json) {
        log('Fetching JSON file...')
        json = await scrapeFunctions.fetchJson();
        if (json) {log('Fetched JSON file succesfully.')} else {log('Failed to fetch JSON file.'); return;};
    }

    let typeOfFigure: string = await getTypeOfFigures();

    let elementId: string = await getFigureIdByType(typeOfFigure, json);

    await updateItem(elementId, json);

    let answer: string;

    while (answer === undefined || (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'no')) {
        answer = await askQuestion('Update another figure?\n>>')
    }
    silentLog(`Update another figure? >>${answer.toUpperCase()}`);
    if (answer.toLowerCase() === 'yes') {
        main(json);
    } else {
        log('Closing...');
        sleep(1500);
        rl.close();
    }
}

await main();