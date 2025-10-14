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
import PageBuildingImport from './shared.js';
var ua = navigator.userAgent || navigator.vendor || window.opera;
var mobile = /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(ua.toLowerCase());
var portrait = (window.innerWidth < window.innerHeight);
console.log("Running server at ".concat(server));
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
    PageBuilding.figuresSitDown = function () {
        var twoB = document.getElementById('twoB');
        var twoB_Ass = Math.floor(parseFloat(getComputedStyle(twoB).height) * 493 / 920);
        var twoB_Pussy = Math.floor(parseFloat(getComputedStyle(twoB).width) * 182 / 356);
        var aside = document.querySelector('aside');
        twoB.style.top = (-twoB_Ass) + 'px';
        twoB.style.right = (!mobile) ? (aside.offsetWidth / 2 - twoB_Pussy) + 'px' : '5%';
        var ohto = document.getElementById('ohto');
        var ohto_panties = getComputedStyle(ohto).height;
        var ohto_mouth = Math.floor(parseFloat(getComputedStyle(ohto).width) / 2);
        ohto.style.top = '-' + ohto_panties;
        ohto.style.left = getComputedStyle(twoB).right;
        var toggleSwitch = document.getElementById('mfc-switch');
        toggleSwitch.style.width = twoB.style.width;
        toggleSwitch.style.right = parseFloat(twoB.style.right) + twoB.offsetWidth / 2 + 'px';
        toggleSwitch.style.transform = 'translate(50%, 0)';
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
    PageBuilding.removeHoverEffectsOnMobile = function () {
        if (!mobile)
            document.querySelector('body').classList.add('has-hover');
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
                    span.style.transform = "rotate(180deg) translate(0%,-10%)";
                    aside.classList.add('hidden');
                    localStorage.setItem(asideShownName, 'false');
                }
                else {
                    span.style.transform = "rotate(0deg) translate(0%,-10%)";
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
        var label = document.querySelector('#night-mode-toggle');
        var input = label.querySelector('input');
        var themeStyleName = 'darkOrLightTheme';
        if (localStorage.getItem(themeStyleName) === null) {
            var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            input.checked = isDark;
        }
        else if (localStorage.getItem(themeStyleName) === 'dark') {
            input.checked = true;
        }
        else if (localStorage.getItem(themeStyleName) === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        ;
        input.addEventListener('change', function (ev) {
            setTimeout(function () {
                if (input.checked) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem(themeStyleName, 'dark');
                }
                else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem(themeStyleName, 'light');
                }
                ;
            }, 100);
        });
    };
    ;
    UserInterface.resizeHeader = function () {
        var header = document.querySelector('header');
        var nav = document.querySelector('nav');
        var height = parseFloat(getComputedStyle(header).height);
        var windowWidth = document.documentElement.scrollWidth;
        var scrollY = window.scrollY;
        var ohtoHeight = parseFloat(getComputedStyle(document.querySelector('#ohto')).height);
        header.style.aspectRatio = Math.min(windowWidth / ohtoHeight, Math.max(5, (5 * ((scrollY + height) / height)))) + '';
        var newHeight = parseFloat(getComputedStyle(header).height);
        nav.style.top = newHeight + 'px';
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
    UserInterface.makeButtonFromAsideFollowHeader = function () {
        if (!portrait)
            return;
        var height = document.querySelector('header').offsetHeight;
        var button = document.querySelector('aside .button-bar');
        var bubble = button.querySelector('#expand-button');
    };
    ;
    return UserInterface;
}());
export { UserInterface };
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
export { ExternalSearch };
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
                    var targetedNode, shortcutsNode, _i, _a, section, container, p, div, _b, _c, child, a, img;
                    return __generator(this, function (_d) {
                        targetedNode = document.querySelectorAll('#shortcuts h2')[1];
                        shortcutsNode = document.querySelector('#shortcuts');
                        for (_i = 0, _a = content.shortcuts.sort(function (a, b) { return a.index - b.index; }); _i < _a.length; _i++) {
                            section = _a[_i];
                            container = document.createElement('section');
                            container.id = section.id;
                            p = document.createElement('p');
                            p.innerHTML = section.title;
                            div = document.createElement('div');
                            div.classList.add('grid-container');
                            for (_b = 0, _c = section.children.sort(function (a, b) { return a.index - b.index; }); _b < _c.length; _b++) {
                                child = _c[_b];
                                if (mobile && !child.showOnMobile)
                                    continue;
                                a = document.createElement('a');
                                a.classList.add('shortcut-item');
                                a.href = child.href;
                                a.setAttribute('alt', child.alt);
                                a.id = child.id;
                                img = document.createElement('img');
                                img.src = child.img;
                                a.appendChild(img);
                                div.appendChild(a);
                            }
                            ;
                            if (div.childElementCount > 0) {
                                container.appendChild(p);
                                container.appendChild(div);
                                shortcutsNode.insertBefore(container, targetedNode);
                            }
                            ;
                        }
                        ;
                        return [2 /*return*/];
                    });
                });
            }
            function loadGamecards() {
                return __awaiter(this, void 0, void 0, function () {
                    var targetedNode, _i, _a, gamecardData, outerGamecard, _b, _c, game, gameStyleString, _d, _e, cssAtttribute;
                    return __generator(this, function (_f) {
                        targetedNode = document.querySelector('#shortcuts #gaming');
                        for (_i = 0, _a = content.gamecards.sort(function (a, b) { return a.position - b.position; }); _i < _a.length; _i++) {
                            gamecardData = _a[_i];
                            outerGamecard = document.createElement('div');
                            outerGamecard.id = gamecardData.id;
                            outerGamecard.classList.add('gamecard-text');
                            outerGamecard.innerHTML = "<span><p>".concat(gamecardData.label, "</p></span><div class=\"gamecard-container\"></div>");
                            for (_b = 0, _c = gamecardData.children.sort(function (a, b) { return a.position - b.position; }); _b < _c.length; _b++) {
                                game = _c[_b];
                                gameStyleString = '';
                                for (_d = 0, _e = game.img_css; _d < _e.length; _d++) {
                                    cssAtttribute = _e[_d];
                                    gameStyleString += "".concat(cssAtttribute.attribute, ": ").concat(cssAtttribute.value, "; ");
                                }
                                ;
                                outerGamecard.querySelector('.gamecard-container').innerHTML += "<div class=\"gamecard\" id=\"".concat(game.id, "\"><a href=\"").concat(game.href, "\" style=\"background-image: url(").concat(game.img, "); ").concat(gameStyleString, "\"><span><b>").concat(game.label, "</b></span></a></div>");
                            }
                            ;
                            targetedNode.appendChild(outerGamecard);
                        }
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
                        header = document.querySelector('#header');
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
                Array.from(document.body.children).concat(document.querySelector('footer')).forEach(function (element) {
                    if (element.classList.contains('loader'))
                        element.style.display = 'none';
                    else
                        element.removeAttribute('style');
                });
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
            function resizeMasonryItem(item) {
                /* Get the grid object, its row-gap, and the size of its implicit rows */
                var grid = document.getElementsByClassName('pinterest-grid')[0], rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')), rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
                /*
                * Spanning for any brick = S
                * Grid's row-gap = G
                * Size of grid's implicitly create row-track = R
                * Height of item content = H
                * Net height of the item = H1 = H + G
                * Net height of the implicit row-track = T = G + R
                * S = H1 / T
                */
                var rowSpan = Math.ceil((item.offsetHeight + rowGap) / (rowHeight + rowGap));
                /* Set the spanning as calculated above (S) */
                item.style.gridRowEnd = 'span ' + rowSpan;
            }
            function resizeAllMasonryItems() {
                var allItems = document.querySelectorAll('.pinterest-grid-item');
                for (var i = 0; i < allItems.length; i++) {
                    resizeMasonryItem(allItems[i]);
                }
                ;
            }
            function createElement(item) {
                var div = document.createElement('div');
                var img = new Image();
                var card;
                if (item.type !== 'Wished') {
                    card = document.getElementById('owned-ordered');
                }
                else {
                    card = document.getElementById('wished');
                    div.classList.add('wished');
                }
                div.setAttribute('alt', item.title);
                div.classList.add('pinterest-grid-item');
                div.id = item.id;
                img.src = item.icon;
                if (item.category == 'Prepainted') {
                    div.style.color = 'green';
                }
                else if (item.category == 'Action/Dolls') {
                    div.style.color = '#0080ff';
                }
                else {
                    div.style.color = 'orange';
                }
                img.style.border = "4px solid ".concat(div.style.color);
                var imgBorder = img.style.border.split(' ')[0];
                img.style.width = "calc(100% - ".concat(imgBorder, " * 2)");
                img.onclick = function () {
                    var popUp = document.querySelector('.pop-up.mfc');
                    var title = popUp.querySelector('.pop-up-title');
                    var popUpImgAnchor = popUp.querySelector('#pop-up-img');
                    var popUpImg = popUpImgAnchor.childNodes[0];
                    var originalName = popUp.querySelector('#mfc-character-original-name');
                    var originName = popUp.querySelector('#mfc-character-source');
                    var classification = popUp.querySelector('#mfc-classification');
                    var a = popUp.querySelector('.pop-up-header > div > a');
                    var characterLink = '';
                    var originLink = '';
                    var classificationLink = '';
                    if (item.characterJap) {
                        characterLink = "https://buyee.jp/item/search/query/".concat(encodeURIComponent(item.characterJap), "/category/2084023782?sort=end&order=a&store=1&lang=en");
                    }
                    else {
                        characterLink = "https://buyee.jp/item/search/query/".concat(encodeURIComponent(item.character), "/category/2084023782?sort=end&order=a&store=1&lang=en");
                    }
                    ;
                    if (item.sourceJap !== 'オリジナル' && item.sourceJap !== undefined) {
                        originName.parentElement.style.display = '';
                        originLink = "https://buyee.jp/item/search/query/".concat(encodeURIComponent(item.sourceJap), "/category/2084023782?sort=end&order=a&store=1&lang=en");
                    }
                    else {
                        originName.parentElement.style.display = 'none';
                    }
                    ;
                    if (item.classification !== undefined) {
                        classification.parentElement.style.display = '';
                        classificationLink = "https://buyee.jp/item/search/query/".concat(encodeURIComponent(item.classification.replaceAll('#', '')), "/category/2084023782?sort=end&order=a&store=1&lang=en");
                    }
                    else {
                        classification.parentElement.style.display = 'none';
                    }
                    ;
                    title.innerHTML = item.title;
                    popUpImgAnchor.href = item.href;
                    popUpImgAnchor.style.border = "".concat(imgBorder, " solid ").concat(div.style.color);
                    popUpImg.src = item.img;
                    var copySvg = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 20010904//EN\" \"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd\"><svg version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200.000000 200.000000\" preserveAspectRatio=\"xMidYMid meet\"><g transform=\"translate(0.000000,200.000000) scale(0.100000,-0.100000)\" fill=\"currentColor\" stroke=\"none\"><path d=\"M721 1882 c-71 -36 -76 -51 -79 -268 l-3 -194 60 0 61 0 2 178 3 177 475 0 475 0 0 -475 0 -475 -117 -3 -118 -3 0 -60 0 -61 134 4 c151 3 175 12 209 79 16 31 17 73 15 531 -3 484 -4 497 -24 525 -47 64 -39 63 -574 63 -442 0 -488 -2 -519 -18z\"/><path d=\"M241 1282 c-19 -9 -44 -30 -55 -45 -20 -28 -21 -41 -24 -525 -3 -555 -4 -542 67 -589 l34 -23 496 0 c477 0 497 1 529 20 18 11 41 34 52 52 19 32 20 52 20 529 l0 496 -23 34 c-47 70 -36 69 -577 69 -442 0 -488 -2 -519 -18z m994 -582 l0 -475 -475 0 -475 0 -3 465 c-1 256 0 471 3 478 3 10 104 12 477 10 l473 -3 0 -475z\"/></g></svg>";
                    originalName.innerHTML = item.characterJap !== '' ? "<a target=\"_blank\" href=\"".concat(characterLink, "\">").concat(copySvg, "&nbsp;").concat(item.characterJap, "</a>") : "<a target=\"_blank\" href=\"".concat(characterLink, "\">").concat(copySvg, "&nbsp;").concat(item.character, "</div></a>");
                    originName.innerHTML = "<a target=\"_blank\" href=\"".concat(originLink, "\">").concat(copySvg, "&nbsp;").concat(item.sourceJap, "</a>");
                    classification.innerHTML = "<a target=\"_blank\" href=\"".concat(classificationLink, "\">").concat(copySvg, "&nbsp;").concat(item.classification, "</a>");
                    switch (item.type) {
                        case 'Owned':
                            a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
                        case 'Ordered':
                            a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
                        case 'Wished':
                            a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
                        default:
                            console.error("Weird MFC item type: ".concat(item.type));
                    }
                    //NEXT LINE MUST BE CHANGED EACH TIME A LINK IS ADDED
                    var links = [originalName.querySelector('a'), originName.querySelector('a'), classification.querySelector('a')];
                    links.forEach(function (link) {
                        link.addEventListener('click', function (ev) {
                            var _a;
                            var target = ev.touches ? ((_a = ev.touches[0]) === null || _a === void 0 ? void 0 : _a.target) || ev.target : ev.target;
                            var copyToClipboard = function (ev, target) {
                                ev.preventDefault();
                                navigator.clipboard.writeText(target.parentElement.textContent.trim());
                                console.log("Copied ".concat(target.parentElement.textContent));
                            };
                            if (target instanceof SVGElement)
                                copyToClipboard(ev, target);
                        });
                    });
                    popUp.style.display = 'block';
                };
                div.append(img);
                card.append(div);
                div.append(item.character);
            }
            function searchFigure(textInput, json) {
                var searchStr = new RegExp(textInput.value, 'i');
                console.info("A string procurada \u00E9 ".concat(searchStr));
                var figuresToHide = json.filter(function (figure) {
                    var count = 0;
                    Object.keys(figure).forEach(function (key) { if (searchStr.test(figure[key]))
                        count++; });
                    return count === 0;
                });
                var divs = document.querySelectorAll('aside .card .pinterest-grid-item');
                divs.forEach(function (div) {
                    div.style.display = 'block';
                    if (figuresToHide.filter(function (figure) { return figure.id === div.id; }).length > 0) {
                        div.style.display = 'none';
                    }
                    ;
                });
            }
            var result, createElementPromise;
            return __generator(this, function (_a) {
                result = JSON.parse(JSON.stringify(this.json.mfc));
                createElementPromise = new Promise(function (resolve, reject) {
                    resolve(result.sort(function (a, b) { return Number(a.id) - Number(b.id); }).map(createElement));
                });
                createElementPromise.then(function () {
                    setTimeout(resizeAllMasonryItems, 1000);
                    setTimeout(PageBuilding.resizeAside, 1000);
                    var input = document.querySelector('#search-bar');
                    var loader = document.querySelector('.container .flex-container aside > .loader');
                    var timeout;
                    input.addEventListener('keyup', function (ev) {
                        clearTimeout(timeout);
                        loader.style.display = '';
                        timeout = setTimeout(function () {
                            searchFigure(input, result);
                            loader.style.display = 'none';
                        }, 2000);
                    });
                });
                ;
                ;
                setInterval(function () {
                    resizeAllMasonryItems();
                }, 500);
                setTimeout(function () {
                    var loader = document.querySelector('aside > .card > .loader');
                    var pinterestGrids = document.querySelectorAll('aside > .card > .pinterest-grid');
                    loader.style.display = 'none';
                    pinterestGrids.forEach(function (grid) {
                        grid.style.opacity = '1';
                    });
                }, 1000);
                setInterval(function () {
                    var card = document.querySelector('aside .card');
                    var grids = card.querySelectorAll('.pinterest-grid');
                    grids.forEach(function (grid) {
                        grid.style.width = (parseFloat(getComputedStyle(card).width) / 2) + 'px';
                    });
                }, 500);
                return [2 /*return*/];
            });
        });
    };
    ;
    return CloudStorageData;
}());
export { CloudStorageData };
;
var ExternalData = /** @class */ (function () {
    function ExternalData() {
    }
    ExternalData.addRetroAchievementsAwards = function () {
        return __awaiter(this, void 0, void 0, function () {
            function createRetroAchievementsAwardCard(award) {
                gridContainer.innerHTML += "<div id=\"".concat(CustomFunctions.normalize(award.title), "\" class=\"shortcut-item retroachievements-award\" alt=\"").concat(award.title, "\" target=\"_blank\"><img src=\"").concat(award.imageIcon, "\" style=\"border: 2px solid ").concat(award.allData.some(function (a) { return a.awardType.includes('Platinado'); }) ? 'gold' : '#e5e7eb', ";\" draggable=\"false\"></div>");
            }
            var raUrl, response, awards, consoles, gridContainer, popUp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        raUrl = 'https://retroachievements.org';
                        return [4 /*yield*/, fetch("".concat(server, "retroAchievements/pt-BR/")).then(function (res) { return res.json(); })];
                    case 1:
                        response = _a.sent();
                        awards = response.awards;
                        consoles = response.consoles;
                        gridContainer = document.querySelector('#retroachievements-awards > .grid-container');
                        popUp = document.querySelector('.pop-up.retroachievements-awards');
                        awards.map(createRetroAchievementsAwardCard);
                        ;
                        gridContainer.querySelectorAll('.retroachievements-award').forEach(function (awardCard) {
                            var currentAwardData = awards.filter(function (award) { return CustomFunctions.normalize(award.title) === awardCard.id; })[0];
                            var currentConsoleData = consoles.filter(function (consoleId) { return consoleId.id === currentAwardData.consoleId; })[0];
                            awardCard.addEventListener('click', function (ev) {
                                popUp.style.display = 'block';
                                popUp.querySelector('#pop-up-img').href = "".concat(raUrl, "/game/").concat(currentAwardData.awardData);
                                popUp.querySelector('#pop-up-img').style.border = "2px solid ".concat(currentAwardData.allData.some(function (a) { return a.awardType.includes('Platinado'); }) ? 'gold' : '#e5e7eb');
                                popUp.querySelector('#pop-up-img').style.aspectRatio = '1';
                                popUp.querySelector('#pop-up-img > img').src = currentAwardData.imageIcon;
                                popUp.querySelectorAll('.pop-up-header > div > a')[1].href = "".concat(raUrl, "/system/").concat(currentConsoleData.id, "-").concat(CustomFunctions.normalize(currentConsoleData.name), "/games");
                                popUp.querySelectorAll('.pop-up-header > div > a > img')[1].src = consoles.filter(function (consoleId) { return consoleId.id === currentAwardData.consoleId; })[0].iconUrl;
                                popUp.querySelector('.pop-up-title').innerHTML = "<p>".concat(currentAwardData.title, "</p><p><small>").concat(currentConsoleData.name, "</small></p>");
                                popUp.querySelector('.data-container').innerHTML = '';
                                for (var _i = 0, _a = currentAwardData.allData; _i < _a.length; _i++) {
                                    var data = _a[_i];
                                    popUp.querySelector('.data-container').innerHTML += "<div style=\"border-top: 1px solid var(--contrast-color-3);\"><p>Pr\u00EAmio&nbsp;<span>".concat(data.awardType, "</span></p><p>Data&nbsp;<span>").concat(Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(data.awardedAt)), "</span></p></div>");
                                }
                            });
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
                        var direction = target.classList.contains('left') ? 'left' : 'right';
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
export { ExternalData };
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
    return PageBehaviour;
}());
export { PageBehaviour };
;
window.addEventListener('load', onLoadFunctions, true);
function onLoadFunctions(ev) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    PageBuilding.createLoaders(12);
                    return [4 /*yield*/, CloudStorageData.load()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            CloudStorageData.loadContentFromJson(),
                            CloudStorageData.addMfcImages(),
                            ExternalData.scrapeMyAnimeList(),
                            ExternalData.addRetroAchievementsAwards()
                        ])];
                case 2:
                    _a.sent();
                    PageBuilding.figuresSitDown();
                    PageBuilding.adjustGamecard();
                    PageBuilding.adjustGamecardText(0);
                    PageBuilding.putVersionOnFooter();
                    PageBuilding.removeHoverEffectsOnMobile();
                    UserInterface.expandAside();
                    UserInterface.makeAsideButtonFollow();
                    UserInterface.makeSwitchesSlide();
                    UserInterface.nightModeToggle();
                    UserInterface.dragPopUps();
                    UserInterface.setPopUpDefaultValues();
                    UserInterface.resetPopUpsOnOpen();
                    UserInterface.showPopUps();
                    ExternalSearch.redditSearchTrigger();
                    ExternalSearch.wikipediaSearchTrigger();
                    PageBehaviour.openLinksInNewTab();
                    PageBehaviour.redirectLinksToEdge();
                    PageBehaviour.stopImageDrag();
                    return [2 /*return*/];
            }
        });
    });
}
;
window.addEventListener('resize', onResizeFunctions, true);
function onResizeFunctions(ev) {
    setTimeout(function () {
        PageBuilding.resizeAside();
        PageBuilding.figuresSitDown();
        PageBuilding.adjustGamecardText(0);
    }, 500);
}
;
window.addEventListener('scroll', onScrollFunctions, true);
function onScrollFunctions(ev) {
    UserInterface.resizeHeader();
    UserInterface.makeButtonFromAsideFollowHeader();
}
;
