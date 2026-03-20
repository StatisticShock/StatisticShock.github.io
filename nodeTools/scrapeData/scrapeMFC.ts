import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { MFC } from '../../util/types.js';
import puppeteer from 'puppeteer';
import CustomFunctions from './functions.js';
import { constants } from './constants.js';

export default class ScrapeFunctions {
	static async readMFCItem ({ elementId, typeOfFigure, browser }: { elementId: string, typeOfFigure: 'Owned'|'Ordered'|'Wished', browser: puppeteer.Browser }): Promise<MFC|null> {
		try {
			let id: string = elementId;
			let href: string = `${constants.mfcLink}/item/${elementId}`;
			let img: string = `https://storage.googleapis.com/statisticshock_github_io_public/mfc/main_images/${elementId}.webp`;
			let img_sufix: string;
			let icon: string = `https://storage.googleapis.com/statisticshock_github_io_public/mfc/icons/${elementId}.webp`;
			let character: string;
			let character_jap: string;
			let source: string;
			let source_jap: string;
			let classification: string;
			let classification_jap: string;
			let category: 'Prepainted'|'Action/Dolls'|'Trading';
			let type: 'Owned'|'Ordered'|'Wished' = typeOfFigure;
			let title: string;
			let tags: string;

			const page = await browser.newPage();
			await page.setUserAgent({
				userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
			});
			await page.evaluateOnNewDocument(() => {
				Object.defineProperty(navigator, 'webdriver', { get: () => false });
			});
			await page.goto(`${constants.mfcLink}/item/${elementId}`, {waitUntil: 'domcontentloaded', timeout: 0});
			const figureHtml = await page.content();
			await page.close();
			
			const $ = cheerio.load(figureHtml);

			if ($('h1.title').text() !== '') {
				CustomFunctions.log('Fetching ' + $('h1.title').text());
			} else {
				CustomFunctions.log(figureHtml);
			};

			title = $('h1.title').text();

			img_sufix = $('a.main:has(img) img').attr('src').split('/').pop().replace('.jpg', '');

			const dataFields = $('.object-wrapper .data-wrapper .data-field');
			for (const element of dataFields.toArray()) {
				if ($(element).find('.data-label').text().includes('Categoria')) {
					category = $(element).find('.data-value').text() as 'Prepainted'|'Action/Dolls'|'Trading';
				};
				if ($(element).find('.data-label').text().includes('Classificaç')) {
					classification = $(element).find('.data-value a span').map((i, el) => $(el).text()).toArray().join(', ') || '';
					classification_jap = $(element).find('.data-value a span').map((i, el) => $(el).attr('switch')).toArray().join(', ') || '';
				};
				if ($(element).find('.data-label').text().includes('Personag') || $(element).find('.data-label').text().includes('Título')) {
					character = $(element).find('.data-value').text();
					character_jap = $(element).find('.data-value a span').map((i, item) => $(item).attr('switch')).get().join(', ');
				};
				if ($(element).find('.data-label').text().includes('Origem')) {
					source = $(element).find('.data-value span[switch]').text();
					source_jap = $(element).find('.data-value span[switch]').attr('switch');
				};
			};

			if ($('.object-tags').find('.object-tag')) {
				tags = $('.object-tags').text().split('\?').join(' \• ').slice(0, -3);
			};

			const itemData: MFC = {
				id: id,
				href: href,
				icon: icon,
				img: img,
				img_sufix: img_sufix,
				character: character, 
				character_jap: character_jap,
				source_jap: source_jap,
				source: source,
				classification: classification,
				classification_jap: classification_jap,
				category: category,
				tags: tags,
				type: type,
				title: title,
			}

			return itemData;
		} catch (err) {
			CustomFunctions.log(`Couldn't fetch figure from id ${elementId}`);
			return null;
		};
	};

	static async scrapeImage({ sufix, type }: { sufix: string, type: 'icon'|'main' }): Promise<string|null> {
		async function downloadImageFromMfcSufix (size: 0|1|2, imgPath: string = `./temp/${sufix.split("-")[0]}.jpg`,  _sufix: string = sufix): Promise<string|null> {
			const response = await fetch(`${constants.staticMfcLink}/${size}/${_sufix}.jpg`);

			if (!response.ok) {
				return null;
			} else {
				await CustomFunctions.streamPipeline(response.body as any, fs.createWriteStream(imgPath));
				return imgPath;
			};
		};

		async function downloadAndConvertToWebp (size: 0|1|2): Promise<string|null> {
			const imgPath: string = await downloadImageFromMfcSufix(size);
			if (imgPath === null) return null;

			try {
				const finalPath: string = imgPath.replace('.jpg','.webp');
				await CustomFunctions.execute(`ffmpeg -i "${imgPath}" -y -lossless 1 "${finalPath}"`);
				await CustomFunctions.unlink(imgPath);
				return finalPath;
			} catch (e) {
				CustomFunctions.log(e.code);
				CustomFunctions.log(e.message);
				return null;
			};
		};

		if (type === 'main') {
			for (const i of [2, 1] as Array<1|2>) {
				const imgPath = await downloadAndConvertToWebp(i);
				if (imgPath === null) continue;
				return imgPath;
			};
		} else if (type === 'icon') {
			return await downloadAndConvertToWebp(0);
		};
	};
};