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
const PORT = process.env.PORT || 8080;
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
    let { username, offset, limit } = req.query;
    if (username === undefined)
        res.status(400).json({ message: `Error: There should be an username.` });
    async function fetchMyAnimeList(type, username, offset, res) {
        if (type !== 'animelist' && type !== 'mangalist')
            res.status(400).json({ message: `Couldn't fetch data from type "${type}".\n Possible types are "animelist" and "mangalist".` });
        const response = await fetch(`${MAL_API_URL}users/${username}/${type}?limit=${limit}&sort=list_updated_at&offset=${offset}&fields=list_status,genres,num_episodes,num_chapters,nsfw,rank&nsfw=true`, {
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
        const dataToReturn = data.data.map((entry) => {
            return {
                type: type.replace('list', ''),
                id: entry.node.id,
                title: entry.node.title,
                main_picture_large: entry.node.main_picture.large,
                main_picture_medium: entry.node.main_picture.medium,
                genres: entry.node.genres.map((genre) => genre.name).join(', '),
                num_entries: entry.node.num_chapters || entry.node.num_episodes,
                nsfw: entry.node.nsfw,
                rank: entry.node.rank ?? 'N/A',
                score: entry.list_status.score,
                progress: entry.list_status.num_chapters_read || entry.list_status.num_episodes_watched,
                updated_at: entry.list_status.updated_at,
                start_date: entry.list_status.start_date,
                finish_date: entry.list_status.finish_date,
            };
        });
        return {
            myanimelist: dataToReturn,
        };
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
app.post("/:type/", async (req, res) => {
    const { type } = req.params;
    await workbook.loadInfo();
    try {
        await workbook.sheetsByTitle[type].loadHeaderRow();
    }
    catch (err) {
        res.status(400).json({ message: 'Failed to load ' + type });
    }
    const sheet = workbook.sheetsByTitle[type];
    const headers = sheet.headerValues;
    const data = CustomFunctions.jsonToCsv(req.body, headers);
    const rowsToAdd = [];
    if (data[0][0] === null)
        res.status(400).json({ message: 'No data.' });
    data.forEach((row) => {
        const obj = {};
        for (const header of headers) {
            if (Number(row[headers.indexOf(header)])) {
                obj[header] = Number(row[headers.indexOf(header)]);
            }
            else {
                obj[header] = row[headers.indexOf(header)] || '';
            }
            ;
        }
        ;
        rowsToAdd.push(obj);
    });
    await sheet.addRows(rowsToAdd);
    res.status(201).json({ message: type + ' created.' });
});
app.delete("/:type/", async (req, res) => {
    const { type } = req.params;
    try {
        await workbook.loadInfo();
        const sheet = workbook.sheetsByTitle[type];
        if (!sheet)
            return res.status(404).json({ message: `Sheet '${type}' not found.` });
        await sheet.loadHeaderRow();
        const headers = sheet.headerValues;
        const data = CustomFunctions.jsonToCsv(req.body, headers);
        if (!data.length || data[0][0] === null) {
            return res.status(400).json({ message: 'No data provided.' });
        }
        const rows = await sheet.getRows();
        const rowsToDelete = [];
        data.forEach((dataToDelete) => {
            const match = rows.find((row) => headers.every((header, i) => ((dataToDelete[i]) ?? '') === (row.get(header) ?? '')));
            if (match)
                rowsToDelete.push(match);
        });
        for (const row of rowsToDelete) {
            await row.delete();
        }
        res.status(200).json({ message: `${rowsToDelete.length} row(s) deleted from '${type}'.` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.put("/:type/", async (req, res) => {
    const { type } = req.params;
    try {
        await workbook.loadInfo();
        const sheet = workbook.sheetsByTitle[type];
        if (!sheet)
            return res.status(404).json({ message: `Sheet '${type}' not found.` });
        await sheet.loadHeaderRow();
        const headers = sheet.headerValues;
        if (!Array.isArray(req.body) || !req.body.every(pair => Array.isArray(pair) && pair.length === 2)) {
            return res.status(400).json({ message: 'Invalid data format.' });
        }
        ;
        const data = req.body.map(([oldObj, newObj]) => {
            const oldRow = CustomFunctions.jsonToCsv([oldObj], headers)[0];
            const newRow = CustomFunctions.jsonToCsv([newObj], headers)[0];
            return [oldRow, newRow];
        });
        if (!data.length || data[0][0] === null) {
            return res.status(400).json({ message: 'No data provided.' });
        }
        ;
        const rows = await sheet.getRows();
        data.forEach(async ([oldData, dataToUpdate]) => {
            const match = rows.find((row) => headers.every((header, i) => ((oldData[i]) ?? '') === (row.get(header) ?? '')));
            if (match) {
                console.log(match);
                headers.forEach((header, i) => {
                    console.log(header, dataToUpdate[i]);
                    match.set(header, dataToUpdate[i]);
                });
                await match.save();
            }
            ;
        });
        res.status(200).json({ message: `${data.length} row(s) updated from '${type}'.` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.listen(PORT, () => console.log(`[${Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())}] Server running...`));
