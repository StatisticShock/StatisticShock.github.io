import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { Storage } from "@google-cloud/storage";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = "https://api.myanimelist.net/v2/";
const ACCESS_TOKEN = process.env.MAL_ACCESS_TOKEN;
const serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
const storage = new Storage({credentials: serviceAccount})

export type AnimeList = {
    data: Array<{
        node: {
            id: number;
            title: string;
            main_picture: {
                medium: string;
                large: string;
            };
            synopsis: string;
            genres: Array<{
                id: number;
                name: StaticRangeInit;
            }>;
            num_episodes: number;
            nsfw: string;
            rank: number;
        },
        list_status: {
            status: string;
            score: number;
            num_episodes_watched: number;
            is_rewatching: boolean;
            updated_at: string;
            start_date?: string;
            finish_date?: string;
        }
    }>;
    paging: {
        next: string
    }
};
export type MangaList = {
    data: Array<{
        node: {
            id: number;
            title: string;
            main_picture: {
                medium: string;
                large: string;
            };
            synopsis: string;
            genres: Array<{
                id: number;
                name: StaticRangeInit;
            }>;
            num_chapters: number;
            nsfw: string;
            rank: number;
        };
        list_status: {
            status: string;
            is_rereading: boolean;
            num_volumes_read: number;
            num_chapters_read: number;
            score: number;
            updated_at: string;
            start_date?: string;
            finish_date?: string;
        };
    }>;
    paging: {
        next: string;
    };
};

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
        const response: Response = await fetch(`${API_URL}users/${username}/animelist?limit=100&sort=list_updated_at&offset=${offset}&fields=list_status,synopsis,genres,num_episodes,nsfw,rank`, {
            headers: {
                "X-MAL-CLIENT-ID": ACCESS_TOKEN,
            },
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data: AnimeList = await response.json();

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/mangalist/:username/:offset?", async (req, res) => {
    let { username, offset } = req.params;

    if (!offset) offset = 0;

    try {
        const response: Response = await fetch(`${API_URL}users/${username}/mangalist?limit=100&sort=list_updated_at&offset=${offset}&fields=list_status,synopsis,genres,num_chapters,nsfw,rank`, {
            headers: {
                "X-MAL-CLIENT-ID": ACCESS_TOKEN,
            },
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data: MangaList = await response.json();

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

app.listen(PORT, () => console.log(`Server running...`));