import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { Storage } from "@google-cloud/storage";



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = "https://api.myanimelist.net/v2/users/";
const ACCESS_TOKEN = process.env.MAL_ACCESS_TOKEN;
const serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
const storage = new Storage({credentials: serviceAccount})

const corsHeaders = {
    origin: [
        'https://statisticshock.github.io',
        'http://127.0.0.1:5500',
        'http://localhost:3000'
    ],
    optionsSuccessStatus: 200
};

app.use(cors(corsHeaders));

app.get("/animelist/:username/:offset?", async (req, res) => {
    let { username, offset } = req.params;

    if (!offset) offset = 0;

    try {
        const response = await fetch(`${API_URL}${username}/animelist?limit=10&sort=list_updated_at&offset=${offset}&fields=list_status`, {
            headers: {
                "X-MAL-CLIENT-ID": ACCESS_TOKEN,
            },
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/mangalist/:username/:offset?", async (req, res) => {
    let { username, offset } = req.params;

    if (!offset) offset = 0;

    try {
        const response = await fetch(`${API_URL}${username}/mangalist`, {
            headers: {
                "X-MAL-CLIENT-ID": ACCESS_TOKEN,
            },
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/figurecollection/", async (req, res) => {
    try {
        const bucket = storage.bucket('statisticshock_github_io');
        const file = bucket.file('mfc.json');

        const json = JSON.parse((await file.download()).toString())
        res.json(json)

    } catch (err) {
        console.error(err);
    }
})

app.listen(PORT, () => console.log(`Server running on https://statisticshock-github-io.onrender.com`));