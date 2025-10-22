var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CustomFunctions = /** @class */ (function () {
    function CustomFunctions() {
    }
    CustomFunctions.shuffle = function (arr) {
        var j, x, index;
        for (index = arr.length - 1; index > 0; index--) {
            j = Math.floor(Math.random() * (index + 1));
            x = arr[index];
            arr[index] = arr[j];
            arr[j] = x;
        }
        ;
        return arr;
    };
    ;
    CustomFunctions.revertArray = function (arr) {
        var newArr = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            newArr.push(arr[i]);
        }
        ;
        return newArr;
    };
    CustomFunctions.isParent = function (element, parent) {
        return parent.contains(element);
    };
    ;
    CustomFunctions.randomIntFromInterval = function (min, max) {
        if (min > max) {
            console.error('Tá chapado?');
            return -1;
        }
        else if (min == max) {
            return max;
        }
        else
            return Math.floor(Math.random() * (max - min + 1) + min);
    };
    ;
    CustomFunctions.doesItCollide = function (oneElement, twoElement) {
        var oneRect = oneElement.getBoundingClientRect();
        var twoRect = twoElement.getBoundingClientRect();
        if (oneRect.x + oneRect.width > twoRect.x &&
            twoRect.x + twoRect.width > oneRect.x &&
            oneRect.y + oneRect.height > twoRect.y &&
            twoRect.y + twoRect.height > oneRect.y)
            return true;
        else
            return false;
    };
    ;
    CustomFunctions.sleep = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    ;
    CustomFunctions.normalize = function (string) {
        return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replaceAll(' ', '-').toLowerCase().trim();
    };
    ;
    CustomFunctions.vlookup = function (key, array, end, start) {
        var startKey = start !== null && start !== void 0 ? start : 1;
        var endKey = end;
        var row = array.filter(function (row) { return row[startKey - 1] === key; });
        return row.length > 0 ? row[0][endKey - 1] : "There is no such key \"".concat(key, "\" (").concat(typeof key, ") at position #").concat(startKey, ".");
    };
    ;
    CustomFunctions.elementHasOverflowingChildren = function (element, orientation) {
        if (orientation) {
            if (orientation === 'vertical')
                return element.scrollHeight > element.clientHeight;
            else if (orientation === 'horizoltal')
                return element.scrollWidth > element.clientWidth;
        }
        return (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
    };
    ;
    CustomFunctions.getValueToProperType = function (value) {
        try {
            if (value.match(/(true|false)/i))
                return value.toLowerCase() === 'true';
            if (!isNaN(Number(value)))
                return Number(value);
            var date = new Date(value);
            if (!(value.match(/[a-zA-Z]/)) && !isNaN(date.getTime()) && date.getTime() > 1000 * 60 * 60 * 24 * 365 * 10)
                return date;
            return value;
        }
        catch (err) {
            return "Error: ".concat(err, "\n\nValue: ").concat(value);
        }
    };
    ;
    CustomFunctions.csvToJson = function (csv) {
        if (csv.length - 1 < 0)
            return { message: 'Empty' };
        else if (csv[0].length === 0)
            return { message: 'Empty' };
        var numRows = csv.length - 1;
        var numColumns = csv[0].length;
        var headers = csv[0].map(function (value) { return typeof value === 'object' ? Intl.DateTimeFormat('pt-BR').format(value) : value.toString(); });
        var jsonKeys = [];
        var maxDepth = 0;
        var root = [];
        var _loop_1 = function (header) {
            var mask = header.split('.');
            var _loop_3 = function (level) {
                var currentLevelDepth = mask.indexOf(level) + 1;
                var currentLevelType = mask.length === 1 ? 'root' : mask.indexOf(level) + 1 === mask.length ? 'value' : 'parent';
                maxDepth = Math.max(maxDepth, currentLevelDepth);
                var obj = {
                    labelName: level,
                    depth: currentLevelDepth,
                    type: currentLevelType,
                    path: '',
                    fullPath: "root.".concat(currentLevelType !== 'parent' ? header : mask.filter(function (value) { return mask.indexOf(value) <= mask.indexOf(level); }).join('.'))
                };
                var stepsOfPath = obj.fullPath.split('.');
                obj.path = stepsOfPath.filter(function (value, i) { return i !== stepsOfPath.length - 1; }).join('.');
                if (!(jsonKeys.some(function (jsonObj) { return Object.keys(obj).every(function (key) { return jsonObj[key] === obj[key]; }); })))
                    jsonKeys.push(obj);
            };
            for (var _a = 0, mask_1 = mask; _a < mask_1.length; _a++) {
                var level = mask_1[_a];
                _loop_3(level);
            }
            ;
        };
        for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
            var header = headers_1[_i];
            _loop_1(header);
        }
        ;
        if (headers.length === 1) {
            for (var i = 1; i < csv.length; i++) {
                root.push(csv[i][0]);
            }
        }
        else {
            var _loop_2 = function (k) {
                var currentLevelKeys = jsonKeys.filter(function (keyData) { return keyData.depth === k; });
                var currentLevelPaths = [];
                var _loop_4 = function (key) {
                    if (!(currentLevelPaths.some(function (someKey) { return someKey === key.path; }))) {
                        currentLevelPaths.push(key.path);
                    }
                    ;
                };
                for (var _b = 0, currentLevelKeys_1 = currentLevelKeys; _b < currentLevelKeys_1.length; _b++) {
                    var key = currentLevelKeys_1[_b];
                    _loop_4(key);
                }
                ;
                var _loop_5 = function (path) {
                    var currentKeysToIterate = currentLevelKeys.filter(function (value) { return value.path === path; });
                    var _loop_6 = function (i) {
                        var currentLineObj = {};
                        for (var _d = 0, currentKeysToIterate_1 = currentKeysToIterate; _d < currentKeysToIterate_1.length; _d++) {
                            var key = currentKeysToIterate_1[_d];
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
                        var depthLevelToIterate = 1;
                        var target = root;
                        var _loop_7 = function () {
                            var nextLevelTargetName = path.split('.')[depthLevelToIterate];
                            var keysOfThisLevel = jsonKeys.filter(function (value) { return value.depth === depthLevelToIterate && value.type !== 'parent'; });
                            target = target.filter(function (child) { return keysOfThisLevel.every(function (keyOfThisLevel) { return child[keyOfThisLevel.labelName] === csv[i][headers.indexOf(keyOfThisLevel.fullPath.replace('root.', ''))]; }); })[0][nextLevelTargetName];
                            depthLevelToIterate++;
                        };
                        while (depthLevelToIterate < k) {
                            _loop_7();
                        }
                        ;
                        var itemAlreadyExistsInTarget = target.some(function (obj) {
                            var everyKeyMatches = Object.keys(currentLineObj).every(function (value) {
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
                            if (Object.keys(currentLineObj).some(function (key) { return currentLineObj[key] !== undefined; })) {
                                target.push(currentLineObj);
                            }
                            ;
                        }
                        ;
                    };
                    for (var i = 1; i < csv.length; i++) {
                        _loop_6(i);
                    }
                    ;
                };
                for (var _c = 0, currentLevelPaths_1 = currentLevelPaths; _c < currentLevelPaths_1.length; _c++) {
                    var path = currentLevelPaths_1[_c];
                    _loop_5(path);
                }
                ;
            };
            for (var k = 1; k <= maxDepth; k++) {
                _loop_2(k);
            }
            ;
        }
        ;
        return { data: root };
    };
    ;
    CustomFunctions.jsonToCsv = function (json, headers) {
        var emptyStr = '';
        if (Object.keys(json).length === 0)
            return emptyStr;
        else if (Object.keys(json).every(function (key) { return (key === null) || (key === undefined); }))
            return emptyStr;
        var csv = [headers];
        var map = {};
        var maxDepth = Number(headers.reduce(function (prev, curr) {
            return (Number(prev) > curr.split('.').length ? prev : curr.split('.').length).toString();
        }, '0'));
        for (var depth = 1; depth <= maxDepth; depth++) {
            map[depth.toString()] = [];
            for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
                var data = json_1[_i];
            }
            ;
        }
        ;
        console.log(map);
        return '';
    };
    ;
    return CustomFunctions;
}());
export default CustomFunctions;
;
