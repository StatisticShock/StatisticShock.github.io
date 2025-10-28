import * as Google from '@google-cloud/storage';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { pipeline } from 'stream';
import util from 'util';
import * as pathImport from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { MFC } from '../../util/types.js';

dotenv.config({path: pathImport.resolve(import.meta.dirname + '/.env')});

export class GoogleClass {
	static serviceAccount = JSON.parse(process.env.GOOGLE_JSON_KEY);
	static storage: Google.Storage = new Google.Storage({ credentials: GoogleClass.serviceAccount });
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

export const links: Array<['Owned'|'Ordered'|'Wished', string]> = [
	['Owned','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
	['Ordered','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
	['Wished','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=0&categoryId=-1&output=2&sort=category&order=asc&_tb=user'],
];

const server: string = 'http://localhost:3000/';

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
				await downloadImageFromUrl(imgLink, downloadedFilePath)
					.then(async () => {
						console.log(`Converting "${downloadedFileName}" to WEBP...`);
						await convertToWebp(downloadedFilePath).then(async () => {

							console.log(`Trying to upload file "${convertedFileName}"`);
							await GoogleClass.publicBucket.upload(convertedFilePath, {destination: iconImageFolder + convertedFileName}).then(() => log(`Successfully uploaded ${'"' + leftPad(convertedFileName, 9) + '"'} to bucket "${GoogleClass.publicBucket.name}" in the folder "${iconImageFolder}".`));
							await Promise.all([unlink(convertedFilePath), unlink(downloadedFilePath)]);
						});
					})
					.catch((err) => log(`FAILED: ${err.message}`));
			};

			if (existingMainImages.indexOf(convertedFileName) !== -1) {
				console.log(`${convertedFileName} already exists in the folder ${mainImageFolder}.`)
			} else {
				let routeOfImage: string = '/2/';
				let routeOfIcon: string = '/0/';
				const response: Response = await fetch(imgLink.replace(routeOfIcon, routeOfImage));
				routeOfImage = response.status === 404 ? '/1/' : '/2/';

				console.log(`Trying to download file "${downloadedFilePath}"...`);
				await downloadImageFromUrl(imgLink.replace(routeOfIcon, routeOfImage), downloadedFilePath)
					.then(async () => {
						console.log(`Converting "${downloadedFileName}" to WEBP...`);
						await convertToWebp(downloadedFilePath).then(async () => {

							console.log(`Trying to upload file "${convertedFileName}"`);
							await GoogleClass.publicBucket.upload(convertedFilePath, {destination: mainImageFolder + convertedFileName}).then(() => log(`Successfully uploaded ${'"' + leftPad(convertedFileName, 9) + '"'} to bucket "${GoogleClass.publicBucket.name}" in the folder "${mainImageFolder}".`));
							await Promise.all([unlink(convertedFilePath), unlink(downloadedFilePath)]);
						});
					})
					.catch((err) => log(`FAILED: ${err.message}`));
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

		for (const fileToDelete of imageFilesToDelete) {
			log(`Deleting file ${fileToDelete.name}...`);
			await fileToDelete.delete();
		};
	};

	await downloadNewImages();
	await deleteOldImages();
};

export class ScrapeFunctions {
	static async readMFCItem (elementId: string, typeOfFigure: 'Owned'|'Ordered'|'Wished'): Promise<MFC> {
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
		let img: string = `https://storage.googleapis.com/statisticshock_github_io_public/mfc/main_images/${elementId}.webp`;
		let icon: string = `https://storage.googleapis.com/statisticshock_github_io_public/mfc/icons/${elementId}.webp`;
		let character: string;
		let characterJap: string;
		let source: string;
		let sourceJap: string;
		let classification: string;
		let category: 'Prepainted'|'Action/Dolls'|'Trading';
		let type: 'Owned'|'Ordered'|'Wished' = typeOfFigure;
		let title: string = $('h1.title').text();
		let tags: string;

		const figureResponse = await fetch(`${mfcLink}/item/${elementId}`);
		const figureHtml = await figureResponse.text();
		const $$ = cheerio.load(figureHtml);

		const dataFields = $$('.object-wrapper .data-wrapper .data-field');
		for (const element of dataFields.toArray()) {
			if ($$(element).find('.data-label').text().includes('Categoria')) {
				category = $$(element).find('.data-value').text() as 'Prepainted'|'Action/Dolls'|'Trading';
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
				source = $$(element).find('.data-value span[switch]').text();
				sourceJap = $$(element).find('.data-value span[switch]').attr('switch');
			};
		};

		if ($$('.object-tags').find('.object-tag')) {
			tags = $$('.object-tags').text().split('\?').join(' \• ');
		};

		const itemData: MFC = {
			id: id,
			href: href,
			icon: icon,
			img: img,
			character: character, 
			characterJap: characterJap,
			sourceJap: sourceJap,
			source: source,
			classification: classification, 
			category: category,
			tags: tags,
			type: type,
			title: title,
		}

		return itemData;
	};
};

async function fetchData(addingData?: boolean): Promise<void> {
	console.log('Starting to fetch items...')
	const json: Array<MFC> = (await fetch(server + 'contents/mfc/').then((res) => res.json()))['mfc'];
	const newFiguresJson: Array<MFC> = [];
	const figuresToUpdateJson: Array<[MFC, MFC]> = [];
	const figuresToDeleteJson: Array<MFC> = [];
	const figuresIdsToKeep: string[] = [];

	if (json instanceof Array) {
		log('JSON file sucessfully loaded');
	} else {
		log("Couldn't fetch JSON file.");
		return;
	};

	let changes: Array<string> = [];

	if (addingData) {
		const maxKeys: number = json.reduce((prev: number, curr): number => {
			if (Number(prev) < Object.keys(curr).filter((key) => key !== 'tags').length) prev = Object.keys(curr).filter((key) => key !== 'tags').length;
			return prev;
		}, 0);

		const itemsToUpdate: Array<MFC> = json.filter((figure) => Object.keys(figure).filter((key) => key !== 'tags').length < maxKeys);

		if (itemsToUpdate.length > 0) {
			for (const item of itemsToUpdate) {
				const index = json.indexOf(item);

				let type: 'Owned'|'Ordered'|'Wished'|undefined = undefined;

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
					changes.push('item data changed: ' + item.id);
					figuresToUpdateJson.push([item, itemData]);
					await sleep(900);
				}
			};
		};
	};

	for (const [typeOfFigure, link] of links) {
		const dateFormat: Intl.DateTimeFormat = Intl.DateTimeFormat('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
		console.log(`\n[${dateFormat.format(new Date())}] Trying to access the url "${link}"...`);
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
					changes.push('item type changed: ' + elementId);
					const oldFigure = new Object(json[index]) as MFC;
					const newFigure = new Object(json[index]) as MFC;
					newFigure.type = typeOfFigure;
					figuresToUpdateJson.push([oldFigure, newFigure]);
				};
			};

			if (json.some((mfcObj) => mfcObj.id === elementId)) {
				continue;
			} else {
				changes.push('new item: ' + elementId);

				const itemData: MFC = await ScrapeFunctions.readMFCItem(elementId, typeOfFigure)
					.then((res) => {
						console.log(`[${Intl.DateTimeFormat('pt-BR', {hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date())}] Trying to access figure from ID ${elementId}`);
						return res;
					});

				newFiguresJson.push(itemData);
			};
		};

		await sleep(1000);
	};

	json.filter((figure) => !(figuresIdsToKeep.includes(figure.id))).forEach((figure) => figuresToDeleteJson.push(figure));

	if (changes.length > 0) {
		log(`Changes:\n${changes.reduce((prev: string, curr: string): string => {return prev + '• ' + curr + '\n'}, '')}`);

		type Method = {
			method: 'POST'|'DELETE'|'PUT',
			object: Array<object>,
			comment: string,
		}
		const methods: Array<Method> = [
			{
				method: 'POST',
				object: newFiguresJson,
				comment: `${newFiguresJson.length} additions in "mfc" were made.`,
			},
			{
				method: 'DELETE',
				object: figuresToDeleteJson,
				comment: `${figuresToDeleteJson.length} deletions in "mfc" were made.`,
			},
			{
				method: 'PUT',
				object: figuresToUpdateJson,
				comment: `${figuresToUpdateJson.length} updates in "mfc" were made.`,
			}
		];
		
		methods.forEach(async (method) => {
			let logThisMethod: boolean = true
			const maxItemsPerRequest = 10;

			for (let j = 0; j < Math.ceil(method.object.length / maxItemsPerRequest); j++) {
				const chunk = method.object.slice(j * maxItemsPerRequest, (j + 1) * maxItemsPerRequest);
				await fetch(`${server}mfc/`, {
					method: method.method,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(chunk),
				}).catch((err) => {
					log(`Error: ${err.message}`)
					logThisMethod = false
				});
			};

			await sleep(7500);

			if (logThisMethod) log(method.comment);
		})
	} else {
		log('No changes in "mfc" were made.')
	}
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
   await main(true, true);
};