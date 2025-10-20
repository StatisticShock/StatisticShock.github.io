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
import { server } from './server-url.js';
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
    PageBuilding.resizeAside = function (counter) {
        var _this = this;
        var aside = document.querySelector('aside');
        var shortcuts = document.querySelector('#shortcuts');
        var card = aside.querySelector('.card');
        aside.style.height = 'fit-content';
        shortcuts.style.height = 'fit-content';
        card.style.height = 'fit-content';
        if (parseFloat(getComputedStyle(aside).height) < parseFloat(getComputedStyle(shortcuts).height)) {
            aside.style.height = (shortcuts.offsetHeight + 10) + 'px';
        }
        else {
            shortcuts.style.height = aside.offsetHeight + 'px';
        }
        ;
        aside.style.height = aside.offsetHeight + 'px';
        shortcuts.style.height = shortcuts.offsetHeight + 'px';
        card.style.height = card.offsetHeight + 'px';
        if (counter == 0) {
            setTimeout(function () {
                _this.resizeAside(1);
            }, 750);
        }
        ;
    };
    ;
    PageBuilding.adjustGamecard = function () {
        var gameCardContainers = document.querySelectorAll('.gamecard-container');
        gameCardContainers.forEach(function (gamecardContainer) {
            var childCount = Math.max(gamecardContainer.children.length, 2).toString();
            gamecardContainer.style.setProperty('--gamecard-count', childCount);
        });
        var gameCardText = document.querySelectorAll('.gamecard-text > span p');
        gameCardText.forEach(function (element) {
            element.style.marginLeft = -(element.offsetWidth / 2 - 20) + 'px';
        });
    };
    ;
    PageBuilding.adjustGamecardText = function (counter) {
        var gameCardSpan = document.querySelectorAll('.gamecard > a > span');
        gameCardSpan.forEach(function (element) {
            var parentElement = element.parentElement;
            var div = parentElement.firstChild;
            if (div.scrollWidth > parentElement.offsetWidth) {
                element.style.transform = 'rotate(-90deg)';
            }
            else {
                element.style.transform = '';
            }
        });
        if (counter == 0) {
            setTimeout(this.adjustGamecardText, 100);
        }
        ;
    };
    ;
    PageBuilding.putVersionOnFooter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version, footer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(server, "version")).then(function (res) { return res.json(); })];
                    case 1:
                        version = _a.sent();
                        footer = document.querySelector('footer');
                        footer.innerHTML += "<p><small>ver. ".concat(version.page, "</small></p>");
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
            var shortcuts = document.querySelector('#shortcuts');
            var maxIcons = Math.floor((parseFloat(getComputedStyle(shortcuts).width)) / (Math.min(50, document.documentElement.clientWidth * 0.2) + 30));
            var atalhos = Array.from(shortcuts.querySelectorAll('h2')).filter(function (h2) { return h2.textContent.trim() === 'Atalhos'; })[0];
            var ra = Array.from(shortcuts.querySelectorAll('h2')).filter(function (h2) { return h2.textContent.trim() === 'RetroAchievements'; })[0];
            var row = Array(maxIcons).fill({ joker: skeleton, alt: '. . .' });
            new TemplateConstructor(document.querySelector('#shortcuts-template').content, Array(2).fill({ jokerContainer: container, joker: skeleton, children: row })).insert(shortcuts, 'after', atalhos);
            new TemplateConstructor(document.querySelector('#shortcuts-template').content, Array(1).fill({ jokerContainer: container, joker: skeleton, children: row })).insert(shortcuts, 'after', ra);
            shortcuts.querySelectorAll('img').forEach(function (img) { return img.src = './icon/blank.svg'; });
        }
        ;
        function createMfcSkeletons() {
            var cards = document.querySelectorAll('aside .card .mfc-card');
            var maxColumns = !mobile ? 4 : 2;
            var maxRows = Math.ceil(cards[0].parentElement.offsetHeight / (parseFloat(getComputedStyle(cards[0]).width) / maxColumns + 10));
            cards.forEach(function (card) {
                new TemplateConstructor(document.querySelector('#mfc-item-template').content, Array(maxColumns * maxRows).fill({ joker: skeleton })).insert(card);
                card.querySelectorAll('.mfc').forEach(function (mfc) {
                    mfc.removeAttribute('href');
                    mfc.firstElementChild.remove();
                });
            });
        }
        createShortcutSkeletons();
        createMfcSkeletons();
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
    UserInterface.expandAside = function () {
        var asideShownName = 'asideIsShown';
        if (localStorage.getItem(asideShownName) === null)
            localStorage.setItem(asideShownName, 'true');
        var aside = document.querySelector('aside');
        var div = aside.querySelector('.button-bar');
        var bttn = aside.querySelector('#expand-button');
        var span = bttn.querySelector('span');
        var shortcuts = document.querySelector('#shortcuts');
        var flexContainer = document.querySelector('.flex-container');
        var input = aside.querySelector('input');
        if (localStorage.getItem(asideShownName) !== 'false')
            aside.classList.remove('hidden');
        bttn.onclick = function (ev) {
            if (!portrait) {
                if (!aside.classList.contains('hidden')) {
                    aside.classList.add('hidden');
                    localStorage.setItem(asideShownName, 'false');
                }
                else {
                    aside.classList.remove('hidden');
                    localStorage.setItem(asideShownName, 'true');
                }
                ;
            }
            else {
                if (!aside.classList.contains('hidden')) {
                    aside.classList.add('hidden');
                    localStorage.setItem(asideShownName, 'false');
                }
                else {
                    aside.classList.remove('hidden');
                    localStorage.setItem(asideShownName, 'true');
                }
                ;
            }
            ;
        };
        div.onclick = function (ev) {
            bttn.click();
        };
        span.onclick = function (ev) {
            bttn.click();
        };
    };
    ;
    UserInterface.makeAsideButtonFollow = function () {
        if (mobile)
            return;
        var aside = document.querySelector('aside');
        var div = aside.querySelector('.button-bar');
        var button = div.querySelector('#expand-button');
        var buttonHeight = button.offsetHeight;
        div.addEventListener('mousemove', function (ev) {
            var target = ev.target;
            if (CustomFunctions.isParent(target, button))
                return;
            button.style.top = (ev.layerY) + 'px';
        });
    };
    ;
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
                    }
                    else {
                        localStorage.setItem(darkOrLightTheme, 'light');
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
    UserInterface.resizeHeader = function () {
        var header = document.querySelector('header > div');
        var pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = Math.min(window.scrollY / (pageHeight * 0.1), 1);
        header.style.setProperty('--scroll-ratio', ratio.toString());
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
    UserInterface.showPopUps = function () {
        var _this = this;
        var popUpShortcuts = [];
        document.querySelectorAll('form.pop-up').forEach(function (form) {
            if (form.classList.length < 2)
                return;
            var otherClass = Array.from(form.classList).filter(function (className) { return className !== 'pop-up'; })[0];
            var openBttn = Array.from(document.querySelectorAll(".".concat(otherClass))).filter(function (element) { return element.classList.contains('pop-up-open'); })[0];
            popUpShortcuts.push({ button: openBttn, popUpContainer: form });
        });
        popUpShortcuts.forEach(function (object) {
            var popUpClass = document.querySelectorAll('.pop-up');
            var floatingLabelElement = object.popUpContainer.querySelectorAll('.floating-label');
            object.button.onclick = function () {
                var display = object.popUpContainer.style.display;
                if ((display == '') || (display == 'none')) {
                    object.popUpContainer.style.display = 'block';
                }
                else if (!(object.popUpContainer.classList.contains('create-shortcut') && object.button.classList.contains('create-shortcut') && !(object.button.id.replace('-button', '-item') === object.popUpContainer.getAttribute('x')))) {
                    object.popUpContainer.style.display = 'none'; //Makes the popUp disappear
                }
                ;
                popUpClass.forEach(function (element) {
                    if (element != object.popUpContainer) {
                        element.style.display = 'none';
                    }
                    ;
                });
                setTimeout(function () {
                    floatingLabelElement.forEach(function (label) {
                        var parent = label.parentElement;
                        var siblings = Array.from(parent.children);
                        var input = siblings[siblings.indexOf(label) - 1];
                        var rect = object.popUpContainer.getBoundingClientRect();
                        var inputRect = input.getBoundingClientRect();
                        var left = inputRect.left - rect.left;
                        label.style.left = '5px';
                        input.placeholder ? input.placeholder = input.placeholder : input.placeholder = ' ';
                    });
                }, 10);
            };
            object.popUpContainer.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    var okButton = object.popUpContainer.querySelector('.ok-button');
                    okButton.click();
                }
            });
        });
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
                    var shortcuts, h2, shortcutsOnMobile;
                    return __generator(this, function (_a) {
                        shortcuts = document.querySelector('section#shortcuts');
                        h2 = Array.from(shortcuts.querySelectorAll('h2')).filter(function (heading) { return heading.textContent.trim() === 'Atalhos'; })[0];
                        shortcutsOnMobile = content.shortcuts.map(function (folder) {
                            var folderClone = structuredClone(folder);
                            folderClone.children = folderClone.children.filter(function (child) {
                                return child.showOnMobile;
                            });
                            return folderClone;
                        }).filter(function (folder) {
                            return folder.children.length > 0;
                        });
                        new TemplateConstructor(document.querySelector('template#shortcuts-template').content, mobile ? shortcutsOnMobile : content.shortcuts).insert(shortcuts, 'after', h2);
                        return [2 /*return*/];
                    });
                });
            }
            function loadGamecards() {
                return __awaiter(this, void 0, void 0, function () {
                    var shortcuts, h2, _i, _a, gamecard, gamecardAnchor, outerGamecard, _b, _c, child, _d, _e, css;
                    return __generator(this, function (_f) {
                        shortcuts = document.querySelector('section#shortcuts');
                        h2 = Array.from(shortcuts.querySelectorAll('h2')).filter(function (heading) { return heading.textContent.trim() === 'Gaming'; })[0];
                        new TemplateConstructor(document.querySelector('template#gamecard-template').content, content.gamecards).insert(shortcuts, 'after', h2);
                        for (_i = 0, _a = content.gamecards; _i < _a.length; _i++) {
                            gamecard = _a[_i];
                            gamecardAnchor = document.querySelector('#' + gamecard.id + ' a');
                            outerGamecard = document.querySelector('div#' + gamecard.id + ' .gamecard-outercard');
                            outerGamecard.style.setProperty('--gamecard-count', Math.max(gamecard.children.length, 2).toString());
                            for (_b = 0, _c = gamecard.children; _b < _c.length; _b++) {
                                child = _c[_b];
                                for (_d = 0, _e = child.img_css; _d < _e.length; _d++) {
                                    css = _e[_d];
                                    gamecardAnchor.style.setProperty(css.attribute, css.value);
                                }
                                ;
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
            var content;
            return __generator(this, function (_a) {
                content = JSON.parse(JSON.stringify(this.json));
                ;
                ;
                ;
                loadShortcuts();
                loadGamecards();
                loadHeaders();
                return [2 /*return*/];
            });
        });
    };
    ;
    CloudStorageData.addMfcImages = function () {
        return __awaiter(this, void 0, void 0, function () {
            function searchFigure() {
                var regEx = new RegExp(JSON.stringify(input.value).slice(1, -1), 'gi');
                console.info("A express\u00E3o procurada \u00E9 ".concat(regEx));
                var figuresThatMatch = [];
                var _loop_1 = function (figure) {
                    if (Object.keys(figure).some(function (key) { return regEx.test(figure[key]); })) {
                        figuresThatMatch.push(figure);
                    }
                    ;
                };
                for (var _i = 0, figureDict_1 = figureDict; _i < figureDict_1.length; _i++) {
                    var figure = figureDict_1[_i];
                    _loop_1(figure);
                }
                ;
                console.table(figuresThatMatch, ['id', 'title']);
                var _loop_2 = function (figure) {
                    if (figuresThatMatch.some(function (figureThatMatch) { return figure.id === figureThatMatch.id; })) {
                        document.querySelector('#mfc-' + figure.id).style.display = 'block';
                    }
                    else {
                        document.querySelector('#mfc-' + figure.id).style.display = 'none';
                    }
                };
                for (var _a = 0, figureDict_2 = figureDict; _a < figureDict_2.length; _a++) {
                    var figure = figureDict_2[_a];
                    _loop_2(figure);
                }
                ;
                loader.style.display = 'none';
            }
            var input, wished, owned, wishedCard, ownedCard, template, figureDict, loader, timeout;
            var _this = this;
            return __generator(this, function (_a) {
                input = document.querySelector('#search-bar');
                input.value = '';
                wished = CustomFunctions.shuffle(this.json.mfc.filter(function (figure) { return figure.type === 'Wished'; }));
                owned = CustomFunctions.shuffle(this.json.mfc.filter(function (figure) { return figure.type !== 'Wished'; }));
                wishedCard = document.querySelector('.flex-container aside .card #wished');
                ownedCard = document.querySelector('.flex-container aside .card #owned-ordered');
                template = document.querySelector('#mfc-item-template').content;
                new TemplateConstructor(template, wished).insert(wishedCard);
                new TemplateConstructor(template, owned).insert(ownedCard);
                document.querySelectorAll('.mfc').forEach(function (item) {
                    try {
                        item.classList.add(CustomFunctions.normalize(_this.json.mfc.filter(function (figure) { return 'mfc-' + figure.id === item.id; })[0].category.replace('/', '-')));
                    }
                    catch (err) { }
                });
                figureDict = [];
                this.json.mfc.forEach(function (figure) {
                    var newObj = {};
                    for (var _i = 0, _a = Object.keys(figure); _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (figure[key] instanceof Array) {
                            newObj[key] = figure[key].join(', ');
                        }
                        else {
                            newObj[key] = figure[key];
                        }
                        ;
                    }
                    ;
                    figureDict.push(newObj);
                });
                loader = document.querySelector('aside > .loader');
                input.addEventListener('keyup', function (ev) {
                    loader.style.display = 'block';
                    if (timeout)
                        clearTimeout(timeout);
                    timeout = setTimeout(searchFigure, 2000);
                });
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
            var data, shortcuts, h2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(server, "retroAchievements/pt-BR/")).then(function (res) { return res.json(); })];
                    case 1:
                        data = _a.sent();
                        shortcuts = document.querySelector('#shortcuts');
                        h2 = Array.from(shortcuts.querySelectorAll('h2')).filter(function (h2) { return h2.textContent.trim() === 'RetroAchievements'; })[0];
                        new TemplateConstructor(document.querySelector('#ra-template').content, [data]).insert(shortcuts, 'after', h2);
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
            function scrapeDataFromMAL(offset) {
                return __awaiter(this, void 0, void 0, function () {
                    var animeData, animeDataData, mangaData, mangaDataData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch("".concat(server, "myanimelist/animelist?username=HikariMontgomery&offset=").concat(offset))
                                    .then(function (response) { return response.json(); })];
                            case 1:
                                animeData = _a.sent();
                                animeDataData = animeData.data.filter(function (entry) { return entry.node.nsfw === 'white'; }).slice(0, 10);
                                return [4 /*yield*/, fetch("".concat(server, "myanimelist/mangalist?username=HikariMontgomery&offset=").concat(offset))
                                        .then(function (response) { return response.json(); })];
                            case 2:
                                mangaData = _a.sent();
                                mangaDataData = mangaData.data.filter(function (entry) { return entry.node.nsfw === 'white'; }).slice(0, 10);
                                return [2 /*return*/, [animeDataData, mangaDataData]];
                        }
                    });
                });
            }
            function createCards(entries, card, insertBefore) {
                var firstCard = card.firstElementChild;
                entries.forEach(function (entry) {
                    var typeOfMedia = Object.keys(entry.list_status).includes('is_rewatching') ? 'anime' : 'manga';
                    var img = new Image();
                    img.src = entry.node.main_picture.large;
                    var a = document.createElement('a');
                    a.appendChild(img);
                    a.target = '_blank';
                    a.href = "https://myanimelist.net/".concat(typeOfMedia, "/").concat(entry.node.id, "/");
                    var div = document.createElement('div');
                    div.classList.add('paragraph-container');
                    var bold = document.createElement('b');
                    bold.innerHTML = "#".concat(entry.node.rank === undefined ? 'N/A' : entry.node.rank);
                    var span = document.createElement('span');
                    span.innerHTML = "<p><span>T\u00EDtulo&nbsp;</span><span>".concat(entry.node.title, "</span></p>");
                    var p2 = document.createElement('p');
                    if ('num_episodes_watched' in entry.list_status && 'num_episodes' in entry.node) {
                        p2.innerHTML = "<span>Assistidos&nbsp;</span><span>".concat(entry.list_status.num_episodes_watched, "/").concat(entry.node.num_episodes === 0 ? '??' : entry.node.num_episodes, "</span>");
                    }
                    else if ('num_chapters_read' in entry.list_status && 'num_chapters' in entry.node) {
                        p2.innerHTML = "<span>Lidos&nbsp;</span><span>".concat(entry.list_status.num_chapters_read, "/").concat(entry.node.num_chapters === 0 ? '??' : entry.node.num_chapters, "</span>");
                    }
                    ;
                    var p3 = document.createElement('p');
                    var genres = [];
                    for (var _i = 0, _a = entry.node.genres; _i < _a.length; _i++) {
                        var genre = _a[_i];
                        genres.push(genre.name);
                    }
                    p3.innerHTML = "<span>G\u00EAneros&nbsp;</span><span>".concat(genres.join(', '), "</span>");
                    var p4 = document.createElement('p');
                    p4.innerHTML = "<span>Status</span><span>".concat(CustomFunctions.vlookup(entry.list_status.status, translations, translations[0].indexOf('pt-BR') + 1), "</span>");
                    div.style.display = mobile ? '' : 'none';
                    img.style.opacity = mobile ? '0.25' : '1';
                    span.appendChild(p2);
                    span.appendChild(p3);
                    span.appendChild(p4);
                    if (entry.list_status.score !== 0) {
                        var p4_1 = document.createElement('p');
                        p4_1.innerHTML = "<span>Pontua\u00E7\u00E3o&nbsp;</span><span>".concat('⭐'.repeat(entry.list_status.score), "\n(").concat(entry.list_status.score, "/10)</span>");
                        span.appendChild(p4_1);
                    }
                    div.appendChild(bold);
                    div.appendChild(span);
                    a.appendChild(div);
                    if (insertBefore) {
                        card.insertBefore(a, firstCard);
                    }
                    else {
                        card.appendChild(a);
                    }
                    if (!mobile) {
                        a.addEventListener('mouseenter', showEntryData, true);
                        a.addEventListener('touchstart', showEntryData, true);
                        a.addEventListener('mouseleave', hideEntryData, true);
                        a.addEventListener('touchend', hideEntryData, true);
                    }
                    ;
                    function showEntryData() {
                        div.style.display = '';
                        img.style.opacity = '0.25';
                    }
                    ;
                    function hideEntryData() {
                        div.style.display = 'none';
                        img.style.opacity = '1';
                    }
                    ;
                });
            }
            function setDefaultScroll() {
                var itemWidth = animeCard.querySelector('a').getBoundingClientRect().width;
                var gap = parseFloat(getComputedStyle(animeCard).gap);
                animeCard.scrollTo((itemWidth + gap) * 10, 0);
                mangaCard.scrollTo((itemWidth + gap) * 10, 0);
            }
            function makeCarouselSlide(entries, card) {
                function getClosestAnchor(container) {
                    var rect = container.getBoundingClientRect();
                    var center = rect.left + rect.width / 2;
                    var anchors = container.querySelectorAll('a');
                    var closestAnchor = null;
                    var closestDistance = Infinity;
                    anchors.forEach(function (anchor) {
                        var anchorRect = anchor.getBoundingClientRect();
                        var anchorCenter = anchorRect.left + anchorRect.width / 2;
                        var distance = Math.abs(center - anchorCenter);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestAnchor = anchor;
                        }
                    });
                    return closestAnchor;
                }
                ;
                var navBttns = card.parentElement.querySelectorAll('.nav-button');
                navBttns.forEach(function (bttn) {
                    bttn.addEventListener('click', scrollFunction);
                    function scrollFunction(e) {
                        var target = e.target;
                        var direction = target.closest('button').classList.contains('left') ? 'left' : 'right';
                        var anchor = getClosestAnchor(card);
                        var anchors = card.querySelectorAll('a');
                        var width = card.scrollWidth;
                        var anchorWidth = parseFloat(getComputedStyle(anchor).width);
                        var gap = parseFloat(getComputedStyle(card).gap);
                        if (direction === 'left') {
                            card.scrollBy({ left: -width / anchors.length, behavior: 'smooth' });
                            if (anchor === anchors[5] || anchor === anchors[4]) {
                                var frstChild = card.firstElementChild;
                                var previousOffset = frstChild.offsetLeft;
                                createCards(entries, card, true);
                                var newOffset = frstChild.offsetLeft;
                                card.style.scrollBehavior = 'auto';
                                card.scrollLeft += (newOffset - previousOffset);
                                card.scrollBy({ left: -width / anchors.length, behavior: 'smooth' });
                                card.style.scrollBehavior = 'smooth';
                                var allAnchors = card.querySelectorAll('a');
                                var anchorsToRemove = Array.from(allAnchors).slice(allAnchors.length - 10, allAnchors.length);
                                anchorsToRemove.forEach(function (anchorToRemove) {
                                    anchorToRemove.remove();
                                });
                            }
                            ;
                        }
                        else if (direction === 'right') {
                            card.scrollBy({ left: width / anchors.length, behavior: 'smooth' });
                            if (anchor === anchors[anchors.length - 5] || anchor === anchors[anchors.length - 4]) {
                                var frstChild = card.lastElementChild;
                                var previousOffset = frstChild.offsetLeft;
                                createCards(entries, card, false);
                                var allAnchors = card.querySelectorAll('a');
                                var anchorsToRemove = Array.from(allAnchors).slice(0, 10);
                                anchorsToRemove.forEach(function (anchorToRemove) {
                                    anchorToRemove.remove();
                                });
                                var newOffset = frstChild.offsetLeft;
                                card.style.scrollBehavior = 'auto';
                                card.scrollLeft += (newOffset - previousOffset);
                                card.scrollBy({ left: width / anchors.length, behavior: 'smooth' });
                                card.style.scrollBehavior = 'smooth';
                            }
                            ;
                        }
                        ;
                    }
                    ;
                });
            }
            function selectOnlyTheCurrentImage() {
                if (!mobile)
                    return;
                else {
                    [animeCard, mangaCard].forEach(function (card) {
                        var entries = card.querySelectorAll('a');
                        var navBttns = card.parentElement.querySelectorAll('.nav-button');
                        entries.forEach(function (entry) {
                            entry.addEventListener('click', function (e) {
                                var collision = false;
                                navBttns.forEach(function (bttn) {
                                    if (CustomFunctions.doesItCollide(entry, bttn)) {
                                        collision = true;
                                    }
                                    ;
                                });
                                if (collision) {
                                    e.preventDefault();
                                }
                            });
                        });
                    });
                }
                ;
            }
            var translations, output, animeCard, mangaCard;
            return __generator(this, function (_a) {
                ;
                translations = [
                    ['api', 'en-US', 'pt-BR'],
                    ['completed', 'Completed', 'Finalizado'],
                    ['reading', 'Reading', 'Lendo'],
                    ['watching', 'Watching', 'Assistindo'],
                    ['plan_to_read', 'Plan to read', 'Planeja ler'],
                    ['plan_to_watch', 'Plan to watch', 'Planeja assistir'],
                    ['dropped', 'Dropped', 'Abandonado'],
                    ['on_hold', 'On hold', 'Em espera']
                ];
                output = scrapeDataFromMAL(0);
                animeCard = document.querySelector('#my-anime-list .inner-card.anime');
                mangaCard = document.querySelector('#my-anime-list .inner-card.manga');
                output.then(function (res) {
                    for (var i = 0; i < 2; i++) { //Adds two of each anime/manga entry to make it look infinite
                        createCards(res[0], animeCard);
                        createCards(res[1], mangaCard);
                        if (i === 1) {
                            makeCarouselSlide(res[0], animeCard);
                            makeCarouselSlide(res[1], mangaCard);
                        }
                    }
                    ;
                    setDefaultScroll();
                    selectOnlyTheCurrentImage();
                }).then(function (res) {
                    var loaders = document.querySelectorAll('#my-anime-list .loader');
                    var innerCards = document.querySelectorAll('#my-anime-list .inner-card');
                    loaders.forEach(function (loader) {
                        loader.style.display = 'none';
                    });
                    innerCards.forEach(function (innerCard) {
                        innerCard.style.opacity = '1';
                    });
                });
                ;
                ;
                ;
                ;
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
    PageBehaviour.redirectLinksToEdge = function () {
        if (mobile)
            return;
        var links = document.querySelectorAll('a');
        links.forEach(function (link) {
            var hyperlink = link.href;
            if (hyperlink.match(/docs\.google\.com/)) {
                link.href = 'microsoft-edge:' + hyperlink;
                link.target = '';
            }
        });
    };
    ;
    PageBehaviour.redirectToUpdatePage = function () {
        var anchors = document.querySelectorAll('a.update-link');
        var url = window.location.href;
        anchors.forEach(function (anchor) {
            anchor.addEventListener('click', function (ev) {
                var _a;
                ev.preventDefault();
                var route = anchor.href.replace(url, '');
                var parts = route.split('/');
                window.location.href = "".concat(url, "update.html?page=").concat(parts[1], "&id=").concat((_a = parts[2]) !== null && _a !== void 0 ? _a : '0');
            });
        });
    };
    return PageBehaviour;
}());
;
window.addEventListener('load', onLoadFunctions, true);
function onLoadFunctions(ev) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    UserInterface.expandAside();
                    UserInterface.makeAsideButtonFollow();
                    UserInterface.makeSwitchesSlide();
                    UserInterface.nightModeToggle();
                    UserInterface.dragPopUps();
                    UserInterface.setPopUpDefaultValues();
                    UserInterface.resetPopUpsOnOpen();
                    UserInterface.showPopUps();
                    UserInterface.resizeHeader();
                    UserInterface.collapseHeader();
                    return [4 /*yield*/, CustomFunctions.sleep(300)];
                case 1:
                    _a.sent();
                    PageBuilding.createLoaders(12);
                    PageBuilding.adjustGamecard();
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
                                CloudStorageData.addMfcImages(),
                                ExternalData.scrapeMyAnimeList(),
                                ExternalData.addRetroAchievementsAwards(),
                            ]).then(function (res) {
                                PageBuilding.deleteSkeletons(['#shortcuts ', 'header ']);
                            }),
                        ])];
                case 3:
                    _a.sent();
                    console.clear();
                    _a.label = 4;
                case 4:
                    ;
                    PageBehaviour.openLinksInNewTab();
                    PageBehaviour.redirectLinksToEdge();
                    PageBehaviour.stopImageDrag();
                    PageBehaviour.redirectToUpdatePage();
                    setTimeout(function () { return window.dispatchEvent(new Event('resize')); }, 250);
                    return [2 /*return*/];
            }
        });
    });
}
;
window.addEventListener('resize', onResizeFunctions, true);
function onResizeFunctions(ev) {
    PageBuilding.resizeAside();
    UserInterface.resizeHeader();
}
;
window.addEventListener('scroll', onScrollFunctions, true);
function onScrollFunctions(ev) {
    UserInterface.resizeHeader();
}
;
