export default class CustomFunctions {
    static shuffle(arr) {
        let j, x, index;
        for (index = arr.length - 1; index > 0; index--) {
            j = Math.floor(Math.random() * (index + 1));
            x = arr[index];
            arr[index] = arr[j];
            arr[j] = x;
        }
        ;
        return arr;
    }
    ;
    static revertArray(arr) {
        const newArr = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            newArr.push(arr[i]);
        }
        ;
        return newArr;
    }
    static isParent(element, parent) {
        return parent.contains(element);
    }
    ;
    static randomIntFromInterval(min, max) {
        if (min > max) {
            console.error('Tá chapado?');
            return -1;
        }
        else if (min == max) {
            return max;
        }
        else
            return Math.floor(Math.random() * (max - min + 1) + min);
    }
    ;
    static doesItCollide(oneElement, twoElement) {
        const oneRect = oneElement.getBoundingClientRect();
        const twoRect = twoElement.getBoundingClientRect();
        if (oneRect.x + oneRect.width > twoRect.x &&
            twoRect.x + twoRect.width > oneRect.x &&
            oneRect.y + oneRect.height > twoRect.y &&
            twoRect.y + twoRect.height > oneRect.y)
            return true;
        else
            return false;
    }
    ;
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    ;
    static normalize(string) {
        return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replaceAll(' ', '-').toLowerCase().trim();
    }
    ;
    static vlookup(key, array, end, start) {
        const startKey = start ?? 1;
        const endKey = end;
        const row = array.filter((row) => row[startKey - 1] === key);
        return row.length > 0 ? row[0][endKey - 1] : `There is no such key "${key}" (${typeof key}) at position #${startKey}.`;
    }
    ;
    static elementHasOverflowingChildren(element, orientation) {
        if (orientation) {
            if (orientation === 'vertical')
                return element.scrollHeight > element.clientHeight;
            else if (orientation === 'horizoltal')
                return element.scrollWidth > element.clientWidth;
        }
        return (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
    }
    ;
    static getValueToProperType(value) {
        try {
            if (value.match(/(true|false)/i))
                return value.toLowerCase() === 'true';
            if (!isNaN(Number(value)))
                return Number(value);
            const date = new Date(value);
            if (!(value.match(/[a-zA-Z]/)) && !isNaN(date.getTime()) && date.getTime() > 1000 * 60 * 60 * 24 * 365 * 10)
                return date;
            return value;
        }
        catch (err) {
            return `Error: ${err}\n\nValue: ${value}`;
        }
    }
    ;
    static csvToJson(csv) {
        if (csv.length - 1 < 0)
            return { message: 'Empty' };
        else if (csv[0].length === 0)
            return { message: 'Empty' };
        const numRows = csv.length - 1;
        const numColumns = csv[0].length;
        const headers = csv[0].map((value) => typeof value === 'object' ? Intl.DateTimeFormat('pt-BR').format(value) : value.toString());
        const jsonKeys = [];
        let maxDepth = 0;
        let root = [];
        for (const header of headers) {
            const mask = header.split('.');
            for (const level of mask) {
                const currentLevelDepth = mask.indexOf(level) + 1;
                const currentLevelType = mask.length === 1 ? 'root' : mask.indexOf(level) + 1 === mask.length ? 'value' : 'parent';
                maxDepth = Math.max(maxDepth, currentLevelDepth);
                let obj = {
                    labelName: level,
                    depth: currentLevelDepth,
                    type: currentLevelType,
                    path: '',
                    fullPath: `root.${currentLevelType !== 'parent' ? header : mask.filter((value) => mask.indexOf(value) <= mask.indexOf(level)).join('.')}`
                };
                const stepsOfPath = obj.fullPath.split('.');
                obj.path = stepsOfPath.filter((value, i) => i !== stepsOfPath.length - 1).join('.');
                if (!(jsonKeys.some((jsonObj) => Object.keys(obj).every((key) => jsonObj[key] === obj[key]))))
                    jsonKeys.push(obj);
            }
            ;
        }
        ;
        if (headers.length === 1) {
            for (let i = 1; i < csv.length; i++) {
                root.push(csv[i][0]);
            }
        }
        else {
            for (let k = 1; k <= maxDepth; k++) {
                const currentLevelKeys = jsonKeys.filter((keyData) => keyData.depth === k);
                const currentLevelPaths = [];
                for (const key of currentLevelKeys) {
                    if (!(currentLevelPaths.some((someKey) => someKey === key.path))) {
                        currentLevelPaths.push(key.path);
                    }
                    ;
                }
                ;
                for (const path of currentLevelPaths) {
                    const currentKeysToIterate = currentLevelKeys.filter((value) => value.path === path);
                    for (let i = 1; i < csv.length; i++) {
                        let currentLineObj = {};
                        for (const key of currentKeysToIterate) {
                            if (key.type === 'parent') {
                                currentLineObj[key.labelName] = [];
                            }
                            else {
                                currentLineObj[key.labelName] = csv[i][headers.indexOf(key.fullPath.replace('root.', ''))];
                                if (currentLineObj[key.labelName] === '')
                                    currentLineObj[key.labelName] = undefined;
                                if (key.labelName.toLowerCase() === 'id' && typeof currentLineObj[key.labelName] === 'number')
                                    currentLineObj[key.labelName] = currentLineObj[key.labelName].toString();
                            }
                            ;
                        }
                        ;
                        let depthLevelToIterate = 1;
                        let target = root;
                        while (depthLevelToIterate < k) {
                            const nextLevelTargetName = path.split('.')[depthLevelToIterate];
                            const keysOfThisLevel = jsonKeys.filter((value) => value.depth === depthLevelToIterate && value.type !== 'parent');
                            target = target.filter((child) => keysOfThisLevel.every((keyOfThisLevel) => child[keyOfThisLevel.labelName] === csv[i][headers.indexOf(keyOfThisLevel.fullPath.replace('root.', ''))]))[0][nextLevelTargetName];
                            depthLevelToIterate++;
                        }
                        ;
                        const itemAlreadyExistsInTarget = target.some((obj) => {
                            const everyKeyMatches = Object.keys(currentLineObj).every((value) => {
                                if (currentLineObj[value] instanceof Array) {
                                    return true;
                                }
                                else {
                                    return currentLineObj[value] === obj[value];
                                }
                                ;
                            });
                            return everyKeyMatches;
                        });
                        if (!itemAlreadyExistsInTarget) {
                            if (Object.keys(currentLineObj).some((key) => currentLineObj[key] !== undefined)) {
                                target.push(currentLineObj);
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
        return { data: root };
    }
    ;
    static jsonToCsv(json, headers) {
        const emptyStr = '';
        if (Object.keys(json).length === 0)
            return emptyStr;
        else if (Object.keys(json).every((key) => (key === null) || (key === undefined)))
            return emptyStr;
        const csv = [headers];
        const map = {};
        const maxDepth = Number(headers.reduce(function (prev, curr) {
            return (Number(prev) > curr.split('.').length ? prev : curr.split('.').length).toString();
        }, '0'));
        for (let depth = 1; depth <= maxDepth; depth++) {
            map[depth.toString()] = [];
            for (const data of json) {
            }
            ;
        }
        ;
        console.log(map);
        return '';
    }
    ;
}
;
