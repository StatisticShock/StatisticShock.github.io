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
import PageBuilding, { TemplateConstructor } from './shared.js';
import { server } from '../util/server-url.js';
var HistoryState = /** @class */ (function () {
    function HistoryState() {
    }
    HistoryState.path = function () {
        var params = new URLSearchParams(window.location.search);
        var page = params.get('page');
        var id = params.get('id');
        this.data.id = id;
        this.data.page = page;
    };
    ;
    HistoryState.updateContent = function (_a) {
        // history.replaceState('', '', `update/${page}/${Number(id) > 0 ? id : ''}`)
        var page = _a.page, id = _a.id;
        var route = this.routes.filter(function (route) { return route.type === page; })[0] || { title: '404', type: 'Not Found' };
        if (route.title === '404') {
            window.location.href = window.location.origin + '/404.html';
        }
        else {
            document.getElementById('title').textContent = route.title;
        }
    };
    ;
    HistoryState.load = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var content, json, upload;
            var page = _b.page, id = _b.id;
            return __generator(this, function (_c) {
                content = document.querySelector('#content');
                json = fetch("".concat(server, "contents/").concat(page)).then(function (res) { return res.json(); });
                upload = document.importNode(document.getElementById('upload-template').content, true);
                switch (page) {
                    case 'shortcuts':
                        json.then(function (res) {
                            var shortcutFolders = res[page];
                            new TemplateConstructor(document.querySelector('#shortcuts-template'), shortcutFolders).insert(content);
                            for (var _i = 0, shortcutFolders_1 = shortcutFolders; _i < shortcutFolders_1.length; _i++) {
                                var folder = shortcutFolders_1[_i];
                                for (var _a = 0, _b = folder.children; _a < _b.length; _a++) {
                                    var shortcut = _b[_a];
                                    document.querySelector('#' + folder.id + ' #' + shortcut.id + ' input').checked = shortcut.showOnMobile;
                                }
                            }
                            ;
                        });
                        break;
                    case 'gamecards':
                    case 'headers':
                        json.then(function (res) {
                            var headers = res[page];
                            var headerContainer = document.createElement('div');
                            headerContainer.classList.add('headers');
                            for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
                                var header = headers_1[_i];
                                var tpt = document.getElementById('header-template');
                                var div = tpt.content.querySelector('div');
                                var img = div.querySelector('img');
                                var box = div.querySelector('input');
                                var prg = div.querySelector('p');
                                img.src = header.href;
                                box.checked = header.active;
                                prg.textContent = header.name;
                                var node = document.importNode(tpt.content, true);
                                headerContainer.appendChild(node);
                            }
                            ;
                            content.appendChild(headerContainer);
                            content.querySelectorAll('div.headers img').forEach(function (img) {
                                img.onclick = function (ev) {
                                    img.parentElement.classList.toggle('hidden');
                                };
                            });
                            headerContainer.appendChild(upload);
                        });
                        break;
                    default:
                        content.innerHTML = 'Page Not Found';
                }
                return [2 /*return*/];
            });
        });
    };
    ;
    HistoryState.routes = [
        {
            type: 'shortcuts',
            title: 'Atualização de atalho',
        },
        {
            type: 'gamecards',
            title: 'Atualização de atalho gaming',
        },
        {
            type: 'mfc',
            title: 'MyFigureCollection'
        },
        {
            type: 'headers',
            title: 'Atualização de headers'
        }
    ];
    HistoryState.data = {
        page: '',
        id: '',
    };
    return HistoryState;
}());
;
window.addEventListener('load', onLoadFunctions);
function onLoadFunctions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    PageBuilding.createLoaders(12);
                    HistoryState.path();
                    HistoryState.updateContent(HistoryState.data);
                    return [4 /*yield*/, HistoryState.load(HistoryState.data)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
;
