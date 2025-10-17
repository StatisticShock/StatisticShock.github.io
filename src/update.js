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
import PageBuilding from './shared.js';
import { server } from './server-url.js';
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
        var page = _a.page, id = _a.id;
        history.replaceState('', '', "update/".concat(page, "/").concat(Number(id) > 0 ? id : ''));
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
            var content, json, upload, shortcutFolders, _i, shortcutFolders_1, folder, div, div2_1, header, div3_1, _c, _d, shortcut, shortcutDiv, gamecards, item, keys, div1, div2, div3, imgBorderColor, _e, keys_1, key, headers, headerContainer, _f, headers_1, header, tpt, div, img, box, prg, node;
            var _g;
            var page = _b.page, id = _b.id;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        content = document.querySelector('#content');
                        return [4 /*yield*/, fetch("".concat(server, "contents/").concat(page)).then(function (res) { return res.json(); })];
                    case 1:
                        json = _h.sent();
                        upload = document.importNode(document.getElementById('upload-template').content, true);
                        switch (page) {
                            case 'shortcuts':
                                shortcutFolders = json[page];
                                for (_i = 0, shortcutFolders_1 = shortcutFolders; _i < shortcutFolders_1.length; _i++) {
                                    folder = shortcutFolders_1[_i];
                                    div = document.createElement('div');
                                    div.id = folder.id;
                                    div.classList.add('folder');
                                    div2_1 = document.createElement('div');
                                    div2_1.classList.add('folder-wrapper');
                                    header = document.createElement('h2');
                                    header.innerHTML = folder.title;
                                    div2_1.appendChild(header);
                                    div3_1 = document.createElement('div');
                                    div3_1.classList.add('shortcuts-wrapper');
                                    for (_c = 0, _d = folder.children; _c < _d.length; _c++) {
                                        shortcut = _d[_c];
                                        shortcutDiv = document.createElement('div');
                                        shortcutDiv.id = shortcut.id;
                                        shortcutDiv.classList.add('shortcut');
                                        shortcutDiv.innerHTML = "<span class=\"shortcut-img-container\">" +
                                            "<img src=\"".concat(shortcut.img, "\">") +
                                            "</span>" +
                                            "<div class=\"text-container\">" +
                                            "<span class=\"shortcut-name-container\">" +
                                            "<span>".concat(shortcut.alt, "</span>") +
                                            "</span>" +
                                            "<span class=\"shortcut-link-container\">" +
                                            "<span>".concat(shortcut.href, "</span>") +
                                            "</span>" +
                                            "<span class=\"shortcut-parent-container\">" +
                                            "<span>".concat(folder.title, "</span>") +
                                            "</span>" +
                                            "</div>" +
                                            "<span class=\"shortcut-mobile-container\">" +
                                            "<input type=\"checkbox\" checked=\"".concat(shortcut.showOnMobile, "\">") +
                                            "</span>";
                                        div3_1.appendChild(shortcutDiv);
                                    }
                                    ;
                                    div.appendChild(div2_1);
                                    div.appendChild(div3_1);
                                    content.appendChild(div);
                                }
                                ;
                                break;
                            case 'gamecards':
                                gamecards = json[page];
                                break;
                            case 'mfc':
                                item = json[page].filter(function (item) { return item.id === id; })[0];
                                keys = [
                                    { title: 'title', locked: false },
                                    { title: 'character', locked: false },
                                    { title: 'characterJap', locked: false },
                                    { title: 'source', locked: false },
                                    { title: 'sourceJap', locked: false },
                                    { title: 'classification', locked: false },
                                    { title: 'category', locked: false },
                                ];
                                div1 = document.createElement('div');
                                div2 = document.createElement('div');
                                div3 = document.createElement('div');
                                div1.classList.add('mfc');
                                div2.classList.add('img-wrapper');
                                div3.classList.add('data-wrapper');
                                imgBorderColor = void 0;
                                switch (item.category) {
                                    case 'Prepainted':
                                        imgBorderColor = 'green';
                                        break;
                                    case 'Action/Dolls':
                                        imgBorderColor = '#0080ff';
                                        break;
                                    default:
                                        imgBorderColor = 'orange';
                                        break;
                                }
                                div2.innerHTML = "<img class=\"icon-image\" style=\"border: 4px solid ".concat(imgBorderColor, ";\" src=\"").concat(item.icon, "\"><img class=\"main-image\" style=\"border: 4px solid ").concat(imgBorderColor, ";\" src=\"").concat(item.img, "\">");
                                for (_e = 0, keys_1 = keys; _e < keys_1.length; _e++) {
                                    key = keys_1[_e];
                                    div3.innerHTML += "<div class=\"data-".concat(key.title, "\"><p>").concat(key.title, "</p><p>").concat((_g = item[key.title]) !== null && _g !== void 0 ? _g : '<span class="null">empty</span>', "</p></div>");
                                }
                                ;
                                div1.appendChild(div2);
                                div1.appendChild(div3);
                                div3.innerHTML += "<button id=\"update-trigger\">Atualizar</button>";
                                content.appendChild(div1);
                                break;
                            case 'headers':
                                headers = json[page];
                                headerContainer = document.createElement('div');
                                headerContainer.classList.add('headers');
                                for (_f = 0, headers_1 = headers; _f < headers_1.length; _f++) {
                                    header = headers_1[_f];
                                    tpt = document.getElementById('header-template');
                                    div = tpt.content.querySelector('div');
                                    img = div.querySelector('img');
                                    box = div.querySelector('input');
                                    prg = div.querySelector('p');
                                    img.src = header.href;
                                    box.checked = header.active;
                                    prg.textContent = header.name;
                                    node = document.importNode(tpt.content, true);
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
                                break;
                            default:
                                content.innerHTML = 'Page Not Found';
                        }
                        return [2 /*return*/];
                }
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
            title: 'Atualização de figure'
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
