import "dotenv/config";
import express from "express";
import cors from 'cors';
import { Storage } from "@google-cloud/storage";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import multer from 'multer';
import * as ra from '@retroachievements/api';
import CustomFunctions from '../util/functions.js';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { typeOfEndpoints } from './endpoints.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const unlink = util.promisify(fs.unlink);
const app = express();
const PORT = process.env.PORT || 3000;
const { RA_API_KEY, RA_USERNAME } = process.env;
const userObject = { username: RA_USERNAME };
const authorization = { username: RA_USERNAME, webApiKey: RA_API_KEY };
const raAuthorization = ra.buildAuthorization(authorization);
const raUrl = 'https://retroachievements.org';
const { SPREADSHEET_ID, GOOGLE_STORAGE_KEY, GOOGLE_SHEETS_KEY } = process.env;
const storageServiceAccount = JSON.parse(GOOGLE_STORAGE_KEY);
const storage = new Storage({ credentials: storageServiceAccount });
const sheetServiceAccount = JSON.parse(GOOGLE_SHEETS_KEY);
const sheetServiceAccountAuthenticated = new JWT({
    email: sheetServiceAccount.client_email,
    key: sheetServiceAccount.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const workbook = new GoogleSpreadsheet(SPREADSHEET_ID, sheetServiceAccountAuthenticated);
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const corsHeaders = {
    origin: [
        'https://statisticshock.github.io',
        'http://127.0.0.1:5500',
        'http://localhost:5500',
    ],
    optionsSuccessStatus: 200,
};
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "temp/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: multerStorage });
const MAL_API_URL = "https://api.myanimelist.net/v2/";
const MAL_ACCESS_TOKEN = process.env.MAL_ACCESS_TOKEN;
app.use(cors(corsHeaders), express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
ejs.delimiter = 'ç';
app.all("/", (req, res) => {
    res.render('server', { typeOfEndpoints });
});
app.get("/version/", async (req, res) => {
    const serverPath = path.join(__dirname, 'package.json');
    const serverPckg = fs.readFileSync(serverPath, 'utf-8');
    const serverVersion = serverPckg.match(/\"version\"\: \"[\d\.]+\"\,/)[0].match(/[\d\.]+/)[0];
    const pagePath = path.join(__dirname.replace(path.basename(__dirname), ''), 'package.json');
    const pagePckg = fs.readFileSync(pagePath, 'utf-8');
    const pageVersion = pagePckg.match(/\"version\"\: \"[\d\.]+\"\,/)[0].match(/[\d\.]+/)[0];
    res.status(200).json({ page: pageVersion, server: serverVersion });
});
app.get("/myanimelist/:type", async (req, res) => {
    const { type } = req.params;
    let { username, offset } = req.query;
    if (username === undefined)
        res.status(400).json({ message: `Error: There should be an username.` });
    async function fetchMyAnimeList(type, username, offset, res) {
        if (type !== 'animelist' && type !== 'mangalist')
            res.status(400).json({ message: `Couldn't fetch data from type "${type}".\n Possible types are "animelist" and "mangalist".` });
        const response = await fetch(`${MAL_API_URL}users/${username}/${type}?limit=100&sort=list_updated_at&offset=${offset}&fields=list_status,genres,num_episodes,num_chapters,nsfw,rank`, {
            headers: {
                "X-MAL-CLIENT-ID": MAL_ACCESS_TOKEN,
            },
        });
        if (!response.ok)
            res.status(200).json({ message: `Couldn't fetch ${MAL_API_URL}.` });
        let data;
        if (type === 'animelist') {
            data = await response.json();
        }
        else if (type === 'mangalist') {
            data = await response.json();
        }
        ;
        return data;
    }
    ;
    try {
        if (!offset)
            offset = '0';
        const data = await fetchMyAnimeList(type, username, offset, res);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
    ;
});
app.get("/contents(/:type)?", async (req, res) => {
    const { type } = req.params;
    await workbook.loadInfo();
    const jsonToSend = {};
    async function loadContent(sheet) {
        const rows = await sheet.getRows();
        const headers = [sheet.headerValues];
        const rowsData = rows.map((row, i) => row.toObject()).map((obj) => Object.keys(obj).map((key) => obj[key]));
        const data = headers.concat(rowsData);
        for (let i = 1; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j])
                    data[i][j] = CustomFunctions.getValueToProperType(data[i][j]);
            }
            ;
        }
        ;
        jsonToSend[sheet.title] = CustomFunctions.csvToJson(data)['data'];
    }
    ;
    try {
        if (type) {
            await workbook.sheetsByTitle[type].loadHeaderRow();
            await loadContent(workbook.sheetsByTitle[type]);
        }
        else {
            for (const worksheet of workbook.sheetsByIndex) {
                await worksheet.loadHeaderRow();
                await loadContent(worksheet);
            }
            ;
        }
        ;
    }
    catch (err) {
        res.status(err.status).json({ message: err.message });
    }
    ;
    res.status(200).json(jsonToSend);
});
app.get("/retroAchievements/:language/", async (req, res) => {
    const { language } = req.params;
    const translations = [
        ['en-US', 'pt-BR', 'n'],
        ['Mastery', 'Platinado', 2],
        ['Completion', 'Completo', 3],
        ['Game Beaten', 'Zerado', 4],
        ['Certified Legend', 'Lenda Certificada', 1],
        ['Event', 'Evento', 1],
    ];
    if (translations[0].indexOf(language) === -1)
        res.status(400).json({ message: 'There is no such language as ' + language + ' available.' });
    const formattedAwards = [];
    const consoles = [];
    async function getAndFormatAwards() {
        let json = await ra.getUserAwards(raAuthorization, userObject);
        for (const award of json.visibleUserAwards) {
            if (award.awardType === 'Mastery/Completion') {
                if (award.awardDataExtra === 1) {
                    award.awardType = 'Mastery';
                }
                else if (award.awardDataExtra === 0) {
                    award.awardType = 'Completion';
                }
                ;
            }
            ;
            award.awardType = CustomFunctions.vlookup(award.awardType, translations, translations[0].indexOf(language) + 1);
        }
        ;
        json.visibleUserAwards = json.visibleUserAwards.sort((a, b) => {
            const positionA = CustomFunctions.vlookup(a.awardType, translations, 3, translations[0].indexOf(language) + 1);
            const positionB = CustomFunctions.vlookup(b.awardType, translations, 3, translations[0].indexOf(language) + 1);
            if (positionA !== positionB)
                return positionA - positionB;
            else {
                const dateA = new Date(a.awardedAt).getTime();
                const dateB = new Date(b.awardedAt).getTime();
                return dateA - dateB;
            }
            ;
        });
        for (const award of json.visibleUserAwards) {
            if (formattedAwards.some((formattedAward) => formattedAward.awardData === award.awardData)) { //Join data from award if it appears more than once
                const index = formattedAwards.indexOf(formattedAwards.filter((formattedAward) => formattedAward.awardData === award.awardData)[0]);
                if (formattedAwards[index].allData.some((data) => Math.abs(new Date(data.awardedAt).getTime() - new Date(award.awardedAt).getTime()) < 1000 * 60)) { // Updates a game award data if it happened the same time as the current entry
                    const awardDataToUpdate = formattedAwards[index].allData.filter((data) => Math.abs(new Date(data.awardedAt).getTime() - new Date(award.awardedAt).getTime()) < 1000 * 60)[0];
                    const dataIndexInAward = formattedAwards[index].allData.indexOf(awardDataToUpdate);
                    formattedAwards[index].allData[dataIndexInAward].awardType += ` • ${award.awardType}`;
                }
                else { //Add new data if awards happened in different times
                    formattedAwards[index].allData.push({
                        awardType: award.awardType,
                        awardedAt: award.awardedAt,
                        displayOrder: award.displayOrder,
                    });
                }
                ;
            }
            else {
                formattedAwards.push({
                    awardData: award.awardData,
                    awardDataExtra: award.awardDataExtra,
                    title: award.title,
                    consoleId: award.consoleId,
                    consoleName: award.consoleName,
                    flags: award.flags,
                    imageIcon: raUrl + award.imageIcon,
                    allData: [{
                            awardType: award.awardType,
                            awardedAt: award.awardedAt,
                            displayOrder: award.displayOrder,
                        }],
                });
            }
            ;
        }
        ;
    }
    ;
    async function getAndFormatConsoles() {
        let json = await ra.getConsoleIds(raAuthorization);
        consoles.push(json);
    }
    await Promise.all([getAndFormatConsoles(), getAndFormatAwards()]);
    const output = {
        awards: formattedAwards,
        consoles: consoles[0],
    };
    res.status(200).json(output);
});
app.post("/t/:type/", async (req, res) => {
    const { type } = req.params;
    const headers = workbook.sheetsByTitle[type].headerValues;
    console.log(headers);
    res.status(201).json({ message: type + ' created.' });
});
app.listen(PORT, () => console.log(`[${Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())}] Server running...`));
