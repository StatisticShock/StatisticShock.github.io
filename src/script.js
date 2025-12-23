var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import CustomFunctions from '../util/functions.js';
import { server } from '../util/server-url.js';
import PageBuildingImport, { TemplateConstructor } from './shared.js';
var toggleExternalDataLoad = true;
var ua = navigator.userAgent || navigator.vendor || window.opera;
var mobile = /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(ua.toLowerCase());
var portrait = (window.innerWidth < window.innerHeight);
var PageBuilding = /** @class */ (function (_super) {
    __extends(PageBuilding, _super);
    function PageBuilding() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PageBuilding.putVersionOnFooter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version, footer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('https://raw.githubusercontent.com/StatisticShock/StatisticShock.github.io/refs/heads/main/package.json')
                            .then(function (res) { return res.json(); })
                            .then(function (data) { return data.version; })];
                    case 1:
                        version = _a.sent();
                        footer = document.querySelector('footer');
                        footer.innerHTML += "<p><small>ver. ".concat(version, "</small></p>");
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    PageBuilding.createSkeletons = function () {
        var skeleton = 'skeleton';
        var container = 'skeleton-container';
        function createShortcutSkeletons() {
            var shortcuts = document.querySelector('#shortcuts block-container');
            var maxIcons = 24;
            var bttn = shortcuts.querySelector('button');
            var row = Array(maxIcons).fill({ joker: skeleton, alt: '. . .' });
            new TemplateConstructor(document.querySelector('#shortcuts-template'), Array(4).fill({ jokerContainer: container, joker: skeleton, children: row })).insert(shortcuts, 'before', bttn);
            shortcuts.querySelectorAll('img').forEach(function (img) { return img.src = './icon/blank.svg'; });
        }
        ;
        function createGamecardSkeletons() {
            var gamecard = document.querySelector('#gaming gaming-container');
            var sample = {
                label: '. . .',
                joker: 'skeleton',
                jokerContainer: 'skeleton-container',
            };
            new TemplateConstructor(document.querySelector('#gamecard-template'), Array(6).fill(sample)).insert(gamecard);
        }
        ;
        function createMfcSkeletons() {
            var mfc = document.querySelector('#my-figure-collection my-figure-collection');
            var maxIcons = Math.floor(parseInt(getComputedStyle(mfc).width) / (60 + 20)) * 5;
            var sample = {
                joker: 'skeleton',
                jokerContainer: 'skeleton-container',
                icon: './icon/blank.svg'
            };
            new TemplateConstructor(document.querySelector('#mfc-template'), Array(maxIcons).fill(sample)).insert(mfc);
        }
        ;
        function createMalSkeletons() {
            var mal = document.querySelector('#my-anime-list my-anime-list');
            var maxIcons = 20;
            var sample = {
                joker: 'skeleton',
                rank: ' . . .',
                title: '. . .',
                jokerContainer: 'skeleton-container',
                "main_picture_large": './icon/blank.svg'
            };
            new TemplateConstructor(document.querySelector('#myanimelist-template'), Array(maxIcons).fill(sample)).insert(mal);
        }
        createShortcutSkeletons();
        createGamecardSkeletons();
        createMfcSkeletons();
        createMalSkeletons();
    };
    PageBuilding.deleteSkeletons = function (prefixes) {
        for (var _i = 0, prefixes_1 = prefixes; _i < prefixes_1.length; _i++) {
            var prefix = prefixes_1[_i];
            var skeletons = document.querySelectorAll(prefix + '.skeleton-container');
            skeletons.forEach(function (skeleton) {
                skeleton.remove();
            });
        }
        ;
    };
    ;
    return PageBuilding;
}(PageBuildingImport));
;
var UserInterface = /** @class */ (function () {
    function UserInterface() {
    }
    UserInterface.nightModeToggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var darkOrLightTheme, svg;
            return __generator(this, function (_a) {
                darkOrLightTheme = 'darkOrLightTheme';
                svg = document.querySelector('switch svg#theme-toggle');
                if (localStorage.getItem(darkOrLightTheme) !== null) {
                    switch (localStorage.getItem(darkOrLightTheme)) {
                        case 'light':
                            document.documentElement.setAttribute('data-theme', 'light');
                            break;
                        case 'dark':
                            document.documentElement.setAttribute('data-theme', 'dark');
                            svg.querySelector('g').classList.toggle('dark');
                            break;
                    }
                }
                else {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        localStorage.setItem(darkOrLightTheme, 'dark');
                        document.documentElement.setAttribute('data-theme', 'dark');
                        svg.querySelector('g').classList.toggle('dark');
                    }
                    else {
                        localStorage.setItem(darkOrLightTheme, 'light');
                        document.documentElement.setAttribute('data-theme', 'light');
                    }
                    ;
                }
                ;
                svg.onclick = function (ev) {
                    var currentTheme = document.documentElement.getAttribute('data-theme');
                    svg.querySelector('g').classList.toggle('dark');
                    switch (currentTheme) {
                        case 'light':
                            document.documentElement.setAttribute('data-theme', 'dark');
                            localStorage.setItem(darkOrLightTheme, 'dark');
                            break;
                        case 'dark':
                            document.documentElement.setAttribute('data-theme', 'light');
                            localStorage.setItem(darkOrLightTheme, 'light');
                            break;
                    }
                    ;
                };
                return [2 /*return*/];
            });
        });
    };
    ;
    UserInterface.collapseHeader = function () {
        var _this = this;
        var navbar = document.querySelector('nav.menu');
        var svg = navbar.querySelector('svg#expand-retract-header');
        var header = document.querySelector('header');
        svg.addEventListener('click', function (ev) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                navbar.classList.toggle('animated');
                header.classList.toggle('hidden');
                return [2 /*return*/];
            });
        }); });
    };
    ;
    UserInterface.makeSwitchesSlide = function () {
        var switches = document.querySelectorAll('.switch');
        switches.forEach(function (switchElement) {
            var input = document.createElement('input');
            var slider = document.createElement('div');
            input.setAttribute('type', 'checkbox');
            slider.classList.add('slider');
            switchElement.appendChild(input);
            switchElement.appendChild(slider);
            switchElement.style.borderRadius = (parseFloat(getComputedStyle(switchElement).height) / 2) + 'px';
        });
        var sliders = document.querySelectorAll('.switch > .slider');
        sliders.forEach(function (slider) {
            var parent = slider.parentElement;
            var input = parent.querySelector('input');
            var uncheckedPosition = getComputedStyle(slider, '::before').left;
            var checkedPosition = parent.offsetWidth - parseFloat(uncheckedPosition) * 4 - parseFloat(getComputedStyle(slider, '::before').width) + 'px';
            slider.style.setProperty('--total-transition', checkedPosition);
            input.style.setProperty('--total-transition', checkedPosition);
        });
    };
    ;
    UserInterface.dragPopUps = function () {
        var popUps = document.querySelectorAll('.pop-up');
        var isDragging = false;
        var offsetX, offsetY;
        popUps.forEach(function (popUp) {
            popUp.addEventListener('mousedown', startDragging);
            popUp.addEventListener('touchstart', startDragging);
            popUp.addEventListener('mousemove', drag);
            popUp.addEventListener('touchmove', drag);
            document.addEventListener('mouseup', stopDragging);
            document.addEventListener('touchend', stopDragging);
        });
        function startDragging(event) {
            var e;
            if (event instanceof MouseEvent) {
                e = event;
            }
            else {
                e = event.touches[0];
            }
            ;
            var target = e.target;
            if ((target === this || CustomFunctions.isParent(target, this.querySelector('.pop-up-header'))) &&
                !(target instanceof HTMLImageElement) &&
                !(target instanceof HTMLParagraphElement) &&
                !(target instanceof HTMLSpanElement) &&
                !(target instanceof HTMLInputElement)) {
                isDragging = true;
                offsetX = e.clientX - this.offsetLeft;
                offsetY = e.clientY - this.offsetTop;
            }
        }
        ;
        function drag(event) {
            var e;
            if (event instanceof MouseEvent) {
                e = event;
            }
            else {
                e = event.touches[0];
            }
            ;
            if (isDragging) {
                var x = e.clientX - offsetX;
                var y = e.clientY - offsetY;
                this.style.left = x + 'px';
                this.style.top = y + 'px';
            }
            event.preventDefault();
        }
        ;
        function stopDragging() {
            isDragging = false;
        }
    };
    ;
    UserInterface.resetPopUpsOnOpen = function () {
        var _this = this;
        var buttons = document.querySelectorAll('.close-button');
        buttons.forEach(function (button) {
            var parent = button.parentElement.parentElement;
            button.onclick = function () {
                parent.style.display = 'none';
                _this.setPopUpDefaultValues();
            };
        });
    };
    ;
    UserInterface.setPopUpDefaultValues = function () {
        var keywordsReddit = document.getElementById('keywords-reddit');
        var subreddit = document.getElementById('subreddit');
        var toDate = document.getElementById('to-date');
        var fromDate = document.getElementById('from-date');
        keywordsReddit.value = '';
        subreddit.value = '';
        toDate.valueAsDate = new Date();
        fromDate.valueAsDate = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate());
        var keywordsWikipedia = document.getElementById('keywords-wikipedia');
        keywordsWikipedia.value = '';
    };
    ;
    UserInterface.changeHomeView = function () {
        var navBttns = document.querySelectorAll('nav a');
        navBttns.forEach(function (bttn) {
            bttn.onclick = function (ev) {
                ev.preventDefault();
                var target = ev.target || ev.touches[0].target;
                var anchor = target.closest('a');
                document.querySelectorAll('.flex-container > section').forEach(function (section) {
                    section.style.display = section.id === anchor.href.split('/').pop() ? '' : 'none';
                });
            };
        });
    };
    ;
    UserInterface.refreshData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var button;
            var _this = this;
            return __generator(this, function (_a) {
                button = document.querySelector('button#refresh-button');
                button.onclick = function (ev) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, caches.delete('v1')];
                            case 1:
                                _a.sent();
                                window.location.reload();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [2 /*return*/];
            });
        });
    };
    ;
    return UserInterface;
}());
;
var ExternalSearch = /** @class */ (function () {
    function ExternalSearch() {
    }
    ExternalSearch.redditSearchTrigger = function () {
        var okButtonReddit = document.querySelector('.pop-up.reddit-google .ok-button');
        okButtonReddit.onclick = redditSearch;
        function redditSearch() {
            var _a;
            var keywords = document.getElementById('keywords-reddit');
            var subreddit = document.getElementById('subreddit');
            var from = document.getElementById('from-date');
            var to = document.getElementById('to-date');
            var subredditStrings = subreddit.value.split(/ \/ /).filter(function (text) {
                if (text != '')
                    return true;
            });
            if ((new Date(from.value) >= new Date(to.value)) && from.value && to.value)
                return;
            var string = 'https://www.google.com/search?q=';
            if (keywords.value) {
                string = string + keywords.value.replace(' ', '+');
                if (subredditStrings[0]) {
                    subredditStrings.forEach(function (text) {
                        if (subredditStrings.indexOf(text) > 0) {
                            string = string + '+OR+site%3Ahttps%3A%2F%2Freddit.com%2Fr%2F' + text.replaceAll(' ', '_');
                        }
                        else {
                            string = string + '+site%3Ahttps%3A%2F%2Freddit.com%2Fr%2F' + text.replaceAll(' ', '_');
                        }
                    });
                }
                else {
                    string = string + '+site%3Ahttps%3A%2F%2Freddit.com%2F';
                }
                if (from.value) {
                    string = string + '+after%3A' + from.value;
                }
                if (to.value) {
                    string = string + '+before%3A' + to.value;
                }
                (_a = window.open(string, '_blank')) === null || _a === void 0 ? void 0 : _a.focus();
            }
            ;
        }
    };
    ;
    ExternalSearch.wikipediaSearchTrigger = function () {
        var okButtonWikipedia = document.querySelector('.pop-up.wikipedia .ok-button');
        okButtonWikipedia.onclick = wikipediaSearch;
        function wikipediaSearch() {
            var _a;
            var keywords = document.getElementById('keywords-wikipedia');
            var string = 'https://pt.wikipedia.org/w/index.php?search=';
            if (keywords.value) {
                string = string + keywords.value.replace(' ', '+');
                (_a = window.open(string, '_blank')) === null || _a === void 0 ? void 0 : _a.focus();
            }
        }
    };
    ;
    return ExternalSearch;
}());
;
var CloudStorageData = /** @class */ (function () {
    function CloudStorageData() {
    }
    CloudStorageData.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(server, "contents/"))];
                    case 1:
                        response = _b.sent();
                        _a = this;
                        return [4 /*yield*/, response.json()];
                    case 2:
                        _a.json = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CloudStorageData.loadContentFromJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            function loadShortcuts() {
                return __awaiter(this, void 0, void 0, function () {
                    var shortcuts, bttn, shortcutsOnMobile;
                    return __generator(this, function (_a) {
                        shortcuts = document.querySelector('section#shortcuts block-container');
                        bttn = document.querySelector('#shortcuts block-container button');
                        shortcutsOnMobile = content.shortcuts.map(function (folder) {
                            var folderClone = structuredClone(folder);
                            folderClone.children = folderClone.children.filter(function (child) {
                                return child.showOnMobile;
                            });
                            return folderClone;
                        }).filter(function (folder) {
                            return folder.children.length > 0;
                        });
                        new TemplateConstructor(document.querySelector('template#shortcuts-template'), mobile ? shortcutsOnMobile : content.shortcuts).insert(shortcuts, 'before', bttn);
                        return [2 /*return*/];
                    });
                });
            }
            function loadGamecards() {
                return __awaiter(this, void 0, void 0, function () {
                    var gamecards, _i, _a, gamecard, _b, _c, css;
                    return __generator(this, function (_d) {
                        gamecards = document.querySelector('#gaming gaming-container');
                        new TemplateConstructor(document.querySelector('template#gamecard-template'), content.gamecards).insert(gamecards, 'after');
                        // a
                        for (_i = 0, _a = content.gamecards; _i < _a.length; _i++) {
                            gamecard = _a[_i];
                            for (_b = 0, _c = gamecard.img_css; _b < _c.length; _b++) {
                                css = _c[_b];
                                document.querySelector('#' + gamecard.id + ' a').style.setProperty(css.attribute, css.value);
                            }
                            ;
                        }
                        ;
                        return [2 /*return*/];
                    });
                });
            }
            function loadHeaders() {
                return __awaiter(this, void 0, void 0, function () {
                    var possibleHeaders, index, src, header, h1;
                    return __generator(this, function (_a) {
                        possibleHeaders = content.headers.filter(function (header) { return header.active; });
                        index = CustomFunctions.randomIntFromInterval(0, possibleHeaders.length - 1);
                        src = possibleHeaders[index].href;
                        possibleHeaders.forEach(function (imgSrc) {
                            var img = new Image();
                            img.src = imgSrc.href;
                        });
                        header = document.querySelector('#header div');
                        h1 = header.querySelector('h1');
                        header.style.backgroundImage = "url('".concat(src, "')");
                        header.onclick = function (event) {
                            var _a;
                            var target = null;
                            if (event instanceof MouseEvent) {
                                target = event.target;
                            }
                            else if (event instanceof TouchEvent) {
                                target = event.touches[0].target;
                            }
                            if (typeof window.getSelection() !== undefined) {
                                if (((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString()) !== '')
                                    return;
                            }
                            ;
                            var newHeadersArr = possibleHeaders.filter(function (headerObj) {
                                return headerObj.href !== src;
                            });
                            index = CustomFunctions.randomIntFromInterval(0, newHeadersArr.length - 1);
                            src = newHeadersArr[index].href;
                            header.style.backgroundImage = "url('".concat(src, "')");
                        };
                        return [2 /*return*/];
                    });
                });
            }
            function loadMfc() {
                return __awaiter(this, void 0, void 0, function () {
                    function makeMfcSearchWork() {
                        var input = document.querySelector('input[name="mfc-filter"]');
                        var figures = content.mfc;
                        ['keyup', 'paste'].forEach(function (eventName) {
                            input.addEventListener(eventName, function (ev) {
                                var string = input.value;
                                var regEx = new RegExp(string, 'ig');
                                figures.forEach(function (figure) {
                                    if (Object.keys(figure).some(function (key) { return regEx.test(figure[key]); })) {
                                        document.querySelector('#mfc-' + figure.id).style.display = 'flex';
                                    }
                                    else {
                                        document.querySelector('#mfc-' + figure.id).style.display = 'none';
                                    }
                                });
                            });
                        });
                    }
                    var destination;
                    return __generator(this, function (_a) {
                        destination = document.querySelector('#my-figure-collection my-figure-collection');
                        new TemplateConstructor(document.querySelector('#mfc-template'), content.mfc).insert(destination, 'after');
                        document.querySelectorAll('mfc > img').forEach(function (mfcImg) {
                            mfcImg.addEventListener('click', function (ev) {
                                mfcImg.parentElement.classList.toggle('hidden');
                            });
                        });
                        Array.from(document.querySelectorAll('mfc line > label')).forEach(function (label) {
                            label.onclick = function (ev) {
                                if (label.textContent !== 'Tags') {
                                    navigator.clipboard.writeText(label.nextElementSibling.textContent);
                                }
                                ;
                            };
                        });
                        Array.from(document.querySelectorAll('mfc line > data')).forEach(function (dataField) {
                            dataField.onclick = function (ev) {
                                dataField.parentElement.classList.toggle('hidden');
                            };
                        });
                        Array.from(document.querySelectorAll('mfc line > stores > a')).forEach(function (store) {
                            var img = store.querySelector('img');
                            var keyword = store.parentElement.parentElement.querySelector('data').textContent;
                            switch (img.alt) {
                                case 'amiami icon':
                                    store.href = "https://www.amiami.com/eng/search/list/?s_keywords=".concat(encodeURI(keyword), "&s_cate_tag=1&s_sortkey=preowned&s_st_condition_flg=1");
                                    break;
                                case 'buyee icon':
                                    store.href = "https://buyee.jp/item/search/query/".concat(encodeURI(keyword), "/category/25888?store=1&aucminprice=0&aucmaxprice=3000&item_status=1&suggest=1");
                                    break;
                                case 'ninoma icon':
                                    store.href = "https://ninoma.com/search?filter.p.product_type=Figure&filter.v.availability=1&q=".concat(encodeURI(keyword));
                                    break;
                                default: break;
                            }
                        });
                        ;
                        makeMfcSearchWork();
                        return [2 /*return*/];
                    });
                });
            }
            var content;
            return __generator(this, function (_a) {
                content = JSON.parse(JSON.stringify(this.json));
                ;
                ;
                ;
                loadShortcuts();
                loadGamecards();
                loadHeaders();
                loadMfc();
                return [2 /*return*/];
            });
        });
    };
    ;
    return CloudStorageData;
}());
;
var ExternalData = /** @class */ (function () {
    function ExternalData() {
    }
    ExternalData.addRetroAchievementsAwards = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, retroAchievements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(server, "retroAchievements/pt-BR/")).then(function (res) { return res.json(); })];
                    case 1:
                        data = _a.sent();
                        retroAchievements = document.querySelector('#gaming retroachievements');
                        new TemplateConstructor(document.querySelector('#ra-template'), [data]).insert(retroAchievements);
                        data.awards.filter(function (award) { return award.allData.some(function (data) {
                            return data.awardType.includes('Platinado');
                        }); }).forEach(function (award) {
                            document.querySelector('#ra-award-' + award.awardData).classList.add('mastered');
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    ExternalData.scrapeMyAnimeList = function () {
        return __awaiter(this, void 0, void 0, function () {
            function scrapeDataFromMAL(options) {
                return __awaiter(this, void 0, void 0, function () {
                    var animeData, mangaData, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch("".concat(server, "myanimelist/animelist?username=HikariMontgomery&offset=").concat(options.offset, "&limit=").concat(options.limit))
                                    .then(function (response) { return response.json(); })];
                            case 1:
                                animeData = (_a.sent())['myanimelist'];
                                return [4 /*yield*/, fetch("".concat(server, "myanimelist/mangalist?username=HikariMontgomery&offset=").concat(options.offset, "&limit=").concat(options.limit))
                                        .then(function (response) { return response.json(); })];
                            case 2:
                                mangaData = (_a.sent())['myanimelist'];
                                response = [];
                                animeData.forEach(function (anime) { return response.push(anime); });
                                mangaData.forEach(function (manga) { return response.push(manga); });
                                return [2 /*return*/, response];
                        }
                    });
                });
            }
            var _this = this;
            return __generator(this, function (_a) {
                ;
                scrapeDataFromMAL({ offset: 0, limit: 20 }).then(function (res) {
                    _this.MALData = res;
                    var malContainer = document.querySelector('#my-anime-list my-anime-list');
                    new TemplateConstructor(document.querySelector('#myanimelist-template'), res.sort(function (a, b) { return -new Date(a.updated_at).getTime() + new Date(b.updated_at).getTime(); })).insert(malContainer);
                });
                return [2 /*return*/];
            });
        });
    };
    ;
    return ExternalData;
}());
;
var PageBehaviour = /** @class */ (function () {
    function PageBehaviour() {
    }
    PageBehaviour.stopImageDrag = function () {
        var images = document.getElementsByTagName('img');
        Array.from(images).forEach(function (img) {
            img.setAttribute('draggable', 'false');
        });
    };
    ;
    PageBehaviour.openLinksInNewTab = function () {
        var shortcuts = document.querySelectorAll('.shortcut-item');
        for (var _i = 0, _a = Array.from(shortcuts); _i < _a.length; _i++) {
            var element = _a[_i];
            if (!element.href)
                continue;
            if (element.href.match(/docs\.google\.com/) == null || mobile) {
                element.target = '_blank';
            }
        }
        ;
        var gamecards = document.querySelectorAll('.gamecard');
        gamecards.forEach(function (element) {
            var child = element.firstElementChild;
            if (child.href.match(/docs\.google\.com/) == null || mobile) {
                child.target = '_blank';
            }
        });
    };
    ;
    return PageBehaviour;
}());
;
window.addEventListener('load', onLoadFunctions, true);
function onLoadFunctions(ev) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    UserInterface.makeSwitchesSlide();
                    UserInterface.nightModeToggle();
                    UserInterface.dragPopUps();
                    UserInterface.setPopUpDefaultValues();
                    UserInterface.resetPopUpsOnOpen();
                    UserInterface.collapseHeader();
                    UserInterface.changeHomeView();
                    UserInterface.refreshData();
                    return [4 /*yield*/, CustomFunctions.sleep(300)];
                case 1:
                    _a.sent();
                    PageBuilding.createLoaders(12);
                    PageBuilding.putVersionOnFooter();
                    PageBuilding.formatPopUps();
                    PageBuilding.createSkeletons();
                    ExternalSearch.redditSearchTrigger();
                    ExternalSearch.wikipediaSearchTrigger();
                    if (!((window.location.hostname === 'statisticshock.github.io') ? true : toggleExternalDataLoad)) return [3 /*break*/, 4];
                    return [4 /*yield*/, CloudStorageData.load()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            Promise.all([
                                CloudStorageData.loadContentFromJson(),
                                ExternalData.scrapeMyAnimeList(),
                                ExternalData.addRetroAchievementsAwards(),
                            ]).then(function (res) {
                                PageBuilding.deleteSkeletons(['#shortcuts ', 'header ', '#my-anime-list my-anime-list', 'gaming-container ', '#my-figure-collection ']);
                            }),
                        ])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    ;
                    PageBehaviour.openLinksInNewTab();
                    PageBehaviour.stopImageDrag();
                    setTimeout(function () { return window.dispatchEvent(new Event('resize')); }, 250);
                    return [2 /*return*/];
            }
        });
    });
}
;
window.addEventListener('resize', onResizeFunctions, true);
function onResizeFunctions(ev) {
    //
}
;
window.addEventListener('scroll', onScrollFunctions, true);
function onScrollFunctions(ev) {
    //
}
;
