export default class CustomFunctions {
	static shuffle (arr: Array<any>): Array<any> { //Intended to shuffle any array
		let j, x, index;
		for (index = arr.length - 1; index > 0; index--) {
			j = Math.floor(Math.random() * (index + 1));
			x = arr[index];
			arr[index] = arr[j];
			arr[j] = x;
		};
		return arr;
	};

	static revertArray (arr: Array<any>): Array<any> {
		const newArr: Array<any> = [];
		for (let i = arr.length - 1; i >= 0; i--) {
			newArr.push(arr[i]);
		};
		return newArr;
	}

	static isParent (element: HTMLElement, parent: HTMLElement): boolean {
		return parent.contains(element);
	};

	static randomIntFromInterval (min: number, max: number) { // min and max included
		if (min > max) {
			console.error('Tá chapado?');
			return -1;
		} else if (min == max) {
			return max;
		} else return Math.floor(Math.random() * (max - min + 1) + min);
	};

	static doesItCollide (oneElement: HTMLElement, twoElement: HTMLElement): boolean {
		const oneRect: DOMRect = oneElement.getBoundingClientRect();
		const twoRect: DOMRect = twoElement.getBoundingClientRect();

		if (oneRect.x + oneRect.width > twoRect.x &&
			twoRect.x + twoRect.width > oneRect.x &&
			oneRect.y + oneRect.height > twoRect.y &&
			twoRect.y + twoRect.height > oneRect.y) return true
		else return false;
	};

	static async sleep (ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	static normalize (string: string): string {
		return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'').replaceAll(' ', '-').toLowerCase().trim();
	};
	
	static vlookup (key: any, array: Array<Array<any>>, end: number, start?: number): any {
		const startKey: number = start ?? 1;
		const endKey: number = end;
		
		const row: Array<any> = array.filter((row) => row[startKey - 1] === key);

		return row.length > 0 ? row[0][endKey - 1] : `There is no such key "${key}" (${typeof key}) at position #${startKey}.`;
	};

	static elementHasOverflowingChildren (element: HTMLElement, orientation?: string): boolean {
		if (orientation) {
			if (orientation === 'vertical') return element.scrollHeight > element.clientHeight;
			else if (orientation === 'horizoltal') return element.scrollWidth > element.clientWidth;
		}
		return (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
	};

	static getValueToProperType (value: string): string|number|boolean|Date {
		try {
			if (value.match(/(true|false)/i)) return value.toLowerCase() === 'true';
		
			if (!isNaN(Number(value))) return Number(value);
			
			const date = new Date(value);
			if (!(value.match(/[a-zA-Z]/)) && !isNaN(date.getTime()) && date.getTime() > 1000 * 60 * 60 * 24 * 365 * 10) return date;

			return value;
		} catch (err) {
			return `Error: ${err}\n\nValue: ${value}`
		}
	};

	static csvToJson (csv: Array<Array<number|string|boolean|Date>>): object {
		if (csv.length - 1 < 0) return {message: 'Empty'};
		else if (csv[0].length === 0) return {message: 'Empty'};

		const numRows: number = csv.length - 1;
		const numColumns = csv[0].length;
		const headers: Array<string> = csv[0].map((value) => typeof value === 'object' ? Intl.DateTimeFormat('pt-BR').format(value) : value.toString());
		
		type keysData = {
			labelName: string,
			depth: number,
			type: string,
			path: string,
			fullPath: string,
		};
		const jsonKeys: Array<keysData> = [];
		let maxDepth: number = 0;
		let root: Array<any> = [];

		for (const header of headers) {
			const mask: Array<string> = header.split('.');
			
			for (const level of mask) {
				const currentLevelDepth: number = mask.indexOf(level) + 1;
				const currentLevelType: string = mask.length === 1 ? 'root' : mask.indexOf(level) + 1 === mask.length ? 'value' : 'parent';
				maxDepth = Math.max(maxDepth, currentLevelDepth);

				let obj: keysData = {
					labelName: level,
					depth: currentLevelDepth,
					type: currentLevelType,
					path: '',
					fullPath: `root.${currentLevelType !== 'parent' ? header : mask.filter((value) => mask.indexOf(value) <= mask.indexOf(level)).join('.')}`
				};

				const stepsOfPath: Array<string> = obj.fullPath.split('.');
				obj.path = stepsOfPath.filter((value, i) => i !== stepsOfPath.length - 1).join('.');

				if (!(jsonKeys.some((jsonObj) => Object.keys(obj).every((key) => jsonObj[key] === obj[key])))) jsonKeys.push(obj);
			};
		};

		if (headers.length === 1) {
			for (let i = 1; i < csv.length; i++) {
				root.push(csv[i][0]);
			}
		} else {
			for (let k = 1; k <= maxDepth; k++) {
				const currentLevelKeys: Array<keysData> = jsonKeys.filter((keyData) => keyData.depth === k);
				const currentLevelPaths: Array<string> = [];

				for (const key of currentLevelKeys) {
					if (!(currentLevelPaths.some((someKey) => someKey === key.path))) {
						currentLevelPaths.push(key.path);
					};
				};

				for (const path of currentLevelPaths) {
					const currentKeysToIterate: Array<keysData> = currentLevelKeys.filter((value) => value.path === path);

					for (let i = 1; i < csv.length; i++) {
						let currentLineObj = {};

						for (const key of currentKeysToIterate) {
							if (key.type === 'parent') {
								currentLineObj[key.labelName] = [];
							} else {
								currentLineObj[key.labelName] = csv[i][headers.indexOf(key.fullPath.replace('root.', ''))];
								if (currentLineObj[key.labelName] === '') currentLineObj[key.labelName] = undefined;

								if (key.labelName.toLowerCase() === 'id' && typeof currentLineObj[key.labelName] === 'number') currentLineObj[key.labelName] = currentLineObj[key.labelName].toString();
							};
						};

						let depthLevelToIterate: number = 1;
						let target: Array<any> = root;

						while (depthLevelToIterate < k) {
							const nextLevelTargetName: string = path.split('.')[depthLevelToIterate];
							const keysOfThisLevel: Array<keysData> = jsonKeys.filter((value) => value.depth === depthLevelToIterate && value.type !== 'parent');

							target = target.filter((child) => keysOfThisLevel.every((keyOfThisLevel) => child[keyOfThisLevel.labelName] === csv[i][headers.indexOf(keyOfThisLevel.fullPath.replace('root.', ''))]))[0][nextLevelTargetName];
							
							depthLevelToIterate++;
						};
						
						const itemAlreadyExistsInTarget: boolean = target.some((obj) => {
							const everyKeyMatches: boolean = Object.keys(currentLineObj).every((value) => {
								if (currentLineObj[value] instanceof Array) {
									return true;
								} else {
									return currentLineObj[value] === obj[value];
								};
							});

							return everyKeyMatches;
						});

						if (!itemAlreadyExistsInTarget) {
							if (Object.keys(currentLineObj).some((key) => currentLineObj[key] !== undefined)) {
								target.push(currentLineObj);
							};
						};
					};
				};
			};
		};

		return {data: root};
	};

	static jsonToCsv (json: Array<object>, headers: Array<string>): Array<Array<number|string|boolean>> {
		if (Object.keys(json).length === 0) return [[]];
		else if (Object.keys(json).every((key) => (key === null)||(key === undefined))) return [[]];

		const headersToUse: Array<string> = headers.map((header) => `root.${header}`);
		const csv: Array<Array<number|string|boolean>> = [];
		const map: any = {}; 

		const maxDepth: number = Number(
			headers.reduce(function (prev: string, curr: string): string {
				return (Number(prev) > curr.split('.').length ? prev : curr.split('.').length).toString()
			}, '0')
		);

		for (let depth = 1; depth <= maxDepth; depth++) map[depth.toString()] = [];

		function fillUndefinedValues (headers: Array<string>, data: object): void {
			for (const header of headers) {
				if (data[header] === undefined) data[header] = null;
			};
		};

		function setDepthInMap (currentData: Array<any> = json, depth: number = 1, parent?: object) {
			for (const data of currentData) {
				const dataWhichIsNotArray: object = {};

				headersToUse.filter((header) => header.split('.').length === depth + 1).forEach((header) => {
					const thisParameter: string = header.split('.')[depth];

					dataWhichIsNotArray[thisParameter] = [data[thisParameter] ?? null, header.replace('root.', '')];
				});
				
				if (parent) dataWhichIsNotArray['parent_from_this_method'] = parent;

				map[depth.toString()].push(dataWhichIsNotArray);				

				const nextDepthLevelHeaders = headersToUse.filter((header) => header.split('.').length > depth + 1);
				const paths: Array<string> = [];

				nextDepthLevelHeaders.forEach((header) => {
					const currentLevelToLookUp: string = header.split('.')[depth];
					if (!paths.includes(currentLevelToLookUp)) paths.push(currentLevelToLookUp);
				});
				
				if (paths.some((pathHeader) => Array.isArray(data[pathHeader]))) {
					for (const pathHeader of paths) {
						if (data[pathHeader].length === 0) data[pathHeader].push({});

						for (const child of data[pathHeader]) {
							fillUndefinedValues((headersToUse.filter((header) => header.split('.').length === depth + 2).map((header) => header.split('.').pop()) as Array<string>), child);
						};

						if (!Object.keys(data[pathHeader]).every((key) => data[pathHeader][key] === undefined)) {
							setDepthInMap(data[pathHeader], depth + 1, dataWhichIsNotArray);
						};
					};
				}
			};
		};

		setDepthInMap();

		const allData: Array<any> = [];
		for (let i = 0; i < map[maxDepth.toString()].length; i++) {
			allData.push([]);
			const row = map[maxDepth.toString()][i];

			let target = row;

			do {
				for (const key in target) {
					if (key !== 'parent_from_this_method') allData[i].push([target[key][0], target[key][1]]);
				}

				target = target['parent_from_this_method']
			} while (target !== undefined);
		};

		allData.forEach((row) => {
			csv.push(
				row.sort(([value_1, attribute_1], [value_2, attribute_2]) => {
					return headers.indexOf(attribute_1) - headers.indexOf(attribute_2);
				}).map((pair) => pair[0])
			);
		});

		return csv;
	};
};