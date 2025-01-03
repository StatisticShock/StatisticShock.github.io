"use strict";
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
// Open in new tab
function openLinksInNewTab() {
    var shortcuts = document.querySelectorAll('.shortcut-item');
    shortcuts.forEach(function (element) {
        if (element.href.match(/docs\.google\.com/) == null) {
            element.target = '_blank';
        }
    });
    var gamecards = document.querySelectorAll('.gamecard');
    gamecards.forEach(function (element) {
        var child = element.firstElementChild;
        if (child.href.match(/docs\.google\.com/) == null) {
            child.target = '_blank';
        }
    });
}
//To make sheets open in edge
function redirectToEdge() {
    var links = document.querySelectorAll('a');
    links.forEach(function (link) {
        var hyperlink = link.href;
        if (hyperlink.match(/docs\.google\.com/)) {
            link.href = 'microsoft-edge:' + hyperlink;
            link.target = '';
        }
    });
}
//To make aside the same height of Shortcut-Item
function resizeAside(counter) {
    var aside = document.querySelector('aside');
    var card = document.querySelector('.card');
    var pinterest = document.querySelector('#owned');
    var shortcuts = document.querySelector('#shortcuts');
    aside.style.height = 'fit-content';
    card.style.height = 'fit-content';
    shortcuts.style.height = 'fit-content';
    var maxHeight = Math.max(pinterest.offsetHeight, shortcuts.offsetHeight);
    aside.style.height = maxHeight + 'px';
    card.style.height = maxHeight + 'px';
    shortcuts.style.height = maxHeight + 'px';
    if (counter == 0) {
        setTimeout(function () {
            resizeAside(1);
        }, 750);
    }
}
// To make the gamecard occupy 50% of the screen on hover
function adjustGamecard() {
    var gameCardContainers = document.querySelectorAll('.gamecard-container');
    gameCardContainers.forEach(function (gamecard_container) {
        var childCount = Math.max(gamecard_container.children.length, 2).toString();
        gamecard_container.style.setProperty('--gamecard-count', childCount);
    });
    var gameCardText = document.querySelectorAll('.gamecard-text > span p');
    gameCardText.forEach(function (element) {
        element.style.marginLeft = -(element.offsetWidth / 2 - 20) + 'px';
    });
}
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
// To make the header have different backgrounds
function setHeaderBackground() {
    var bgs = [
        'grand_blue.jpg',
        'sam_integralista.jpg'
    ];
    var headerIndex = Math.floor(Math.random() * bgs.length);
    var header = document.getElementById('header');
    header.style.backgroundImage = 'url(headers/' + bgs[headerIndex] + ')';
}
// To make 2B and Ai sit on the navbar (and makke the MFC toggle sit under 2B)
function figuresSitDown() {
    var twoB = document.getElementById('twoB');
    var twoB_Ass = Math.floor(parseFloat(getComputedStyle(twoB).height) * 493 / 920);
    var twoB_Pussy = Math.floor(parseFloat(getComputedStyle(twoB).width) * 182 / 356);
    var aside = document.querySelector('aside');
    twoB.style.top = (-twoB_Ass) + 'px';
    twoB.style.right = (aside.offsetWidth / 2 - twoB_Pussy) + 'px';
    var ohto = document.getElementById('ohto');
    var ohto_panties = getComputedStyle(ohto).height;
    var ohto_mouth = Math.floor(parseFloat(getComputedStyle(ohto).width) / 2);
    ohto.style.top = '-' + ohto_panties;
    ohto.style.left = getComputedStyle(twoB).right;
    var toggleSwitch = document.getElementById('mfc-switch');
    toggleSwitch.style.right = parseFloat(twoB.style.right) + twoB.offsetWidth / 2 + 'px';
    toggleSwitch.style.transform = 'translate(50%, 0)';
}
//To make all switches work
function makeSwitchesSlide() {
    var sliders = document.querySelectorAll('.switch > .slider');
    sliders.forEach(function (slider) {
        var parent = slider.parentElement;
        var input = parent.querySelector('input');
        var uncheckedPosition = getComputedStyle(slider, '::before').left;
        var checkedPosition = parent.offsetWidth - parseFloat(uncheckedPosition) * 3 - parseFloat(getComputedStyle(slider, ':before').width) + 'px';
        slider.style.setProperty('--total-transition', checkedPosition);
        input.style.setProperty('--total-transition', checkedPosition);
    });
}
//To make MFC toggle switch work
function toggleSwitch() {
    var input = document.querySelector('#mfc-switch > input');
    var owned = document.getElementById('owned');
    var ordered = document.getElementById('ordered');
    var card = document.querySelector('.card');
    input.onclick = function () {
        if (input.checked) {
            owned.style.transform = 'translateX(-100%)';
            ordered.style.transform = 'translateX(0%)';
            card.setAttribute('href', 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=0&categoryId=-1&output=3&sort=category&order=asc&_tb=user');
        }
        else {
            owned.style.transform = 'translateX(0%)';
            ordered.style.transform = 'translateX(100%)';
            card.setAttribute('href', 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=0&categoryId=-1&output=3&sort=category&order=asc&_tb=user');
        }
        ;
    };
    ordered.style.transform = 'translateX(100%)'; // Put it to the right so it doesn't appear on page load
    ordered.style.display = 'grid'; // Make it "visible"
    resizeAllMasonryItems(); // Resize the hidden entries
}
//To make the popups appear on click
function formatPopUps() {
    var popUpShortcuts = [
        { button: 'reddit-google', popUpContainer: 'reddit-search-pop-up' },
        { button: 'wikipedia', popUpContainer: 'wikipedia-pop-up' }
    ];
    popUpShortcuts.forEach(function (object) {
        var buttonElement = document.getElementById(object.button);
        var popUpElement = document.getElementById(object.popUpContainer);
        var popUpClass = document.querySelectorAll('.pop-up');
        var floatingLabelElement = popUpElement.querySelectorAll('.floating-label');
        buttonElement.onclick = function () {
            var display = popUpElement.style.display;
            if ((display == '') || (display == 'none')) {
                popUpElement.style.display = 'block'; //Makes the popUp appear
            }
            else {
                popUpElement.style.display = 'none'; //Makes the popUp disappear
            }
            ;
            popUpClass.forEach(function (element) {
                if (element != popUpElement) {
                    element.style.display = 'none';
                }
                ;
            });
            floatingLabelElement.forEach(function (label) {
                var parent = label.parentElement;
                var siblings = Array.from(parent.children);
                var input = siblings[siblings.indexOf(label) - 1]; //Gets the imediate predecessor sibling
                var rect = popUpElement.getBoundingClientRect();
                var inputRect = input.getBoundingClientRect();
                var left = inputRect.left - rect.left;
                label.style.left = left + 'px';
                input.setAttribute('placeholder', ' ');
            });
        };
        popUpElement.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault(); //Makes the form not submit
                var okButton = popUpElement.querySelector('.ok-button');
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
// To make the reddit search work
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
        if (window.open(string, '_blank')) {
            (_a = window.open(string, '_blank')) === null || _a === void 0 ? void 0 : _a.focus();
        }
        ;
    }
    ;
}
//To make the wikipedia search work
function wikipediaSearch() {
    var _a;
    var keywords = document.getElementById('keywords-wikipedia');
    var string = 'https://pt.wikipedia.org/w/index.php?search=';
    if (keywords.value) {
        string = string + keywords.value.replace(' ', '+');
        (_a = window.open(string, '_blank')) === null || _a === void 0 ? void 0 : _a.focus();
    }
}
// To make the inputbox draggable
function dragPopUp() {
    document.querySelectorAll('.pop-up').forEach(function (popUp) {
        // popUp.draggable = true;
    });
}
document.getElementById('reddit-search-ok').onclick = redditSearch;
document.getElementById('wikipedia-ok').onclick = wikipediaSearch;
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
// To add MFC images in the aside
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
    var allItems = document.querySelectorAll('pinterest-grid-item');
    for (var i = 0; i < allItems.length; i++) {
        resizeMasonryItem(allItems[i]);
    }
}
function shuffle(arr) {
    var j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    ;
    return arr;
}
function addImages() {
    return __awaiter(this, void 0, void 0, function () {
        function getCSVData(url) {
            return __awaiter(this, void 0, void 0, function () {
                var response, responseWithNoQuotation, data_1, splitData_1, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fetch(url).then(function (res) { return res.text(); })];
                        case 1:
                            response = _a.sent();
                            responseWithNoQuotation = response.replaceAll('"', '');
                            data_1 = responseWithNoQuotation.split(/\r?\n/);
                            splitData_1 = [];
                            data_1.forEach(function (row) {
                                splitData_1.push(row.split(/;/));
                            });
                            return [2 /*return*/, splitData_1];
                        case 2:
                            error_1 = _a.sent();
                            console.error(error_1.message);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        function arrayToObject(array) {
            var object = {
                id: array[0],
                title: array[1],
                category: array[3],
                status: array[8],
                tracking: array[17],
                price: array[14]
            };
            return object;
        }
        function createElement(item, cardName) {
            var div = document.createElement('div'); //The container
            var span = document.createElement('span'); // The price "pop-up"
            var img = document.createElement('img');
            div.setAttribute('alt', item.title);
            div.setAttribute('class', 'pinterest-grid-item');
            span.innerHTML = 'R$ ' + item.price.replace('.', ',');
            span.setAttribute('class', 'pinterest-grid-price');
            img.setAttribute('src', 'https://static.myfigurecollection.net/upload/items/2/' + item.id + '-' + item.tracking + '.jpg');
            if (item.category == 'Prepainted') {
                div.style.color = 'green';
                span.style.border = '2px solid green';
                img.style.border = '2px solid green';
            }
            else if (item.category == 'Action/Dolls') {
                div.style.color = 'blue';
                span.style.border = '2px solid blue';
                img.style.border = '2px solid blue';
            }
            else {
                div.style.color = 'orange';
                span.style.border = '2px solid orange';
                img.style.border = '2px solid orange';
            }
            div.append(img);
            div.append(span);
            var card = document.getElementById(cardName);
            card.append(div);
            div.append(item.title);
        }
        var dataOne, dataTwo, data, owned, ordered, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, getCSVData('myFigureCollection.csv')];
                case 1:
                    dataOne = _a.sent();
                    dataTwo = dataOne.map(arrayToObject);
                    data = shuffle(dataTwo);
                    owned = [];
                    ordered = [];
                    for (i = 1; i < data.length; i++) { // Loop through the values of dataObject
                        if (data[i].status == 'Owned') {
                            owned.push(data[i]);
                        }
                        else if (data[i].status == 'Ordered') {
                            ordered.push(data[i]);
                        }
                    }
                    owned.forEach(function (item) {
                        createElement(item, 'owned');
                    });
                    ordered.forEach(function (item) {
                        createElement(item, 'ordered');
                    });
                    resizeAllMasonryItems();
                    return [2 /*return*/];
            }
        });
    });
}
;
function priceFollowCursor() {
    var card = document.querySelector('.card');
    var prices = card.querySelectorAll('.pinterest-grid-price');
    card.addEventListener('mousemove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        prices.forEach(function (price) {
            price.style.left = x + 'px';
            price.style.top = 55 + y + 'px';
        });
    });
}
window.addEventListener('load', onLoadFunctions, true);
function onLoadFunctions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    openLinksInNewTab();
                    redirectToEdge();
                    setHeaderBackground();
                    figuresSitDown();
                    resizeAside(0);
                    setDefaults();
                    adjustGamecard();
                    rotateGamecardText(0);
                    dragPopUp();
                    return [4 /*yield*/, addImages()];
                case 1:
                    _a.sent();
                    toggleSwitch();
                    makeSwitchesSlide();
                    formatPopUps();
                    return [2 /*return*/];
            }
        });
    });
}
;
window.addEventListener('resize', onResizeFunctions, true);
function onResizeFunctions() {
    resizeAside();
    figuresSitDown();
    rotateGamecardText(0);
}
;
window.addEventListener('mousemove', onMouseMoveFunctions, true);
function onMouseMoveFunctions() {
    priceFollowCursor();
}
//# sourceMappingURL=script.js.map