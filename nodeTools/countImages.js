import * as fs from 'fs';
import { imageSize as sizeOf } from 'image-size';
import { exec } from 'child_process';
import { promisify } from 'util';
const filePath = '../images/headers/';
let filesToExclude = [];
async function writeJson() {
    const readdir = promisify(fs.readdir);
    const writeFile = promisify(fs.writeFile);
    const unlink = promisify(fs.unlink);
    const files = await readdir(filePath);
    let batStringToConvertToWebp = '';
    let headers = [];
    for (const file of files) {
        if (file === '_headers.json')
            continue;
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
        const dimensions = sizeOf(fullFilePath);
        const aspectRatio = dimensions.width / dimensions.height;
        if (aspectRatio >= 4.5) {
            headers.push(outputFileName);
        }
        else {
            try {
                await unlink(fullFilePath);
            }
            catch (err) {
                console.error(`Failed to delete ${file}:`);
            }
        }
        ;
    }
    ;
    await writeFile('convert.bat', batStringToConvertToWebp);
    await writeFile(`${filePath}_headers.json`, JSON.stringify(headers, null, 2));
}
;
async function runBatFile() {
    const execute = promisify(exec);
    await execute(`call convert.bat`);
}
;
async function removeFiles() {
    const unlink = promisify(fs.unlink);
    await unlink(`convert.bat`);
    for (const file of filesToExclude) {
        await unlink(file);
    }
}
;
await writeJson();
await runBatFile();
await removeFiles();
