import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
const filePath = '../images/pageImages/';
let filesToExclude = [];
const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const execute = promisify(exec);
async function createBatFile() {
    const files = await readdir(filePath);
    let batStringToConvertToWebp = '';
    for (const file of files) {
        const fileExtension = file.split('.').pop();
        const fullFilePath = filePath + file;
        const outputFileName = file.replaceAll(`.${fileExtension}`, '.webp').replaceAll(' ', '_');
        if (fileExtension !== 'webp') {
            filesToExclude.push(fullFilePath);
            if (fileExtension === 'png') {
                batStringToConvertToWebp += `ffmpeg -i "${fullFilePath}" -y -pix_fmt rgba -lossless 1 "${filePath}${outputFileName}"\n`;
            }
            else if (['jpg', 'jpeg'].includes(fileExtension)) {
                batStringToConvertToWebp += `ffmpeg -i "${fullFilePath}" -y -lossless 1 "${filePath}${outputFileName}"\n`;
            }
            else if (fileExtension === 'gif') {
                batStringToConvertToWebp += `ffmpeg -f gif -i "${fullFilePath}" -y -vcodec libwebp -loop 0 -pix_fmt yuva420p -lossless 1 "${filePath}${outputFileName}"\n`;
            }
            ;
        }
        ;
    }
    ;
    await writeFile(`convert.bat`, batStringToConvertToWebp);
}
;
async function runBatFile() {
    await execute(`call convert.bat`);
}
async function deleteFiles() {
    await unlink(`convert.bat`);
    for (const file of filesToExclude) {
        await unlink(file);
    }
}
;
await createBatFile();
await runBatFile();
await deleteFiles();
