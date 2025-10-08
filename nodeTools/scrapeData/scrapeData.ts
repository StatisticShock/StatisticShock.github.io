import * as Google from '@google-cloud/storage';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { pipeline } from 'stream';
import util from 'util';
import * as pathImport from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { MFC } from '../../util/types.js'

dotenv.config({path: pathImport.resolve(import.meta.dirname + '/.env')});

export class GoogleClass {
	static serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
	static storage: Google.Storage = new Google.Storage({ credentials: GoogleClass.serviceAccount });
	static bucket: Google.Bucket = GoogleClass.storage.bucket('statisticshock_github_io');
	static mfcJsonGoogle: Google.File = GoogleClass.bucket.file('mfc.json');
	static publicBucket: Google.Bucket = GoogleClass.storage.bucket('statisticshock_github_io_public');
};

const streamPipeline = util.promisify(pipeline);

let logIsRunByBot: boolean = false;
function log (message: string | number, isRunByBot?: boolean) {
	const isBot = isRunByBot ?? logIsRunByBot;

	const dirName = `logs${isBot ? '/bot' : ''}`;
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = pathImport.dirname(__filename);
	const logDir = pathImport.resolve(__dirname, dirName);
	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir);
	};
	const startDate: Date = new Date(new Date().getTime() - (3 * 60 * 60 * 1000));
	const date = startDate.toISOString().split('T')[0];

	const logFile = fs.createWriteStream(pathImport.join(logDir, isBot ? 'log.txt' : `debug_${date}.log`), { flags: 'a' });
	console.log(message);
	logFile.write(`[${Intl.DateTimeFormat('pt-BR', {hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(new Date())}] ${message}\n`);
};
function leftPad (string: string, totalCharacters: number): string {
	if (string.length >= totalCharacters) return string;
	else {
		let spaces: string = '';
		for (let i = 1; i <= (totalCharacters - string.length); i++) {
			spaces += ' ';
		};
		return spaces + string;
	};
};
const execute = util.promisify(exec);
const unlink = util.promisify(fs.unlink);

const mfcLink: string = 'https://pt.myfigurecollection.net';

async function sleep (ms: number): Promise<void> {
	return new Promise(res => setTimeout(res, ms));
};

export const links = [
	['Owned','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
	['Ordered','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
	['Wished','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
];

async function scrapeImages(): Promise<void> {
	let imgLinks: Array<Array<string>> = [];

	const mainImageFolder: string = 'mfc/main_images/';
	const iconImageFolder: string = 'mfc/icons/';

	async function downloadImageFromUrl (url: string, path: string): Promise<void> {
		const response = await fetch(url);

		if (!response.ok) log(`Failed to download: ${response.statusText}`);

		await streamPipeline(response.body as any, fs.createWriteStream(path));
	};

	async function convertToWebp (imgPath: string) {
		try {
			await execute(`ffmpeg -i "${imgPath}" -y -lossless 1 "${imgPath.replace('.jpg','.webp')}"`)
		} catch (e) {
			log(e.code);
			log(e.message);
		};
	};

	async function downloadNewImages (): Promise<void> {
		for (const [type, link] of links) {
			const response = await fetch(link);
			const html = await response.text();
			const $ = cheerio.load(html);

			$('.item-icon a img').each((i, el) => {
				const imgSrc = $(el).attr('src');
				if (imgSrc) imgLinks.push([imgSrc, imgSrc.split('/').pop().split('-')[0] + '.jpg']);
			});
		};

		const [existingImages] = await GoogleClass.publicBucket.getFiles({prefix: 'mfc'});
		const existingIconImages: Array<string> = [];
		const existingMainImages: Array<string> = [];

		for (const file of existingImages) {
			if (file.name.includes(mainImageFolder) && file.name.includes('.webp')) existingMainImages.push(file.name.replace(mainImageFolder, ''));
			else if (file.name.includes(iconImageFolder) && file.name.includes('.webp')) existingIconImages.push(file.name.replace(iconImageFolder, ''));
		};

		for (const [imgLink, downloadedFileName] of imgLinks) {
			const folderPath: string = process.env.TEMP_PATH;
			const convertedFileName: string = downloadedFileName.replace('jpg', 'webp');

			const downloadedFilePath: string = folderPath + downloadedFileName;
			const convertedFilePath: string = folderPath + convertedFileName;

			if (existingIconImages.indexOf(convertedFileName) !== -1) {
				console.log(`${convertedFileName} already exists in the folder ${iconImageFolder}.`)
			} else {
				console.log(`Trying to download file "${downloadedFileName}"...`);
				await downloadImageFromUrl(imgLink, downloadedFilePath).then(async () => {

					console.log(`Converting "${downloadedFileName}" to WEBP...`);
					await convertToWebp(downloadedFilePath).then(async () => {

						console.log(`Trying to upload file "${convertedFileName}"`);
						await GoogleClass.publicBucket.upload(convertedFilePath, {destination: iconImageFolder + convertedFileName}).then(() => log(`Successfully uploaded ${'"' + leftPad(convertedFileName, 9) + '"'} to bucket "${GoogleClass.publicBucket.name}" in the folder "${iconImageFolder}`));
						await Promise.all([unlink(convertedFilePath), unlink(downloadedFilePath)]);
					});
				}).catch((err) => log(`FAILED: ${err.message}`));
			};

			if (existingMainImages.indexOf(convertedFileName) !== -1) {
				console.log(`${convertedFileName} already exists in the folder ${mainImageFolder}.`)
			} else {
				let routeOfImage: string = '/2/';
				let routeOfIcon: string = '/0/';
				const response: Response = await fetch(imgLink.replace(routeOfIcon, routeOfImage));
				routeOfImage = response.status === 404 ? '/1/' : '/2/';

				console.log(`Trying to download file "${downloadedFilePath}"...`);
				await downloadImageFromUrl(imgLink.replace(routeOfIcon, routeOfImage), downloadedFilePath).then(async () => {

					console.log(`Converting "${downloadedFileName}" to WEBP...`);
					await convertToWebp(downloadedFilePath).then(async () => {

						console.log(`Trying to upload file "${convertedFileName}"`);
						await GoogleClass.publicBucket.upload(convertedFilePath, {destination: mainImageFolder + convertedFileName}).then(() => log(`Successfully uploaded ${'"' + leftPad(convertedFileName, 9) + '"'} to bucket "${GoogleClass.publicBucket.name}" in the folder "${mainImageFolder}".`));
						await Promise.all([unlink(convertedFilePath), unlink(downloadedFilePath)]);
					});
				}).catch((err) => log(`FAILED: ${err.message}`));
			};
		};
	};

	async function deleteOldImages (): Promise<void> {
		const imageFilesToKeep: Array<string> = imgLinks.map((linksArray) => linksArray[1].replace('.jpg', '.webp'));
		const [imageFiles] = await GoogleClass.publicBucket.getFiles({prefix: 'mfc'});
		const imageFilesToDelete = imageFiles.filter((x) => {
			const shouldKeep: boolean = imageFilesToKeep.includes((x.name.split('/').pop()));
			const isFolder: boolean = x.name.substring(x.name.length - 1) === '/';
			return !shouldKeep && !isFolder;
		});

		// fs.writeFileSync('values.txt', `imageFilesToKeep: ${JSON.stringify(imageFilesToKeep, null, 4)}\n\n\nimageFilesToDelete: ${JSON.stringify(imageFilesToDelete.map((file) => file.name), null, 4)}`);

		for (const fileToDelete of imageFilesToDelete) {
			log(`Deleting file ${fileToDelete.name}...`);
			await fileToDelete.delete();
		};
	};

	await downloadNewImages();
	await deleteOldImages();
};

export class ScrapeFunctions {
	static async readMFCItem (elementId: string, typeOfFigure: string): Promise<MFC> {
		let response = await fetch(`${mfcLink}/item/${elementId}`);
		
		if (!response.ok) {
			await sleep(10000);
			response = await fetch(`${mfcLink}/item/${elementId}`);
		}
		
		const html = await response.text();

		const $ = cheerio.load(html);

		log('Fetching ' + $('h1.title').text());
		
		let id: string = elementId;
		let href: string = `${mfcLink}/item/${elementId}`;
		let img: string = $('a.main img').attr('src').replaceAll(/https\:\/\/static\.myfigurecollection\.net\/upload\/items\/[0-2]\//g,'https://storage.googleapis.com/statisticshock_github_io_public/mfc/').split('-')[0] + '.webp';
		let character: string;
		let characterJap: string;
		let origin: string;
		let classification: string;
		let category: string;
		let type: string = typeOfFigure;
		let title: string = $('h1.title').text();

		const figureResponse = await fetch(`${mfcLink}/item/${elementId}`);
		const figureHtml = await figureResponse.text();
		const $$ = cheerio.load(figureHtml);

		const dataFields = $$('.object-wrapper .data-wrapper .data-field');
		for (const element of dataFields.toArray()) {
			if ($$(element).find('.data-label').text().includes('Categoria')) {
				category = $$(element).find('.data-value').text();
			};
			if ($$(element).find('.data-label').text().includes('Classificaç')) {
				if ($$(element).find('.data-value a span').attr('switch') == '') {
					classification = $$(element).find('.data-value a span').text()
				} else {
					classification = $$(element).find('.data-value a span').attr('switch');
				}
			};
			if ($$(element).find('.data-label').text().includes('Personag') || $$(element).find('.data-label').text().includes('Título')) {
				character = $$(element).find('.data-value').text();
				characterJap = $$(element).find('.data-value a span').map((i, item) => $$(item).attr('switch')).get().join(', ');
			};
			if ($$(element).find('.data-label').text().includes('Origem')) {
				origin = $$(element).find('.data-value span[switch]').attr('switch');
			};
		};

		const itemData: MFC = {
			id: id,
			href: href,
			icon: '',
			img: img,
			character: character, 
			characterJap: characterJap,
			sourceJap: origin,
			source: '',
			classification: classification, 
			category: category,
			type: type,
			title: title,
		}

		return itemData;
	};
};

async function fetchData(addingData?: boolean): Promise<void> {
	console.log('Starting to fetch items...')
	let json: Array<MFC> = JSON.parse((await GoogleClass.mfcJsonGoogle.download()).toString()).figures;
	if (json instanceof Array) {
		log('JSON file sucessfully loaded');
	} else {
		log("Couldn't fetch JSON file.");
		return;
	}
	let changes: boolean = false;
	let figuresIdsToKeep: string[] = [];

	if (addingData) {
		const itemsToUpdate: Array<MFC> = json.filter((obj) => Object.keys(obj).length < 10);

		if (itemsToUpdate.length > 0) {
			for (const item of itemsToUpdate) {
				const index = json.indexOf(item);

				let type: string | undefined = undefined;

				for (const [typeOfFigure, link] of links) {
					const response = await fetch(link);
					const html = await response.text();
					const $ = cheerio.load(html);

					const itemIcons = $('.item-icon');
					if (!type) {
						for (const el of itemIcons.toArray()) {
							const elementId: string = $(el).find('a').attr('href').replace('/item/','');
							if (elementId === item.id) type = typeOfFigure;
						};
					};

					await sleep(900);
				};

				const itemData: MFC = await ScrapeFunctions.readMFCItem(item.id, type);

				if (item !== itemData) {
					changes = true;
					json[index] = itemData;
					log(`Updated.`);
					log(`Type: ${itemData.type}`)
					await sleep(900);
				}
			};
		};

		if (changes) {
			GoogleClass.mfcJsonGoogle.save(JSON.stringify(json, null, 2));
			log('Changes in the file "mfc.json" were made.');
		}
	} else {
		for (const [typeOfFigure, link] of links) {
			const dateFormat: Intl.DateTimeFormat = Intl.DateTimeFormat('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
			console.log(`\n[${dateFormat.format(new Date())}] Trying to access the url ${link}...`);
			const response = await fetch(link);
			console.log(`[${dateFormat.format(new Date())}] Successfully loaded.`)
			const html = await response.text();
			const $ = cheerio.load(html);

			const itemIcons = $('.item-icon');
			
			for (const el of itemIcons.toArray()) {
				const elementId: string = $(el).find('a').attr('href').replace('/item/','');
				figuresIdsToKeep.push(elementId);

				await sleep(900);

				const index: number = json.findIndex((obj) => obj.id === elementId);
				
				if (index > 0) {
					if (json[index].type !== typeOfFigure) {
						changes = true;
						json[index].type = typeOfFigure;
					};
				};

				if (json.some((mfcObj) => mfcObj.id === elementId)) {
					continue;
				} else {
					changes = true;

					console.log(`[${Intl.DateTimeFormat('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date())}] Trying to access figure from ID ${elementId}`);
					const itemData: MFC = await ScrapeFunctions.readMFCItem(elementId, typeOfFigure);

					json.push(itemData);
				};
			};

			await sleep(1000);
		};

		let outputJson = json.filter((obj) => {
			return figuresIdsToKeep.includes(obj.id);
		});
		if (outputJson.length < json.length) {
			changes = true;
		}

		if (changes) {
			GoogleClass.mfcJsonGoogle.save(JSON.stringify({figures: outputJson}, null, 2));
			log('Changes in the file "mfc.json" were made.');
		} else {
			log('No changes in the file "mfc.json" were made.')
		}
	};
};

export async function main(addingData?: boolean, isRunByBot?: boolean): Promise<void> {
	logIsRunByBot = isRunByBot ?? false;
	
	if (isRunByBot) log('ESTA EXECUÇÃO FOI ATIVADA POR CLEYTON PELO TELEGRAM.\n\n');

	try {
		await fetchData(addingData);
		await scrapeImages();
	} catch (err) {
		log('Error in script: ' + err.message);
	} finally {
		console.log('Closing conections...');
		setTimeout(() => process.exit(0), 1500);
	};
};

export async function fillData (): Promise<void> {
   await main(true);
};