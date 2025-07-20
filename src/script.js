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
var mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var portrait = (window.innerWidth < window.innerHeight);
if (mobile) {
    document.title = document.title + ' (Mobile)';
    console.log('Running mobile.');
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
    shortcuts.forEach(function (element) {
        if (element.href.match(/docs\.google\.com/) == null || mobile) {
            element.target = '_blank';
        }
    });
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
    var card = document.querySelector('.card');
    var owned = card.querySelector('.pinterest-grid#owned-ordered');
    var wished = card.querySelector('.pinterest-grid#wished');
    var shortcuts = document.querySelector('#shortcuts');
    var maxHeight = Math.max(owned.offsetHeight, wished.offsetHeight);
    aside.style.height = Math.max(shortcuts.offsetHeight, (maxHeight + 90)) + 'px';
    card.style.height = maxHeight + 'px';
    shortcuts.style.height = Math.max(shortcuts.offsetHeight, (maxHeight + 90)) + 'px';
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
                flexContainer.style.gridTemplateColumns = '54vw 40px 1fr';
                input.style.width = "calc((46vw - 40px - 10px) * 0.9)";
                input.style.left = "calc(((44vw - 10px) * 0.1) / 2)";
            }
            else {
                span.style.transform = "rotate(0deg) translate(0%,-10%)";
                flexContainer.style.gridTemplateColumns = '76vw 40px 1fr';
                input.style.width = "calc((24vw - 40px - 10px) * 0.9)";
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
        resizeAside();
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
// To make the header have different backgrounds
function setHeaderBackground() {
    var filePath = 'images/headers/';
    fetch("".concat(filePath, "headers.json"))
        .then(function (res) { return res.json(); })
        .then(function (json) {
        var index = CustomFunctions.randomIntFromInterval(1, json.length);
        var src = filePath + json[index - 1];
        json.forEach(function (imgSrc) {
            var img = new Image();
            img.src = filePath + imgSrc;
        });
        var header = document.querySelector('#header');
        var h1 = header.querySelector('h1');
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
            var arr = json.filter(function (headerImg) {
                return headerImg != src.split('/')[2];
            });
            var indexArr = CustomFunctions.randomIntFromInterval(1, arr.length);
            src = filePath + arr[indexArr - 1];
            header.style.backgroundImage = "url('".concat(src, "')");
        };
    });
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
        var otherClass = Array.from(form.classList).filter(function (className) {
            return className !== 'pop-up';
        })[0];
        var openButton = Array.from(document.querySelectorAll(".".concat(otherClass))).find(function (el) { return el.classList.contains('shortcut-item'); });
        if (openButton) {
            popUpShortcuts.push({ button: openButton, popUpContainer: form });
        }
        ;
    });
    popUpShortcuts.forEach(function (object) {
        var popUpClass = document.querySelectorAll('.pop-up');
        var floatingLabelElement = object.popUpContainer.querySelectorAll('.floating-label');
        object.button.onclick = function () {
            var display = object.popUpContainer.style.display;
            if ((display == '') || (display == 'none')) {
                object.popUpContainer.style.display = 'block'; //Makes the popUp appear
            }
            else {
                object.popUpContainer.style.display = 'none'; //Makes the popUp disappear
            }
            ;
            popUpClass.forEach(function (element) {
                if (element != object.popUpContainer) {
                    element.style.display = 'none';
                }
                ;
            });
            floatingLabelElement.forEach(function (label) {
                var parent = label.parentElement;
                var siblings = Array.from(parent.children);
                var input = siblings[siblings.indexOf(label) - 1]; //Gets the imediate predecessor sibling
                var rect = object.popUpContainer.getBoundingClientRect();
                var inputRect = input.getBoundingClientRect();
                var left = inputRect.left - rect.left;
                label.style.left = left + 'px';
                input.setAttribute('placeholder', ' ');
            });
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
// To make MFC pop-up adjust
function mfcPopUpAdjust() {
    var mfc = document.querySelector('.pop-up.mfc');
    // To make it have the proper aspect ratio
    var a;
    var fontSize = parseFloat(getComputedStyle(mfc).fontSize);
    // alert(fontSize);
}
;
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
        if ((target === this || CustomFunctions.isParent(target, this)) &&
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
function addImages() {
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
            var _this = this;
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
                    characterLink = "https://buyee.jp/item/search/query/".concat(item.characterJap, "/category/2084023782?sort=end&order=a&store=1");
                }
                else {
                    characterLink = "https://buyee.jp/item/search/query/".concat(item.character, "/category/2084023782?sort=end&order=a&store=1");
                }
                ;
                if (item.origin !== 'オリジナル' && item.origin !== undefined) {
                    originName.parentElement.style.display = '';
                    originLink = "https://buyee.jp/item/search/query/".concat(item.origin, "/category/2084023782?sort=end&order=a&store=1");
                }
                else {
                    originName.parentElement.style.display = 'none';
                }
                ;
                if (item.classification !== undefined) {
                    classification.parentElement.style.display = '';
                    classificationLink = "https://buyee.jp/item/search/query/".concat(item.classification.replaceAll('#', ''), "/category/2084023782?sort=end&order=a&store=1");
                }
                else {
                    classification.parentElement.style.display = 'none';
                }
                ;
                title.innerHTML = item.title;
                popUpImgAnchor.href = item.href;
                popUpImg.src = img.src;
                popUpImg.style.border = "".concat(imgBorder, " solid ").concat(div.style.color);
                originalName.innerHTML = item.characterJap !== '' ? "<a target=\"_blank\" href=\"".concat(characterLink, "\">").concat(item.characterJap, "</a>") : "<a target=\"_blank\" href=\"".concat(characterLink, "\">").concat(item.character, "</a>");
                originName.innerHTML = "<a target=\"_blank\" href=\"".concat(originLink, "\">").concat(item.origin, "</a>");
                classification.innerHTML = "<a target=\"_blank\" href=\"".concat(classificationLink, "\">").concat(item.classification, "</a>");
                if (item.type == 'Owned') {
                    a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
                }
                else if (item.type == 'Ordered') {
                    a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
                }
                else if (item.type == 'Wished') {
                    a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
                }
                if (navigator.userAgent.includes('Android') || navigator.userAgent.includes('like Mac OS')) {
                    //NEXT LINE MUST BE CHANGED EACH TIME A LINK IS ADDED 
                    var links_1 = [originalName, originName, classification];
                    var updateLinks = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _loop_1, _i, links_2, itemLink;
                        return __generator(this, function (_a) {
                            _loop_1 = function (itemLink) {
                                var anchorChild = itemLink.firstElementChild;
                                anchorChild.href = '';
                                anchorChild.target = '';
                                anchorChild.onclick = function (event) {
                                    event.preventDefault();
                                    void navigator.clipboard.writeText(itemLink.textContent);
                                };
                            };
                            for (_i = 0, links_2 = links_1; _i < links_2.length; _i++) {
                                itemLink = links_2[_i];
                                _loop_1(itemLink);
                            }
                            ;
                            return [2 /*return*/];
                        });
                    }); };
                    updateLinks();
                }
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
        var result, createElementPromise, card, observer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, fetch('https://statisticshock-github-io.onrender.com/figurecollection/')];
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
                    window.addEventListener('resize', function () {
                        setTimeout(function () {
                            resizeAllMasonryItems;
                        }, 500);
                    });
                    setTimeout(function () {
                        var loader = document.querySelector('aside > .card > .loader');
                        var pinterestGrids = document.querySelectorAll('aside > .card > .pinterest-grid');
                        loader.style.display = 'none';
                        pinterestGrids.forEach(function (grid) {
                            grid.style.opacity = '1';
                        });
                    }, 1000);
                    card = document.querySelector('aside .card');
                    observer = new MutationObserver(function () { resizeAside(); });
                    observer.observe(card, { childList: true, subtree: true });
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
                        case 0: return [4 /*yield*/, fetch("https://statisticshock-github-io.onrender.com/animelist/HikariMontgomery/".concat(offset))
                                .then(function (response) { return response.json(); })];
                        case 1:
                            animeData = _a.sent();
                            animeDataData = animeData.data.filter(function (entry) { return entry.node.nsfw === 'white'; }).slice(0, 10);
                            return [4 /*yield*/, fetch("https://statisticshock-github-io.onrender.com/mangalist/HikariMontgomery/".concat(offset))
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
                    p4.innerHTML = "<span>Pontua\u00E7\u00E3o&nbsp;</span><span>".concat('⭐'.repeat(entry.list_status.score), " (").concat(entry.list_status.score, "/10)</span>");
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
function onLoadFunctions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createLoaders(10);
                    openLinksInNewTab();
                    redirectToEdge();
                    setHeaderBackground();
                    figuresSitDown();
                    expandAside();
                    setDefaults();
                    adjustGamecard();
                    rotateGamecardText(0);
                    makeSwitchesSlide();
                    // mfcToggleSwitch();
                    nightModeToggle();
                    resizeAside(0);
                    formatPopUps();
                    mfcPopUpAdjust();
                    dragPopUps();
                    stopImageDrag();
                    redditSearchTrigger();
                    wikipediaSearchTrigger();
                    resizeHeader();
                    makeAsideButtonFollow();
                    return [4 /*yield*/, addImages()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, scrapeMyAnimeList()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
;
window.addEventListener('resize', onResizeFunctions, true);
function onResizeFunctions() {
    setTimeout(function () {
        resizeAside();
        figuresSitDown();
        rotateGamecardText(0);
        mfcPopUpAdjust();
    }, 500);
}
;
window.addEventListener('mousemove', onMouseMoveFunctions, true);
function onMouseMoveFunctions(event) {
    // console.log(event.target);
}
;
window.addEventListener('scroll', onScrollFunctions, true);
function onScrollFunctions(event) {
    resizeHeader();
}
;
