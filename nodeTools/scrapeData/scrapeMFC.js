import * as cheerio from 'cheerio';
import * as fs from 'fs';
import CustomFunctions from './functions.js';
import { constants } from './constants.js';
export default class ScrapeFunctions {
    static async readMFCItem({ elementId, typeOfFigure, browser }) {
        try {
            let id = elementId;
            let href = `${constants.mfcLink}/item/${elementId}`;
            let img = `https://storage.googleapis.com/statisticshock_github_io_public/mfc/main_images/${elementId}.webp`;
            let img_sufix;
            let icon = `https://storage.googleapis.com/statisticshock_github_io_public/mfc/icons/${elementId}.webp`;
            let character;
            let character_jap;
            let source;
            let source_jap;
            let classification;
            let classification_jap;
            let category;
            let type = typeOfFigure;
            let title;
            let tags;
            const page = await browser.newPage();
            await page.setUserAgent({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
            });
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', { get: () => false });
            });
            await page.goto(`${constants.mfcLink}/item/${elementId}`, { waitUntil: 'domcontentloaded', timeout: 0 });
            const figureHtml = await page.content();
            await page.close();
            const $ = cheerio.load(figureHtml);
            if ($('h1.title').text() !== '') {
                CustomFunctions.log('Fetching ' + $('h1.title').text());
            }
            else {
                CustomFunctions.log(figureHtml);
            }
            ;
            title = $('h1.title').text();
            img_sufix = $('a.main:has(img) img').attr('src').split('/').pop().replace('.jpg', '');
            const dataFields = $('.object-wrapper .data-wrapper .data-field');
            for (const element of dataFields.toArray()) {
                if ($(element).find('.data-label').text().includes('Categoria')) {
                    category = $(element).find('.data-value').text();
                }
                ;
                if ($(element).find('.data-label').text().includes('Classificaç')) {
                    classification = $(element).find('.data-value a span').map((i, el) => $(el).text()).toArray().join(', ') || '';
                    classification_jap = $(element).find('.data-value a span').map((i, el) => $(el).attr('switch')).toArray().join(', ') || '';
                }
                ;
                if ($(element).find('.data-label').text().includes('Personag') || $(element).find('.data-label').text().includes('Título')) {
                    character = $(element).find('.data-value').text();
                    character_jap = $(element).find('.data-value a span').map((i, item) => $(item).attr('switch')).get().join(', ');
                }
                ;
                if ($(element).find('.data-label').text().includes('Origem')) {
                    source = $(element).find('.data-value span[switch]').text();
                    source_jap = $(element).find('.data-value span[switch]').attr('switch');
                }
                ;
            }
            ;
            if ($('.object-tags').find('.object-tag')) {
                tags = $('.object-tags').text().split('\?').join(' \• ').slice(0, -3);
            }
            ;
            const itemData = {
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
            };
            return itemData;
        }
        catch (err) {
            CustomFunctions.log(`Couldn't fetch figure from id ${elementId}`);
            return null;
        }
        ;
    }
    ;
    static async scrapeImage({ sufix, type }) {
        async function downloadImageFromMfcSufix(size, imgPath = `./temp/${sufix.split("-")[0]}.jpg`, _sufix = sufix) {
            const response = await fetch(`${constants.staticMfcLink}/${size}/${_sufix}.jpg`);
            if (!response.ok) {
                return null;
            }
            else {
                await CustomFunctions.streamPipeline(response.body, fs.createWriteStream(imgPath));
                return imgPath;
            }
            ;
        }
        ;
        async function downloadAndConvertToWebp(size) {
            const imgPath = await downloadImageFromMfcSufix(size);
            if (imgPath === null)
                return null;
            try {
                const finalPath = imgPath.replace('.jpg', '.webp');
                await CustomFunctions.execute(`ffmpeg -i "${imgPath}" -y -lossless 1 "${finalPath}"`);
                await CustomFunctions.unlink(imgPath);
                return finalPath;
            }
            catch (e) {
                CustomFunctions.log(e.code);
                CustomFunctions.log(e.message);
                return null;
            }
            ;
        }
        ;
        if (type === 'main') {
            for (const i of [2, 1]) {
                const imgPath = await downloadAndConvertToWebp(i);
                if (imgPath === null)
                    continue;
                return imgPath;
            }
            ;
        }
        else if (type === 'icon') {
            return await downloadAndConvertToWebp(0);
        }
        ;
    }
    ;
}
;
