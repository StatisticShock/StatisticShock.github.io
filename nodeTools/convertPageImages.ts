import * as fs from 'fs';
import { imageSize as sizeOf} from 'image-size';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Certificate } from 'crypto';

const filePath: string = '../images/pageImages/';
let filesToExclude: Array<string> = [];

const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const execute = promisify(exec);

async function createBatFile () {
    const files: Array<string> = await readdir(filePath);
    let batStringToConvertToWebp: string = '';

    for (const file of files) {
        const fileExtension: string = file.split('.').pop();
        const fullFilePath: string = filePath + file;
        const outputFileName: string = file.replaceAll(`.${fileExtension}`, '.webp').replaceAll(' ','_');

        if (fileExtension !== 'webp') {
            filesToExclude.push(fullFilePath);

            if (fileExtension === 'png') {
                batStringToConvertToWebp += `ffmpeg -i "${fullFilePath}" -y -pix_fmt rgba -lossless 1 "${filePath}${outputFileName}"\n`
            } else if (['jpg', 'jpeg'].includes(fileExtension)) {
                batStringToConvertToWebp += `ffmpeg -i "${fullFilePath}" -y -lossless 1 "${filePath}${outputFileName}"\n`
            } else if (fileExtension === 'gif') {
                batStringToConvertToWebp += `ffmpeg -f gif -i "${fullFilePath}" -y -vcodec libwebp -loop 0 -pix_fmt yuva420p -lossless 1 "${filePath}${outputFileName}"\n`
            };
        };
    };

    await writeFile(`convert.bat`, batStringToConvertToWebp);
};

async function runBatFile () {
    await execute(`call convert.bat`);
}

async function deleteFiles () {
    await unlink(`convert.bat`);
    for (const file of filesToExclude) {
        await unlink(file);
    }
};

await createBatFile();
await runBatFile();
await deleteFiles();
