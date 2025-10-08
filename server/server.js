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
        `http://localhost:${PORT}`,
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
app.use(cors(corsHeaders), express.json());
const MAL_API_URL = "https://api.myanimelist.net/v2/";
const MAL_ACCESS_TOKEN = process.env.MAL_ACCESS_TOKEN;
app.get("/myanimelist/:type", async (req, res) => {
    const { type } = req.params;
    let { username, offset } = req.query;
    async function fetchMyAnimeList(type, username, offset, res) {
        if (type !== 'animelist' && type !== 'mangalist')
            res.status(400).json({ message: `Couldn't fetch data from type "${type}".\n Possible types are "animelist" and "mangalist".` });
        const response = await fetch(`${MAL_API_URL}users/${username}/${type}?limit=100&sort=list_updated_at&offset=${offset}&fields=list_status,genres,num_episodes,num_chapters,nsfw,rank`, {
            headers: {
                "X-MAL-CLIENT-ID": MAL_ACCESS_TOKEN,
            },
        });
        if (!response.ok)
            res.status(response.status).json({ message: `Couldn't fetch ${MAL_API_URL}.` });
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
app.get("/contents(/:update)?", async (req, res) => {
    const { update } = req.params;
    if (update) {
        if (update !== 'update')
            res.status(400).json({ message: 'Update should be named "update" only.' });
    }
    ;
    await workbook.loadInfo();
    const jsonToSend = { updated: false };
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
        if (update) {
            for (const worksheet of workbook.sheetsByIndex) {
                await worksheet.loadHeaderRow();
            }
            ;
            jsonToSend.updated = true;
            console.log();
        }
        ;
        for (const worksheet of workbook.sheetsByIndex) {
            await loadContent(worksheet);
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
app.post("/shortcuts/", upload.single('file'), async (req, res, next) => {
    ['title', 'url', 'folder'].forEach((key) => {
        if (!req.body[key])
            next();
    });
    const newShortcutId = CustomFunctions.normalize(req.body.title);
    async function uploadImage() {
        const fileExtension = req.file.filename.split('.').pop();
        const outputPath = `temp/${newShortcutId}.webp`;
        async function convertImage() {
            return new Promise((resolve, reject) => {
                ffmpeg(req.file.path)
                    .outputOptions([
                    '-y',
                    '-vf', 'scale=-1:256',
                    '-pix_fmt', 'rgba',
                    '-lossless', '1'
                ])
                    .output(outputPath)
                    .on('end', () => {
                    console.log(`Conversion finished: ${outputPath}`);
                    resolve();
                })
                    .on('error', (err) => {
                    res.json({ message: `ffmpeg: ${err.message}` });
                    return reject(new Error(err.message));
                })
                    .run();
            });
        }
        ;
        await convertImage();
        const folderPath = 'icons/dynamic/';
        const bucket = storage.bucket('statisticshock_github_io_public');
        console.log(`Trying to upload file: ${outputPath.split('/').pop()}`);
        await bucket.upload(outputPath, { destination: outputPath.replace('temp/', folderPath) });
        console.log(`Successfully uploaded: ${outputPath.split('/').pop()}`);
        if (bucket.file(outputPath.replace('temp/', folderPath)).exists()) {
            console.log(`File uploaded: ${outputPath.replace('temp/', folderPath)}`);
        }
        else {
            console.log("File didn't upload");
            res.status(500).json({ message: "File didn't upload" });
        }
        ;
        await unlink(req.file.path);
        await unlink(outputPath);
    }
    ;
    async function getDataToReturn() {
        try {
            const newImgPath = `https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/${newShortcutId}.webp`;
            await uploadImage();
            return { newImgPath: newImgPath };
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
        ;
    }
    ;
    const requestResponseData = await getDataToReturn();
    res.status(201).json(requestResponseData);
}, async (req, res) => { res.status(400).json({ message: 'Wrong upload.' }); });
app.put("/shortcuts/", async (req, res, next) => {
    async function deleteOldImages(data) {
        if (!data)
            return;
        else if (!data.shortcuts)
            return;
        else if (!(data.shortcuts.length > 0))
            return;
        else {
            const folderPrefix = 'icons/dynamic/';
            const bucket = storage.bucket('statisticshock_github_io_public');
            const [files] = await bucket.getFiles({ prefix: folderPrefix });
            const filenamesToKeep = [];
            for (const section of data.shortcuts) {
                for (const shortcut of section.children) {
                    filenamesToKeep.push(shortcut.img.split(folderPrefix).pop());
                }
                ;
            }
            ;
            for (const file of files) {
                const fileExtension = file.name.split('.').pop();
                if (fileExtension !== 'webp')
                    continue;
                if (!(file.name in filenamesToKeep)) {
                    // await file.delete();
                    console.log(`deleted ${file.name}`);
                }
                ;
            }
            ;
        }
        ;
    }
    ;
    async function updateContentsJson() {
        const bucket = storage.bucket('statisticshock_github_io');
        const file = bucket.file(`contents.json`);
        let json = await JSON.parse((await file.download()).toString());
        json.shortcuts = req.body.shortcuts;
        await file.save(JSON.stringify(json, null, 2));
        await deleteOldImages(json);
    }
    ;
    async function getDataToReturn() {
        try {
            const bucket = storage.bucket('statisticshock_github_io');
            const file = bucket.file(`contents.json`);
            await updateContentsJson();
            await CustomFunctions.sleep(1500);
            let json = await JSON.parse((await file.download()).toString());
            return json;
        }
        catch (err) {
            next();
        }
        ;
    }
    ;
    const requestResponseData = await getDataToReturn();
    res.status(201).json(requestResponseData);
}, async (req, res) => { res.status(400).json({ message: 'Update failed.' }); });
app.listen(PORT, () => console.log(`[${Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())}] Server running...`));
