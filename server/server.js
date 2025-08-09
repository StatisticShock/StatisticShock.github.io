import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { Storage } from "@google-cloud/storage";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import multer from 'multer';
import CustomFunctions from '../src/functions.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = "https://api.myanimelist.net/v2/";
const MAL_ACCESS_TOKEN = process.env.MAL_ACCESS_TOKEN;
const serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
const storage = new Storage({ credentials: serviceAccount });
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const corsHeaders = {
    origin: [
        'https://statisticshock.github.io',
        'http://127.0.0.1:5500',
        'http://localhost:3000'
    ],
    optionsSuccessStatus: 200
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
app.get("/myanimelist/", async (req, res) => {
    let { type, username, offset } = req.query;
    if (!offset)
        offset = '0';
    try {
        const data = await fetchMyAnimeList(type, username, offset);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/contents/", async (req, res) => {
    const { filename } = req.query;
    try {
        const bucket = storage.bucket('statisticshock_github_io');
        const file = bucket.file(`${filename}.json`);
        const json = JSON.parse((await file.download()).toString());
        res.json(json);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/upload/", upload.single('file'), uploadShortcut, async (req, res) => { res.status(400).json({ message: 'Wrong upload.' }); });
app.listen(PORT, () => console.log(`Server running...`));
// Functions that are too big to wrap in arrow functions
async function fetchMyAnimeList(type, username, offset) {
    if (type !== 'animelist' && type !== 'mangalist')
        return;
    const response = await fetch(`${API_URL}users/${username}/${type}?limit=100&sort=list_updated_at&offset=${offset}&fields=list_status,genres,num_episodes,nsfw,rank`, {
        headers: {
            "X-MAL-CLIENT-ID": MAL_ACCESS_TOKEN,
        },
    });
    if (!response.ok)
        return;
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
async function uploadShortcut(req, res, next) {
    ['title', 'url', 'folder'].forEach((key) => {
        if (!req.body[key])
            next(); //Skips file upload if it isn't a shortcut upload
    });
    const correctId = CustomFunctions.normalize(req.body.title).replaceAll(' ', '-');
    async function uploadImage() {
        const fileExtension = req.file.filename.split('.').pop();
        const outputPath = `temp/${correctId}.webp`;
        async function convertImage() {
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
            })
                .on('error', (err) => {
                res.json({ message: `ffmpeg: ${err.message}` });
            })
                .run();
        }
        ;
        await convertImage();
        const folderPath = 'icons/dynamic/';
        const bucket = storage.bucket('statisticshock_github_io_public');
        await bucket.upload(outputPath, { destination: outputPath.replace('temp/', folderPath) });
        if (bucket.file(outputPath.replace('temp/', folderPath)).exists()) {
            console.log(`File uploaded: ${outputPath.replace('temp/', folderPath)}`);
        }
        else {
            console.log("File didn't upload");
            res.status(500).json({ message: "File didn't upload" });
        }
        ;
    }
    ;
    await uploadImage();
    async function getDataToReturn() {
        try {
            const bucket = storage.bucket('statisticshock_github_io');
            const file = bucket.file('contents.json');
            let contents = JSON.parse((await file.download()).toString());
            const newImgPath = `https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/${correctId}.webp`;
            const section = contents.shortcuts.filter((shortcut) => shortcut.title === req.body.folder)[0];
            let id;
            if (section === undefined) {
                id = CustomFunctions.normalize(req.body.folder).replaceAll(' ', '-');
            }
            else {
                id = section.id;
            }
            return { sectionId: id, newImgPath: newImgPath };
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
        ;
    }
    ;
    const requestResponseData = await getDataToReturn();
    res.status(200).json(requestResponseData);
}
;
