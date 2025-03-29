import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as pathImport from 'path';
import util from 'util';
dotenv.config();
const serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
const storage = new Storage({ credentials: serviceAccount });
const bucket = storage.bucket('statisticshock_github_io');
const mfcJsonGoogle = bucket.file('mfc.json');
import ScrapeFunctions, { sleep } from './scrapeData.js';
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
const log = function (message) {
    console.log(message);
    logFile.write(message + ' [' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ']' + '\n');
};
const silentLog = function (message) {
    logFile.write(message + ' [' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ']' + '\n');
};
export async function updateItem(elementId, json) {
    let oldItemData = json.filter((item) => { return item.id === elementId; })[0];
    let typeOfFigure = oldItemData.type;
    let newItemData = await scrapeFunctions.readMFCItem(elementId, typeOfFigure); // Get new data from teh item
    log(`Fetched item: ${newItemData.title}`);
    if (util.isDeepStrictEqual(newItemData, oldItemData)) {
        log('No changes needed.');
        return;
    }
    else {
        log('Item changed.');
        json = json.filter((item) => { return item.id !== elementId; }); // Remove item from json
        json.push(newItemData); // and add the updated item data
        log(`Updated item: ${newItemData.title}`);
        mfcJsonGoogle.save(JSON.stringify(json, null, 2));
        log('Changes in mfc.json were made.');
    }
}
import * as readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}
async function getTypeOfFigures() {
    const defaultAnswers = [
        { i: '1', answer: 'Owned' },
        { i: '2', answer: 'Ordered' },
        { i: '3', answer: 'Wished' }
    ];
    let question = 'Which type of figures you want?\n';
    for (let obj of defaultAnswers) {
        question = `${question}${obj.i}: ${obj.answer}\n`;
    }
    question = question + '>>';
    let typeOfFigureIndex;
    while (typeOfFigureIndex === undefined || defaultAnswers.filter((element) => { return element.i === typeOfFigureIndex; }).length === 0) { //Tests both if the question wasn't delivered yet or if the answer is not valid.
        typeOfFigureIndex = await askQuestion(question);
    }
    let typeOfFigure = defaultAnswers.filter((element) => { return element.i === typeOfFigureIndex; })[0].answer;
    silentLog('Which type of figures you want?');
    log(`Selected "${typeOfFigure}".`);
    return typeOfFigure;
}
async function getFigureIdByType(typeOfFigure, jsonFile) {
    let filteredJson = jsonFile.filter((element) => { return element.type === typeOfFigure; });
    let question = 'Which Figure should be updated?\n';
    for (let figureData of filteredJson) {
        question = `${question}${figureData.id}: ${figureData.title}\n`;
    }
    question = question + '>>';
    let answer;
    while (answer === undefined || filteredJson.filter((element) => { return element.id === answer; }).length === 0) { //Tests both if the question wasn't delivered yet or if the answer is not valid.
        answer = await askQuestion(question);
    }
    silentLog(`Which Figure should be updated?\n>>${answer}: ${filteredJson.filter((element) => { return element.id === answer; })[0].title}`);
    return answer;
}
async function main(json) {
    if (!json) {
        log('Fetching JSON file...');
        json = await scrapeFunctions.fetchJson();
        if (json) {
            log('Fetched JSON file succesfully.');
        }
        else {
            log('Failed to fetch JSON file.');
            return;
        }
        ;
    }
    let typeOfFigure = await getTypeOfFigures();
    let elementId = await getFigureIdByType(typeOfFigure, json);
    await updateItem(elementId, json);
    let answer;
    while (answer === undefined || (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'no')) {
        answer = await askQuestion('Update another figure?\n>>');
    }
    silentLog(`Update another figure? >>${answer.toUpperCase()}`);
    if (answer.toLowerCase() === 'yes') {
        main(json);
    }
    else {
        log('Closing...');
        sleep(1500);
        rl.close();
    }
}
await main();
