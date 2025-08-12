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
// Import custom functions from "./functions.Js"
import CustomFunctions from "./functions.js";
//A const that stores if the browser is mobile
var mobile = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
var portrait = (window.innerWidth < window.innerHeight);
//The server
var server = window.location.href === 'http://127.0.0.1:5500/' ? 'http://localhost:3000/' : 'https://statisticshock-github-io.onrender.com/';
console.log("Running server at ".concat(server));
// Remove :hover effects
function goThroughRules(rules) {
    try {
        for (var j = rules.length - 1; j >= 0; j--) {
            var rule = rules[j];
            if (rule instanceof CSSStyleRule) {
                if (rule.selectorText.includes(':hover')) {
                    rule.cssText = '';
                }
                else if (rule.cssRules) {
                    goThroughRules(rule.cssRules);
                }
                ;
            }
            ;
        }
        ;
    }
    catch (err) {
        // Do nothing
    }
    ;
}
// To make loaders work
function createLoaders(counter) {
    var loaders = document.querySelectorAll('.loader');
    loaders.forEach(function (loader) {
        for (var i = 0; i < counter; i++) {
            var div = document.createElement('div');
            div.setAttribute('class', 'loading');
            div.setAttribute('style', "--translation: 150; --index: ".concat(i + 1, "; --count: ").concat(counter));
            loader.appendChild(div);
        }
        ;
    });
}
;
//To make all shortcuts available
function loadContentFromJson() {
    return __awaiter(this, void 0, void 0, function () {
        function loadShortcuts() {
            return __awaiter(this, void 0, void 0, function () {
                var targetedNode, shortcutsNode, _i, _a, section, container, p, div, _b, _c, child, a, img;
                return __generator(this, function (_d) {
                    targetedNode = document.querySelectorAll('#shortcuts h2')[1];
                    shortcutsNode = document.querySelector('#shortcuts');
                    for (_i = 0, _a = json.shortcuts.sort(function (a, b) { return a.index - b.index; }); _i < _a.length; _i++) { //Creates the section
                        section = _a[_i];
                        container = document.createElement('section');
                        container.id = section.id;
                        p = document.createElement('p');
                        p.innerHTML = section.title;
                        div = document.createElement('div');
                        div.classList.add('grid-container');
                        for (_b = 0, _c = section.children.sort(function (a, b) { return a.index - b.index; }); _b < _c.length; _b++) { //Creates each shortcut
                            child = _c[_b];
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
                        container.appendChild(p);
                        container.appendChild(div);
                        shortcutsNode.insertBefore(container, targetedNode); //Inserts the created element before the gaming cards
                    }
                    return [2 /*return*/];
                });
            });
        }
        function loadHeaders() {
            return __awaiter(this, void 0, void 0, function () {
                var index, src, header, h1;
                return __generator(this, function (_a) {
                    index = CustomFunctions.randomIntFromInterval(1, json.headers.length);
                    src = json.headers[index - 1];
                    json.headers.forEach(function (imgSrc) {
                        var img = new Image();
                        img.src = imgSrc;
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
                        var arr = json.headers.filter(function (headerImg) {
                            return headerImg != src.split('/').pop();
                        });
                        var indexArr = CustomFunctions.randomIntFromInterval(1, arr.length);
                        src = arr[indexArr - 1];
                        header.style.backgroundImage = "url('".concat(src, "')");
                    };
                    return [2 /*return*/];
                });
            });
        }
        var json, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fetch("".concat(server, "contents?filename=contents"))];
                case 1: return [4 /*yield*/, (_c.sent()).text()];
                case 2:
                    json = _b.apply(_a, [_c.sent()]);
                    ;
                    ;
                    Array.from(document.body.children).concat(document.querySelector('footer')).forEach(function (element) {
                        if (element.classList.contains('loader'))
                            element.style.display = 'none';
                        else
                            element.removeAttribute('style');
                    });
                    loadShortcuts();
                    loadHeaders();
                    return [2 /*return*/];
            }
        });
    });
}
// Stop image dragging
function stopImageDrag() {
    var images = document.getElementsByTagName('img');
    Array.from(images).forEach(function (img) {
        img.setAttribute('draggable', 'false');
    });
}
;
// Open in new tab
function openLinksInNewTab() {
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
}
;
//To make sheets open in edge
function redirectToEdge() {
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
}
;
//To make aside the same height of Shortcut-Item
function resizeAside(counter) {
    var aside = document.querySelector('aside');
    var shortcuts = document.querySelector('#shortcuts');
    aside.style.height = 'fit-content';
    shortcuts.style.height = 'fit-content';
    if (parseFloat(getComputedStyle(aside).height) < parseFloat(getComputedStyle(shortcuts).height)) {
        aside.style.height = shortcuts.offsetHeight + 'px';
    }
    else {
        shortcuts.style.height = aside.offsetHeight + 'px';
    }
    if (counter == 0) {
        setTimeout(function () {
            resizeAside(1);
        }, 750);
    }
    ;
}
;
function expandAside() {
    var aside = document.querySelector('aside');
    var div = aside.querySelector('.button-bar');
    var bttn = aside.querySelector('#expand-button');
    var span = bttn.querySelector('span');
    var shortcuts = document.querySelector('#shortcuts');
    var flexContainer = document.querySelector('.flex-container');
    var input = aside.querySelector('input');
    bttn.onclick = function (ev) {
        if (!portrait) {
            if (aside.getBoundingClientRect().width < window.innerWidth * 0.3) {
                span.style.transform = "rotate(180deg) translate(0%,-10%)";
                flexContainer.style.gridTemplateColumns = '54vw 2vw 1fr';
                input.style.width = "calc((46vw - 2vw - 10px) * 0.9)";
                input.style.left = "calc(((44vw - 10px) * 0.1) / 2)";
            }
            else {
                span.style.transform = "rotate(0deg) translate(0%,-10%)";
                flexContainer.style.gridTemplateColumns = '76vw 2vw 1fr';
                input.style.width = "calc((24vw - 2vw - 10px) * 0.9)";
                input.style.left = "calc(((22vw - 10px) * 0.1) / 2)";
            }
            ;
        }
        else {
            if (!aside.classList.contains('hidden')) {
                aside.classList.add('hidden');
                bttn.style.transform = 'rotate(180deg) translate(20px, 0)';
            }
            else {
                aside.classList.remove('hidden');
                bttn.style.transform = 'translate(20px, 0)';
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
}
;
function makeAsideButtonFollow() {
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
}
;
// To make the gamecard occupy 50% of the screen on hover
function adjustGamecard() {
    var gameCardContainers = document.querySelectorAll('.gamecard-container');
    gameCardContainers.forEach(function (gamecardContainer) {
        var childCount = Math.max(gamecardContainer.children.length, 2).toString();
        gamecardContainer.style.setProperty('--gamecard-count', childCount);
    });
    var gameCardText = document.querySelectorAll('.gamecard-text > span p');
    gameCardText.forEach(function (element) {
        element.style.marginLeft = -(element.offsetWidth / 2 - 20) + 'px';
    });
}
;
function rotateGamecardText(counter) {
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
        setTimeout(rotateGamecardText, 100);
    }
    ;
}
;
function resizeHeader() {
    var header = document.querySelector('header');
    var nav = document.querySelector('nav');
    var height = parseFloat(getComputedStyle(header).height);
    var windowWidth = document.documentElement.scrollWidth;
    var scrollY = window.scrollY;
    var ohtoHeight = parseFloat(getComputedStyle(document.querySelector('#ohto')).height);
    header.style.aspectRatio = Math.min(windowWidth / ohtoHeight, Math.max(5, (5 * ((scrollY + height) / height)))) + '';
    var newHeight = parseFloat(getComputedStyle(header).height);
    nav.style.top = newHeight + 'px';
}
// To make 2B and Ai sit on the navbar (and makke the MFC toggle sit under 2B)
function figuresSitDown() {
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
}
;
//To make all switches work
function makeSwitchesSlide() {
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
}
;
//To make MFC toggle switch work
function mfcToggleSwitch() {
    var input = document.querySelector('#mfc-switch > input');
    var owned = document.getElementById('owned');
    var ordered = document.getElementById('ordered');
    var card = document.querySelector('.card');
    var cardWidth = card.scrollWidth;
    //scroll to the left on page load
    card.scrollTo({ left: 0 });
    input.onclick = function () {
        if (input.checked) {
            card.scrollTo({ left: cardWidth / 2 + 1, behavior: 'smooth' });
        }
        else {
            card.scrollTo({ left: 0, behavior: 'smooth' });
        }
        ;
    };
    card.onscroll = function () {
        if (card.scrollLeft == 0) { // Make sure it triggers only once it is in default position
            input.checked = false;
        }
        else if (card.scrollLeft == card.scrollWidth / 2) { // Makes sure it triggers only once it reaches second page
            input.checked = true;
        }
    };
}
;
//To toggle night mode
function nightModeToggle() {
    var label = document.querySelector('#night-mode-toggle');
    // Create input if it doesn't exist
    var input = label.querySelector('input');
    // Set initial state based on current theme
    var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    input.checked = isDark;
    // Listen for toggle
    input.addEventListener('change', function (ev) {
        if (input.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        ;
        console.log(getComputedStyle(document.documentElement).getPropertyValue('--contrast-color').trim());
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
        var newColorScheme = event.matches ? "dark" : "light";
    });
}
//To make the popups appear on click
function formatPopUps() {
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
                object.popUpContainer.style.display = 'block'; //Makes the popUp appear
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
                    var input = siblings[siblings.indexOf(label) - 1]; //Gets the imediate predecessor sibling
                    var rect = object.popUpContainer.getBoundingClientRect();
                    var inputRect = input.getBoundingClientRect();
                    var left = inputRect.left - rect.left;
                    label.style.left = Math.max(left, 5) + 'px';
                    input.placeholder ? input.placeholder = input.placeholder : input.placeholder = ' ';
                });
            }, 10);
        };
        object.popUpContainer.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault(); //Makes the form not submit
                var okButton = object.popUpContainer.querySelector('.ok-button');
                okButton.click();
            }
        });
    });
    //To make the Close Button work
    var buttons = document.querySelectorAll('.close-button');
    buttons.forEach(function (button) {
        var parent = button.parentElement.parentElement;
        button.onclick = function () {
            parent.style.display = 'none';
            setDefaults();
        };
    });
}
;
// To make the reddit search work
function redditSearchTrigger() {
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
}
;
//To make the wikipedia search work
function wikipediaSearchTrigger() {
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
}
;
//To create new shortcuts
function createShortcutsTrigger() {
}
// To make the inputbox draggable
function dragPopUps() {
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
}
;
function dragAndDropHandler() {
    return __awaiter(this, void 0, void 0, function () {
        function toggleHeaderInput(header, forceText) {
            if (header.querySelector('input') === null) {
                header.innerHTML = forceText ? header.innerHTML : "<img src=\"https://storage.googleapis.com/statisticshock_github_io_public/icons/static/list-drag-handle.svg\" class=\"drag-handle\"><input type=\"text\" value=\"".concat(header.textContent, "\"><span><img src=\"https://storage.googleapis.com/statisticshock_github_io_public/icons/static/check.svg\"></span>");
            }
            else {
                var input = header.querySelector('input');
                header.innerHTML = "<img src=\"https://storage.googleapis.com/statisticshock_github_io_public/icons/static/list-drag-handle.svg\" class=\"drag-handle\">".concat(input.value, "<span><img src=\"https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg\"></span>");
            }
            ;
        }
        function toggleShortcutInput(shorcut, forceText) {
            if (shorcut.querySelector('input') === null) {
                shorcut.innerHTML = forceText ? shorcut.innerHTML : shorcut.innerHTML.replace(shorcut.textContent, "<input type=\"text\" value=\"".concat(shorcut.textContent, "\">")).replace('edit.svg', 'check.svg');
            }
            else {
                var input = shorcut.querySelector('input');
                input.outerHTML = "".concat(input.value);
                shorcut.innerHTML = shorcut.innerHTML.replace('check.svg', 'edit.svg');
            }
            ;
        }
        function updateIcon(shorcut) {
            var icon = shorcut.querySelectorAll('img')[1];
            var src = icon.src;
            icon.outerHTML = "<input type=\"file\" accept=\"image/*\">";
            var newIcon = Array.from(shorcut.querySelectorAll('input')).pop();
            newIcon.files = null;
        }
        function handleDropFile() {
            function activeFileDrop() {
                fileDrop.style.border = '3px solid var(--pink-custom)';
            }
            ;
            function inactiveFileDrop() {
                fileDrop.style.border = '3px dashed grey';
            }
            ;
            var input = fileDrop.querySelector('input');
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evName) { return fileDrop.addEventListener(evName, function (e) { return e.preventDefault(); }); });
            ['dragenter', 'dragover'].forEach(function (evName) { return fileDrop.addEventListener(evName, function (e) { return activeFileDrop(); }); });
            ['dragleave', 'drop'].forEach(function (evName) { return fileDrop.addEventListener(evName, function (e) { return inactiveFileDrop(); }); });
            fileDrop.addEventListener('drop', function (e) {
                var dt = e.dataTransfer;
                var filesDt = dt.files;
                input.files = filesDt;
                fileDrop.querySelector('p').innerHTML = "\"".concat(input.files[0].name, "\" selecionado.");
            });
            fileDrop.querySelector('input').addEventListener('change', function (e) {
                if (input.files && input.files[0]) {
                    fileDrop.querySelector('p').innerHTML = "\"".concat(input.files[0].name, "\" selecionado.");
                    var reader = new FileReader();
                    reader.onload = function (ev) { fileDrop.querySelector('img').src = ev.target.result; };
                    reader.readAsDataURL(input.files[0]);
                }
                else {
                    fileDrop.querySelector('p').innerHTML = 'Solte uma imagem aqui';
                }
                ;
            });
        }
        var popUp, dragAndDrop, addItemButton, addItem, fileDrop, bttn, json, _a, _b, submitBttn, addNewEntryBttn;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    popUp = document.querySelector('.pop-up.create-shortcut');
                    dragAndDrop = popUp.querySelector('#drag-and-drop');
                    addItemButton = popUp.querySelector('#add-drag-and-drop-button');
                    addItem = popUp.querySelector('#add-drag-and-drop');
                    fileDrop = addItem.querySelector('#drop-file');
                    bttn = document.querySelector('.create-shortcut.pop-up-open');
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fetch("".concat(server, "contents?filename=contents"))];
                case 1: return [4 /*yield*/, (_c.sent()).text()];
                case 2:
                    json = _b.apply(_a, [_c.sent()]);
                    submitBttn = popUp.querySelector('.ok-button');
                    addNewEntryBttn = popUp.querySelector('#add-drag-and-drop-submit');
                    bttn.addEventListener('click', function (ev) {
                        fileDrop.querySelector('img').src = 'https://storage.googleapis.com/statisticshock_github_io_public/icons/static/image.svg';
                        for (var _i = 0, _a = Array.from(addItem.querySelectorAll('input')); _i < _a.length; _i++) {
                            var input = _a[_i];
                            input.value = '';
                        }
                        addItemButton.classList.remove('active');
                        dragAndDrop.style.display = 'grid';
                        dragAndDrop.innerHTML = '';
                        for (var _b = 0, _c = json.shortcuts; _b < _c.length; _b++) {
                            var shortcut = _c[_b];
                            dragAndDrop.insertAdjacentHTML('beforeend', "<div id=\"".concat(shortcut.id, "-list\" class=\"drag-and-drop-list\" draggable=\"false\" x=\"shown\"><h3 class=\"drag-and-drop-list-header\"><img src=\"https://storage.googleapis.com/statisticshock_github_io_public/icons/static/list-drag-handle.svg\" class=\"drag-handle\">").concat(shortcut.title, "<span><img src=\"https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg\"></span></h3><div style=\"--children-length: ").concat(shortcut.children.length, ";\"></div></div>"));
                            var dragAndDropList = dragAndDrop.querySelector("#".concat(shortcut.id, "-list div"));
                            var dragAndDropListHeader = dragAndDropList.parentElement.querySelector('h3');
                            for (var _d = 0, _e = shortcut.children; _d < _e.length; _d++) {
                                var child = _e[_d];
                                addItem.style.display = 'none';
                                dragAndDropList.innerHTML += "<div id=\"".concat(child.id, "-list\" class=\"drag-and-drop-item\" draggable=\"false\" y=\"").concat(child.href, "\"><img src=\"https://storage.googleapis.com/statisticshock_github_io_public/icons/static/list-drag-handle.svg\" class=\"drag-handle\">").concat(child.alt, "<span><img src=\"").concat(child.img, "\" draggable=\"false\"><input type=\"file\" accept=\"image/*\"></span><span><img src=\"https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg\"></span></div>");
                            }
                            ;
                        }
                        ;
                        fileDrop.querySelector('input').files = null;
                        fileDrop.querySelector('p').innerHTML = "Solte uma imagem aqui";
                    });
                    addItemButton.onclick = function (ev) {
                        if (addItemButton.classList.contains('active')) {
                            addItemButton.classList.remove('active');
                            addItem.style.display = 'none';
                            dragAndDrop.style.display = 'grid';
                            submitBttn.removeAttribute('style');
                        }
                        else {
                            addItemButton.classList.add('active');
                            addItem.style.display = 'block';
                            dragAndDrop.style.display = 'none';
                            submitBttn.style.display = 'none';
                        }
                    };
                    handleDropFile();
                    popUp.addEventListener('submit', function (ev) { return __awaiter(_this, void 0, void 0, function () {
                        var formData, _i, _a, _b, key, value, response, textJson, targetListToAddNewData, textJson, err_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    ev.preventDefault();
                                    formData = new FormData(popUp);
                                    addItem.querySelectorAll('input').forEach(function (input) {
                                        if (input.type === 'text' && input.value === '') {
                                            input.style.setProperty('--initial-color', getComputedStyle(input).backgroundColor);
                                            input.classList.add('pulse');
                                            setTimeout(function () {
                                                input.classList.remove('pulse');
                                                input.style.removeProperty('--initial-color');
                                            }, 1800);
                                        }
                                        else if (input.type === 'file' && input.files.length === 0) {
                                            input.parentElement.style.setProperty('--initial-color', getComputedStyle(input).backgroundColor);
                                            input.parentElement.classList.add('pulse');
                                            setTimeout(function () {
                                                input.parentElement.classList.remove('pulse');
                                                input.parentElement.style.removeProperty('--initial-color');
                                            }, 1800);
                                        }
                                        ;
                                    });
                                    for (_i = 0, _a = Array.from(formData); _i < _a.length; _i++) {
                                        _b = _a[_i], key = _b[0], value = _b[1];
                                        if (typeof value === 'string' && value === '')
                                            return [2 /*return*/];
                                        if (value instanceof File && value.size === 0)
                                            return [2 /*return*/];
                                    }
                                    ;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 7, , 8]);
                                    return [4 /*yield*/, fetch("".concat(server, "upload/"), {
                                            method: 'POST',
                                            body: formData
                                        })];
                                case 2:
                                    response = _c.sent();
                                    if (!response.ok) return [3 /*break*/, 4];
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    textJson = _c.sent();
                                    targetListToAddNewData = dragAndDrop.querySelector("".concat(textJson.sectionId, "-list"));
                                    if (targetListToAddNewData === null) {
                                    }
                                    else {
                                    }
                                    ;
                                    return [3 /*break*/, 6];
                                case 4: return [4 /*yield*/, response.json()];
                                case 5:
                                    textJson = _c.sent();
                                    alert("ERRO:\n".concat(textJson.message));
                                    _c.label = 6;
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    err_1 = _c.sent();
                                    return [3 /*break*/, 8];
                                case 8:
                                    ;
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    dragAndDrop.addEventListener('click', function (ev) {
                        var header = ev.target.closest('.drag-and-drop-list-header');
                        if (!header)
                            return;
                        if (ev.target.tagName === 'INPUT')
                            return;
                        if (CustomFunctions.isParent(ev.target, header.querySelector('span'))) {
                            toggleHeaderInput(header);
                            return;
                        }
                        ;
                        var container = header.parentElement;
                        var isShown = container.getAttribute('x') === 'shown';
                        container.setAttribute('x', isShown ? 'hidden' : 'shown');
                        container.classList.toggle('hidden', isShown);
                    });
                    dragAndDrop.addEventListener('click', function (ev) {
                        var shortcut = ev.target.closest('.drag-and-drop-item');
                        if (!shortcut)
                            return;
                        else if (ev.target.tagName === 'INPUT')
                            return;
                        else if (shortcut.querySelector('input') !== null && shortcut.querySelector('input').value === '')
                            return;
                        else if (CustomFunctions.isParent(ev.target, shortcut.querySelector('span')))
                            toggleShortcutInput(shortcut);
                        else if (ev.target === shortcut.querySelectorAll('img')[1])
                            updateIcon(shortcut);
                    });
                    dragAndDrop.addEventListener('mousemove', function (ev) {
                        if (mobile)
                            return;
                        var sections = Array.from(document.querySelectorAll('.container .flex-container section:has(.grid-container)'));
                        sections.forEach(function (section) {
                            if (!ev.target.closest('.drag-and-drop-list'))
                                return;
                            if (ev.target.closest('.drag-and-drop-list').id.replace('-list', '') === section.id) {
                                section.querySelector('p').classList.add('animated');
                            }
                            else {
                                section.querySelector('p').classList.remove('animated');
                            }
                        });
                    });
                    dragAndDrop.addEventListener('mouseleave', function (ev) {
                        var sections = Array.from(document.querySelectorAll('.container .flex-container section:has(.grid-container)'));
                        sections.forEach(function (section) {
                            section.querySelector('p').classList.remove('animated');
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
;
// To make the defaults load within the window
function setDefaults() {
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
}
;
// To add MFC images in the aside and do 
function addMfcImages() {
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
            // Get all item class objects in one list
            var allItems = document.querySelectorAll('.pinterest-grid-item');
            for (var i = 0; i < allItems.length; i++) {
                resizeMasonryItem(allItems[i]);
            }
            ;
        }
        function createElement(item) {
            var div = document.createElement('div'); // The container
            var img = new Image(); // The image
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
            img.src = item.img;
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
                var originName = popUp.querySelector('#mfc-character-origin');
                var classification = popUp.querySelector('#mfc-classification');
                var a = popUp.querySelector('.pop-up-header > div > a');
                var characterLink = '';
                var originLink = '';
                var classificationLink = '';
                if (item.characterJap) {
                    characterLink = "https://buyee.jp/item/search/query/".concat(encodeURIComponent(item.characterJap), "/category/2084023782?sort=end&order=a&store=1");
                }
                else {
                    characterLink = "https://buyee.jp/item/search/query/".concat(encodeURIComponent(item.character), "/category/2084023782?sort=end&order=a&store=1");
                }
                ;
                if (item.origin !== 'オリジナル' && item.origin !== undefined) {
                    originName.parentElement.style.display = '';
                    originLink = "https://buyee.jp/item/search/query/".concat(encodeURIComponent(item.origin), "/category/2084023782?sort=end&order=a&store=1");
                }
                else {
                    originName.parentElement.style.display = 'none';
                }
                ;
                if (item.classification !== undefined) {
                    classification.parentElement.style.display = '';
                    classificationLink = "https://buyee.jp/item/search/query/".concat(encodeURIComponent(item.classification.replaceAll('#', '')), "/category/2084023782?sort=end&order=a&store=1");
                }
                else {
                    classification.parentElement.style.display = 'none';
                }
                ;
                title.innerHTML = item.title;
                popUpImgAnchor.href = item.href;
                popUpImg.src = img.src;
                popUpImg.style.border = "".concat(imgBorder, " solid ").concat(div.style.color);
                var copySvg = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 20010904//EN\" \"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd\"><svg version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200.000000 200.000000\" preserveAspectRatio=\"xMidYMid meet\"><g transform=\"translate(0.000000,200.000000) scale(0.100000,-0.100000)\" fill=\"currentColor\" stroke=\"none\"><path d=\"M721 1882 c-71 -36 -76 -51 -79 -268 l-3 -194 60 0 61 0 2 178 3 177 475 0 475 0 0 -475 0 -475 -117 -3 -118 -3 0 -60 0 -61 134 4 c151 3 175 12 209 79 16 31 17 73 15 531 -3 484 -4 497 -24 525 -47 64 -39 63 -574 63 -442 0 -488 -2 -519 -18z\"/><path d=\"M241 1282 c-19 -9 -44 -30 -55 -45 -20 -28 -21 -41 -24 -525 -3 -555 -4 -542 67 -589 l34 -23 496 0 c477 0 497 1 529 20 18 11 41 34 52 52 19 32 20 52 20 529 l0 496 -23 34 c-47 70 -36 69 -577 69 -442 0 -488 -2 -519 -18z m994 -582 l0 -475 -475 0 -475 0 -3 465 c-1 256 0 471 3 478 3 10 104 12 477 10 l473 -3 0 -475z\"/></g></svg>";
                originalName.innerHTML = item.characterJap !== '' ? "<a target=\"_blank\" href=\"".concat(characterLink, "\">").concat(copySvg, "&nbsp;").concat(item.characterJap, "</a>") : "<a target=\"_blank\" href=\"".concat(characterLink, "\">").concat(copySvg, "&nbsp;").concat(item.character, "</div></a>");
                originName.innerHTML = "<a target=\"_blank\" href=\"".concat(originLink, "\">").concat(copySvg, "&nbsp;").concat(item.origin, "</a>");
                classification.innerHTML = "<a target=\"_blank\" href=\"".concat(classificationLink, "\">").concat(copySvg, "&nbsp;").concat(item.classification, "</a>");
                if (item.type == 'Owned') {
                    a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
                }
                else if (item.type == 'Ordered') {
                    a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
                }
                else if (item.type == 'Wished') {
                    a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
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
                            console.log(target);
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
                Object.keys(figure).forEach(function (key) {
                    if (searchStr.test(figure[key])) {
                        count += 1;
                    }
                });
                return count === 0;
            });
            var divs = document.querySelectorAll('.pinterest-grid-item');
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
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, fetch("".concat(server, "contents?filename=mfc"))];
                case 1: return [4 /*yield*/, (_a.sent()).json()];
                case 2:
                    result = _a.sent();
                    createElementPromise = new Promise(function (resolve, reject) {
                        resolve(result.sort(function (a, b) { return Number(a.id) - Number(b.id); }).map(createElement));
                    });
                    createElementPromise.then(function () {
                        setTimeout(resizeAllMasonryItems, 1000);
                        setTimeout(resizeAside, 1000);
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
            }
        });
    });
}
;
// To add a MyAnimeList card
function scrapeMyAnimeList() {
    return __awaiter(this, void 0, void 0, function () {
        function scrapeDataFromMAL(offset) {
            return __awaiter(this, void 0, void 0, function () {
                var animeData, animeDataData, mangaData, mangaDataData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch("".concat(server, "myanimelist?type=animelist&username=HikariMontgomery&offset=").concat(offset))
                                .then(function (response) { return response.json(); })];
                        case 1:
                            animeData = _a.sent();
                            animeDataData = animeData.data.filter(function (entry) { return entry.node.nsfw === 'white'; }).slice(0, 10);
                            return [4 /*yield*/, fetch("".concat(server, "myanimelist?type=mangalist&username=HikariMontgomery&offset=").concat(offset))
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
                div.style.display = mobile ? '' : 'none';
                img.style.opacity = mobile ? '0.25' : '1';
                span.appendChild(p2);
                span.appendChild(p3);
                if (entry.list_status.score !== 0) {
                    var p4 = document.createElement('p');
                    p4.innerHTML = "<span>Pontua\u00E7\u00E3o&nbsp;</span><span>".concat('⭐'.repeat(entry.list_status.score), "\n(").concat(entry.list_status.score, "/10)</span>");
                    span.appendChild(p4);
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
                var closestDistance = Infinity; //First distance as a number
                anchors.forEach(function (anchor) {
                    var anchorRect = anchor.getBoundingClientRect();
                    var anchorCenter = anchorRect.left + anchorRect.width / 2;
                    var distance = Math.abs(center - anchorCenter);
                    if (distance < closestDistance) {
                        closestDistance = distance; //Assigns the lowest possible distance
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
                            card.style.scrollBehavior = 'auto'; //Sets to 'auto' momentanely
                            card.scrollLeft += (newOffset - previousOffset);
                            card.scrollBy({ left: -width / anchors.length, behavior: 'smooth' });
                            card.style.scrollBehavior = 'smooth'; //Reverts it to 'smooth'
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
                            card.style.scrollBehavior = 'auto'; //Sets to 'auto' momentanely
                            card.scrollLeft += (newOffset - previousOffset);
                            card.scrollBy({ left: width / anchors.length, behavior: 'smooth' });
                            card.style.scrollBehavior = 'smooth'; //Reverts it to 'smooth'
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
        var output, animeCard, mangaCard;
        return __generator(this, function (_a) {
            ;
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
}
;
window.addEventListener('load', onLoadFunctions, true);
function onLoadFunctions(ev) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createLoaders(10);
                    return [4 /*yield*/, loadContentFromJson()];
                case 1:
                    _a.sent();
                    dragAndDropHandler();
                    openLinksInNewTab();
                    redirectToEdge();
                    figuresSitDown();
                    expandAside();
                    setDefaults();
                    adjustGamecard();
                    rotateGamecardText(0);
                    makeSwitchesSlide();
                    // mfcToggleSwitch();
                    nightModeToggle();
                    formatPopUps();
                    dragPopUps();
                    stopImageDrag();
                    redditSearchTrigger();
                    wikipediaSearchTrigger();
                    resizeHeader();
                    makeAsideButtonFollow();
                    if (mobile)
                        goThroughRules(document.styleSheets[0].cssRules);
                    return [4 /*yield*/, Promise.all([addMfcImages(), scrapeMyAnimeList()])];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
;
window.addEventListener('resize', onResizeFunctions, true);
function onResizeFunctions(ev) {
    setTimeout(function () {
        resizeAside();
        figuresSitDown();
        rotateGamecardText(0);
    }, 500);
}
;
window.addEventListener('scroll', onScrollFunctions, true);
function onScrollFunctions(ev) {
    resizeHeader();
}
;
