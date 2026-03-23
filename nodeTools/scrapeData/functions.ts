import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import util from 'util';
import { pipeline } from 'stream';

export default class CustomFunctions {
	static log (message: string | number, isRunByBot: boolean = false) {
		const dirName = 'logs'
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const logDir = path.resolve(__dirname, dirName);
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir);
		};
		const startDate: Date = new Date(new Date().getTime() - (3 * 60 * 60 * 1000));
		const date = startDate.toISOString().split('T')[0];
	
		const logFile = fs.createWriteStream(path.join(logDir, `debug_${date}.log`), { flags: 'a' });
		
		console.log(message);
		logFile.write(`[${Intl.DateTimeFormat('pt-BR', {hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(new Date())}] ${message}\n`);
	};

	static leftPad (string: string, totalCharacters: number): string {
		if (string.length >= totalCharacters) return string;
		else {
			let spaces: string = '';
			for (let i = 1; i <= (totalCharacters - string.length); i++) {
				spaces += ' ';
			};
			return spaces + string;
		};
	};

	static async sleep (ms: number): Promise<void> {
		return new Promise(res => setTimeout(res, ms));
	};

	static execute = util.promisify(exec);

	static unlink = util.promisify(fs.unlink);

	static streamPipeline = util.promisify(pipeline);
}