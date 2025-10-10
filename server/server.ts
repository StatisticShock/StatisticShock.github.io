import "dotenv/config";
import express from "express";
import cors from 'cors';
import { Bucket, GetFilesResponse, Storage } from "@google-cloud/storage";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, GoogleSpreadsheetCell, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import * as MyTypes from "../util/types.js";
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

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

const { RA_API_KEY, RA_USERNAME } = process.env;
const userObject: object = {username: RA_USERNAME};
const authorization: object = {username: RA_USERNAME, webApiKey: RA_API_KEY};
const raAuthorization = (ra as any).buildAuthorization(authorization);
const raUrl = 'https://retroachievements.org';

const { SPREADSHEET_ID, GOOGLE_STORAGE_KEY, GOOGLE_SHEETS_KEY } = process.env;

const storageServiceAccount: object = JSON.parse(GOOGLE_STORAGE_KEY);
const storage = new Storage({credentials: storageServiceAccount});

const sheetServiceAccount: object = JSON.parse(GOOGLE_SHEETS_KEY);
const sheetServiceAccountAuthenticated = new JWT ({
	email: (sheetServiceAccount as any).client_email,
	key: (sheetServiceAccount as any).private_key,
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
const upload: multer.Multer = multer({ storage: multerStorage });

const MAL_API_URL: string = "https://api.myanimelist.net/v2/";
const MAL_ACCESS_TOKEN: string = process.env.MAL_ACCESS_TOKEN;

app.use(cors(corsHeaders), express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
ejs.delimiter = 'ç'
app.all("/", (req: express.Request, res: express.Response) => {
	res.render('server', {typeOfEndpoints});
});

app.get("/version/", async (req: express.Request, res: express.Response) => {
	const serverPath: string = path.join(__dirname, 'package.json');
	const serverPckg: string = fs.readFileSync(serverPath, 'utf-8');
	const serverVersion: string = serverPckg.match(/\"version\"\: \"[\d\.]+\"\,/)[0].match(/[\d\.]+/)[0];

	const pagePath: string = path.join(__dirname.replace(path.basename(__dirname), ''), 'package.json');
	const pagePckg: string = fs.readFileSync(pagePath, 'utf-8');
	const pageVersion: string = pagePckg.match(/\"version\"\: \"[\d\.]+\"\,/)[0].match(/[\d\.]+/)[0];

	res.status(200).json({page: pageVersion, server: serverVersion});
});

app.get("/myanimelist/:type", async (req: express.Request, res: express.Response) => {
	const { type } = req.params;
	let { username, offset } = req.query;

	if (username === undefined) res.status(400).json({ message: `Error: There should be an username.` });

	async function fetchMyAnimeList (type: string, username: string, offset: number | string, res: express.Response): Promise<MyTypes.AnimeList | MyTypes.MangaList> {
		if (type !== 'animelist' && type !== 'mangalist') res.status(400).json({ message: `Couldn't fetch data from type "${type}".\n Possible types are "animelist" and "mangalist".` });
		
		const response: Response = await fetch(`${MAL_API_URL}users/${username}/${type}?limit=100&sort=list_updated_at&offset=${offset}&fields=list_status,genres,num_episodes,num_chapters,nsfw,rank`, {
			headers: {
				"X-MAL-CLIENT-ID": MAL_ACCESS_TOKEN,
			},
		});

		if (!response.ok) res.status(response.status).json({ message: `Couldn't fetch ${MAL_API_URL}.` })

		let data: MyTypes.AnimeList | MyTypes.MangaList;

		if (type === 'animelist') {
			data = await response.json() as MyTypes.AnimeList;
		} else if (type === 'mangalist') {
			data = await response.json() as MyTypes.MangaList;
		};

		return data;
	};

	try {
		if (!offset) offset = '0';

		const data = await fetchMyAnimeList(type as string, username as string, offset as string, res);

		res.status(200).json(data);
	} catch (err) {
		res.status(500).json({ message: err.message });
	};
});

app.get("/contents(/:update)?", async (req: express.Request, res: express.Response) => {
	const { update } = req.params
	
	if (update) {
		if (update !== 'update') res.status(400).json({message: 'Update should be named "update" only.'});
	};

	await workbook.loadInfo();
	
	const jsonToSend: Partial<MyTypes.PageContent> = {updated: false};

	async function loadContent (sheet: GoogleSpreadsheetWorksheet): Promise<void> {
		const rows: Array<GoogleSpreadsheetRow> = await sheet.getRows();
		const headers: Array<Array<string>> = [sheet.headerValues];
		const rowsData: Array<Array<string>> = rows.map((row, i) => row.toObject()).map((obj) => Object.keys(obj).map((key) => obj[key]));
		const data: Array<Array<string|boolean|number|Date>> = headers.concat(rowsData);

		for (let i = 1; i < data.length; i++) {
			for (let j = 0; j < data[i].length; j++) {
				if (data[i][j]) data[i][j] = CustomFunctions.getValueToProperType(data[i][j] as string);
			};
		};

		jsonToSend[sheet.title] = CustomFunctions.csvToJson(data)['data'];
	};

	try {
		if (update) {
			for (const worksheet of workbook.sheetsByIndex) {
				await worksheet.loadHeaderRow();
			};

			jsonToSend.updated = true;

			console.log()
		};

		for (const worksheet of workbook.sheetsByIndex) {
			await loadContent(worksheet);
		};
	} catch (err) {
		res.status(err.status).json({message: err.message});
	};

	res.status(200).json(jsonToSend);
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

	const formattedAwards: Array<MyTypes.RetroAchievementsFormattedAward> = [];
	const consoles: any = [];

	async function getAndFormatAwards (): Promise<void> {
		let json: MyTypes.RetroAchievementsAwardsResponse = await (ra as any).getUserAwards(raAuthorization, userObject);

		for (const award of json.visibleUserAwards) {
			if (award.awardType === 'Mastery/Completion') {
				if (award.awardDataExtra === 1) {
					award.awardType = 'Mastery';
				} else if (award.awardDataExtra === 0) {
					award.awardType = 'Completion';
				};
			};

			award.awardType = CustomFunctions.vlookup(award.awardType, translations, translations[0].indexOf(language) + 1);
		};

		json.visibleUserAwards = json.visibleUserAwards.sort((a, b) => {
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
			} else {
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

	const output: MyTypes.RetroAchievementsOutput = {
		awards: formattedAwards,
		consoles: consoles[0],
	}

	res.status(200).json(output);
});

app.post("/shortcuts/", upload.single('file'), async (req: express.Request<{}, {}, MyTypes.NewShortcutData>, res: express.Response, next: express.NextFunction): Promise<void> => {
	['title', 'url', 'folder'].forEach((key) => {
		if (!req.body[key]) next();
	});

	const newShortcutId: string = CustomFunctions.normalize(req.body.title);
	
	async function uploadImage (): Promise<void> {
		const fileExtension: string = req.file!.filename.split('.').pop();
		const outputPath: string = `temp/${newShortcutId}.webp`;

		async function convertImage (): Promise<void> {
			return new Promise((resolve, reject) => {
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
						resolve();
					})
					.on('error', (err) => {
						res.json({message: `ffmpeg: ${err.message}`});
						return reject(new Error(err.message));
					})
					.run();
			});
		};

		await convertImage();

		const folderPath: string = 'icons/dynamic/';
		const bucket = storage.bucket('statisticshock_github_io_public');
		
		console.log(`Trying to upload file: ${outputPath.split('/').pop()}`);
		await bucket.upload(outputPath, { destination: outputPath.replace('temp/', folderPath)});
		console.log(`Successfully uploaded: ${outputPath.split('/').pop()}`);

		if (bucket.file(outputPath.replace('temp/', folderPath)).exists()) {
			console.log(`File uploaded: ${outputPath.replace('temp/', folderPath)}`);
		} else {
			console.log("File didn't upload");
			res.status(500).json({ message: "File didn't upload" });
		};

		await unlink(req.file.path);
		await unlink(outputPath);
	};

	async function getDataToReturn (): Promise<MyTypes.UploadShortcutResponse> {
		try {
			const newImgPath: string = `https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/${newShortcutId}.webp`;

			await uploadImage();

			return { newImgPath: newImgPath };
		} catch (err) {
			res.status(500).json({ message: err.message });
		};
	};

	const requestResponseData = await getDataToReturn() as MyTypes.UploadShortcutResponse;
	res.status(201).json(requestResponseData);
}, async (req: express.Request, res: express.Response) => {res.status(400).json({message: 'Wrong upload.'})});

app.put("/shortcuts/", async (req: express.Request<{}, {}, MyTypes.ShortcutsUpdateData>, res: express.Response, next: express.NextFunction): Promise<void> => {
	async function deleteOldImages (data: MyTypes.PageContent): Promise<void> {
		if (!data) return;
		else if (!data.shortcuts) return;
		else if (!(data.shortcuts.length > 0)) return;
		else {
			const folderPrefix: string = 'icons/dynamic/';
			const bucket: Bucket = storage.bucket('statisticshock_github_io_public');
			const [files]: GetFilesResponse = await bucket.getFiles({ prefix: folderPrefix });
			
			const filenamesToKeep: Array<string> = [];
			
			for (const section of data.shortcuts) {
				for (const shortcut of section.children) {
					filenamesToKeep.push(shortcut.img.split(folderPrefix).pop());
				};
			};

			for (const file of files) {
				const fileExtension: string =  file.name.split('.').pop();
				if (fileExtension !== 'webp') continue;
				if (!(file.name in filenamesToKeep)) {
					// await file.delete();
					console.log(`deleted ${file.name}`);
				};
			};
		};
	};
	
	async function updateContentsJson (): Promise<void> {
		const bucket = storage.bucket('statisticshock_github_io');
		const file = bucket.file(`contents.json`);

		let json: MyTypes.PageContent = await JSON.parse((await file.download()).toString());
		
		json.shortcuts = req.body.shortcuts;

		await file.save(JSON.stringify(json, null, 2));
		await deleteOldImages(json);
	};

	async function getDataToReturn (): Promise<MyTypes.PageContent> {
		try {
			const bucket = storage.bucket('statisticshock_github_io');
			const file = bucket.file(`contents.json`);

			await updateContentsJson();

			await CustomFunctions.sleep(1500);

			let json: MyTypes.PageContent = await JSON.parse((await file.download()).toString());

			return json;
		} catch (err) {
			next();
		};
	};

	const requestResponseData = await getDataToReturn() as MyTypes.PageContent;
	res.status(201).json(requestResponseData);
}, async (req: express.Request, res: express.Response) => {res.status(400).json({message: 'Update failed.'})});

app.delete("/shortcuts/", async (req: express.Request, res: express.Response) => {});

app.listen(PORT, () => console.log(`[${Intl.DateTimeFormat('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date())}] Server running...`));