import "dotenv/config";
import express from "express";
import cors from 'cors';
import { Storage } from "@google-cloud/storage";
import * as types from "../types/types.js";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import multer from 'multer';
import * as ra from '@retroachievements/api';
import CustomFunctions from '../src/functions.js';

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

const { RA_API_KEY, RA_USERNAME } = process.env;
const userObject: object = {username: RA_USERNAME};
const authorization: object = {username: RA_USERNAME, webApiKey: RA_API_KEY};
const raAuthorization = (ra as any).buildAuthorization(authorization);
const raUrl = 'https://retroachievements.org';

const serviceAccount: object = JSON.parse(process.env.GOOGLE_JSON_KEY);
const storage = new Storage({credentials: serviceAccount});

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const corsHeaders = {
	origin: [
		'https://statisticshock.github.io',
		'http://127.0.0.1:5500',
		'http://localhost:3000',
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
const upload: multer.Multer = multer({ storage: multerStorage });

app.use(cors(corsHeaders), express.json());

// MY ANIME LIST
const MAL_API_URL: string = "https://api.myanimelist.net/v2/";
const MAL_ACCESS_TOKEN: string = process.env.MAL_ACCESS_TOKEN;

app.get("/myanimelist/:type", async (req: express.Request, res: express.Response) => {
	const { type } = req.params;
	let { username, offset } = req.query;

	async function fetchMyAnimeList (type: string, username: string, offset: number | string, res: express.Response): Promise<types.AnimeList | types.MangaList> {
		if (type !== 'animelist' && type !== 'mangalist') res.status(400).json({ error: `Couldn't fetch data from type "${type}".\n Possible types are "animelist" and "mangalist".` });
		
		const response: Response = await fetch(`${MAL_API_URL}users/${username}/${type}?limit=100&sort=list_updated_at&offset=${offset}&fields=list_status,genres,num_episodes,num_chapters,nsfw,rank`, {
			headers: {
				"X-MAL-CLIENT-ID": MAL_ACCESS_TOKEN,
			},
		});

		if (!response.ok) res.status(response.status).json({ error: `Couldn't fetch ${MAL_API_URL}.` })

		let data: types.AnimeList | types.MangaList;

		if (type === 'animelist') {
			data = await response.json() as types.AnimeList;
		} else if (type === 'mangalist') {
			data = await response.json() as types.MangaList;
		};

		return data;
	};

	try {
		if (!offset) offset = '0';

		const data = await fetchMyAnimeList(type as string, username as string, offset as string, res);

		res.status(200).json(data);
	} catch (err) {
		res.status(500).json({ error: err.message });
	};
});

app.get("/contents/", async (req: express.Request, res: express.Response) => {
	const { filename } = req.query;

	try {
		const bucket = storage.bucket('statisticshock_github_io');
		const file = bucket.file(`${filename}.json`);

		const json = JSON.parse((await file.download()).toString())
		res.status(200).json(json);
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
});

app.get("/retroAchievements/:language/", async (req: express.Request, res: express.Response) => {
	const { language } = req.params;

	const translations: Array<Array<string | number>> = [
		['en-US', 'pt-BR', 'n'],
		['Mastery', 'Platinado', 2],
		['Completion', 'Completo', 3],
		['Game Beaten', 'Zerado', 4],
		['Certified Legend', 'Lenda Certificada', 1],
		['Event', 'Evento', 1],
	];
	
	if (translations[0].indexOf(language) === -1) res.status(400).json({ message: 'There is no such language as ' + language + ' available.' });

	const formattedAwards: Array<types.RetroAchievementsFormattedAward> = [];
	const consoles: any = [];

	async function getAndFormatAwards (): Promise<void> {
		let json: types.RetroAchievementsAwardsResponse = await (ra as any).getUserAwards(raAuthorization, userObject);

		for (const award of json.visibleUserAwards) {	//To format the json itself
			if (award.awardType === 'Mastery/Completion') {
				if (award.awardDataExtra === 1) {	//Hardcore mode
					award.awardType = 'Mastery';
				} else if (award.awardDataExtra === 0) {	//Softcore mode
					award.awardType = 'Completion';
				};
			};

			award.awardType = CustomFunctions.vlookup(award.awardType, translations, translations[0].indexOf(language) + 1);
		};

		json.visibleUserAwards = json.visibleUserAwards.sort((a, b) => {	//Sort awards in order of priority and date
			const positionA: number = CustomFunctions.vlookup(a.awardType, translations, 3, translations[0].indexOf(language) + 1);
			const positionB: number = CustomFunctions.vlookup(b.awardType, translations, 3, translations[0].indexOf(language) + 1);

			if (positionA !== positionB) return positionA - positionB;
			else {
				const dateA: number = new Date(a.awardedAt).getTime();
				const dateB: number = new Date(b.awardedAt).getTime();

				return dateA - dateB;
			};
		});

		for (const award of json.visibleUserAwards) {
			if (formattedAwards.some((formattedAward) => formattedAward.awardData === award.awardData)) {	//Join data from award if it appears more than once
				const index: number = formattedAwards.indexOf(formattedAwards.filter((formattedAward) => formattedAward.awardData === award.awardData)[0]);

				if (formattedAwards[index].allData.some((data) => Math.abs(new Date(data.awardedAt).getTime() - new Date(award.awardedAt).getTime()) < 1000 * 60)) {	// Updates a game award data if it happened the same time as the current entry
					const awardDataToUpdate = formattedAwards[index].allData.filter((data) => Math.abs(new Date(data.awardedAt).getTime() - new Date(award.awardedAt).getTime()) < 1000 * 60)[0];
					const dataIndexInAward: number = formattedAwards[index].allData.indexOf(awardDataToUpdate);
					formattedAwards[index].allData[dataIndexInAward].awardType += ` • ${award.awardType}`
				} else {	//Add new data if awards happened in different times
					formattedAwards[index].allData.push({
						awardType: award.awardType,
						awardedAt: award.awardedAt,
						displayOrder: award.displayOrder,
					});
				};
			} else {	//Pushes awards to array
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
			};
		};
	};

	async function getAndFormatConsoles (): Promise<void> {
		let json = await (ra as any).getConsoleIds(raAuthorization);
		consoles.push(json);
	}

	await Promise.all([getAndFormatConsoles(), getAndFormatAwards()]);

	const output: types.RetroAchievementsOutput = {
		awards: formattedAwards,
		consoles: consoles[0],
	}

	res.status(200).json(output);
});

type ShortcutRequest = express.Request<{}, {}, types.NewShortcutData>
async function uploadShortcut (req: ShortcutRequest, res: express.Response, next: express.NextFunction) {
	['title', 'url', 'folder'].forEach((key) => {
		if (!req.body[key]) next(); //Skips file upload if it isn't a shortcut upload
	});

	const correctId = CustomFunctions.normalize(req.body.title).replaceAll(' ', '-');

	async function uploadImage (): Promise<void> { //Converts the image to webp with FFMpeg and the uploads it on Google Cloud
		const fileExtension: string = req.file!.filename.split('.').pop();
		const outputPath: string = `temp/${correctId}.webp`;

		async function convertImage (): Promise<void> {
			ffmpeg(req.file!.path)
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
					res.json({message: `ffmpeg: ${err.message}`});
				})
				.run();
		};

		await convertImage();

		const folderPath: string = 'icons/dynamic/';
		const bucket = storage.bucket('statisticshock_github_io_public');
		
		await bucket.upload(outputPath, { destination: outputPath.replace('temp/', folderPath)});

		if (bucket.file(outputPath.replace('temp/', folderPath)).exists()) {
			console.log(`File uploaded: ${outputPath.replace('temp/', folderPath)}`);
		} else {
			console.log("File didn't upload");
			res.status(500).json({ message: "File didn't upload" });
		};
	};

	await uploadImage()

	async function getDataToReturn (): Promise<void | types.ShortcutResponse> { //Updates contents.json on Google Cloud
		try {
			const bucket = storage.bucket('statisticshock_github_io');
			const file = bucket.file('contents.json');
			let contents: types.PageContent = JSON.parse((await file.download()).toString());

			const newImgPath: string = `https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/${correctId}.webp`;
			const section: types.Shortcut = contents.shortcuts.filter((shortcut) => shortcut.title === req.body.folder)[0];

			let id: string;
			if (section === undefined) {
				id = CustomFunctions.normalize(req.body.folder).replaceAll(' ', '-');
			} else {
				id = section.id;
			}

			return { sectionId: id, newImgPath: newImgPath }
		} catch (err) {
			res.status(500).json({ message: err.message });
		};
	};

	const requestResponseData = await getDataToReturn() as types.ShortcutResponse;
	res.status(200).json(requestResponseData);
};
app.post("/upload/", upload.single('file'), uploadShortcut, async (req: express.Request, res: express.Response) => {res.status(400).json({message: 'Wrong upload.'})});

app.listen(PORT, () => console.log(`Server running...`));