var SharedDomFunctions = /** @class */ (function () {
    function SharedDomFunctions() {
    }
    SharedDomFunctions.createLoaders = function (counter) {
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
    };
    ;
    SharedDomFunctions.formatPopUps = function () {
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
                    object.popUpContainer.style.display = 'none';
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
                        label.style.left = Math.max(left, 5) + 'px';
                        if (input.placeholder)
                            input.placeholder = input.placeholder;
                        else
                            input.placeholder = ' ';
                        console.log(left);
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
    };
    ;
    SharedDomFunctions.createBrokenImageFallback = function () {
        document.querySelectorAll('object').forEach(function (object) {
            object.innerHTML = "<svg version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\" viewBox=\"0 0 980 736\" preserveAspectRatio=\"xMidYMid meet\">\n\t\t\t\t<title>broken image</title>\n\t\t\t\t<g transform=\"translate(0,736) scale(0.100000,-0.100000)\" fill=\"var(--contrast-color-3)\" stroke=\"none\">\n\t\t\t\t\t<path d=\"M920 7343 c-431 -76 -769 -384 -887 -808 l-28 -100 0 -2755 0 -2755 27 -98 c74 -268 239 -497 466 -645 155 -101 310 -154 506 -172 76 -8 1335 -10 3976 -8 l3865 3 90 22 c414 97 716 387 832 798 l28 100 3 2700 c2 1926 0 2723 -8 2780 -17 122 -46 220 -100 331 -139 289 -385 492 -708 586 l-77 23 -3980 1 c-2189 1 -3991 -1 -4005 -3z m7949 -420 c273 -64 425 -211 493 -478 l23 -90 0 -2675 0 -2675 -23 -90 c-68 -267 -220 -414 -493 -478 l-94 -22 -3795 -3 c-2592 -2 -3830 0 -3906 8 -333 31 -529 165 -614 418 -52 156 -50 59 -50 2842 0 2783 -2 2686 50 2842 67 198 215 333 428 388 45 12 119 25 164 29 46 5 1802 8 3903 7 l3820 -1 94 -22z\"/>\n\t\t\t\t\t<path d=\"M1681 6319 c-242 -47 -461 -214 -570 -434 -66 -132 -86 -218 -85 -370 1 -157 22 -244 89 -373 104 -200 289 -351 511 -414 105 -30 304 -32 409 -4 302 80 529 313 600 616 19 82 19 264 1 351 -64 300 -306 547 -609 619 -88 21 -262 26 -346 9z\"/>\n\t\t\t\t\t<path d=\"M5405 4800 c-739 -627 -1325 -1115 -1331 -1112 -6 4 -234 186 -507 405 -273 220 -501 397 -508 395 -6 -2 -467 -368 -1025 -813 l-1013 -810 2 -920 2 -920 3875 0 3875 0 3 1531 2 1532 -1015 913 c-558 503 -1021 915 -1028 916 -6 1 -606 -502 -1332 -1117z\"/>\n\t\t\t\t</g>\n\t\t\t</svg>";
        });
    };
    ;
    return SharedDomFunctions;
}());
export default SharedDomFunctions;
var TemplateConstructor = /** @class */ (function () {
    function TemplateConstructor(template, data) {
        var element = document.createElement('element');
        // x
        function createNestedTagInThisLevel(currentData, currentElement, fragment, prefix) {
            if (currentData === void 0) { currentData = data; }
            if (currentElement === void 0) { currentElement = element; }
            if (fragment === void 0) { fragment = template; }
            if (prefix === void 0) { prefix = ''; }
            var cloneElement = document.importNode(currentElement);
            for (var _i = 0, currentData_1 = currentData; _i < currentData_1.length; _i++) {
                var item = currentData_1[_i];
                var elementToBePushed = document.importNode(fragment, true);
                cloneElement.appendChild(elementToBePushed);
                var _loop_1 = function (key) {
                    var keyToLookUp = prefix === '' ? key : "".concat(prefix, "-").concat(key);
                    if (item[keyToLookUp] instanceof Array) {
                        var templateChildElements_1 = cloneElement.querySelectorAll('.' + keyToLookUp + '-template');
                        item[keyToLookUp].forEach(function (child) {
                            templateChildElements_1.forEach(function (el, i) {
                                var newTemplate = document.createElement('template');
                                var newFragment = newTemplate.content;
                                newFragment.appendChild(document.importNode(el, true));
                                var newElementToBePushedString = createNestedTagInThisLevel([child], document.importNode(el, true), newFragment, keyToLookUp);
                                var newElementToBePushed = document.createElement(el.tagName.toLowerCase());
                                el.parentElement.insertBefore(newElementToBePushed, el);
                                newElementToBePushed.outerHTML = newElementToBePushedString.replaceAll(keyToLookUp + '-template', ''); // Removing this line breaks the whole page due to StackOverflow.
                            });
                        });
                        templateChildElements_1.forEach(function (el) { return el.remove(); });
                        cloneElement.innerHTML = cloneElement.innerHTML.replaceAll("{{".concat(keyToLookUp, "}}"), JSON.stringify(item[key]));
                        for (var _c = 0, _d = Array.from(cloneElement.attributes); _c < _d.length; _c++) {
                            var attr = _d[_c];
                            attr.value = attr.value.replaceAll("{{".concat(keyToLookUp, "}}"), JSON.stringify(item[key]));
                        }
                        ;
                    }
                    else {
                        cloneElement.innerHTML = cloneElement.innerHTML.replaceAll("{{".concat(keyToLookUp, "}}"), item[key]);
                        for (var _e = 0, _f = Array.from(cloneElement.attributes); _e < _f.length; _e++) {
                            var attr = _f[_e];
                            attr.value = attr.value.replaceAll("{{".concat(keyToLookUp, "}}"), item[key]);
                        }
                        ;
                    }
                    ;
                };
                for (var key in item) {
                    _loop_1(key);
                }
                ;
                var regEx = /\{\{[a-zA-Z\-\ \.]+\}\}/g;
                cloneElement.innerHTML = cloneElement.innerHTML.replace(regEx, '');
                for (var _a = 0, _b = Array.from(cloneElement.attributes); _a < _b.length; _a++) {
                    var attr = _b[_a];
                    attr.value = attr.value.replace(regEx, '');
                }
                ;
            }
            ;
            return cloneElement.innerHTML;
        }
        ;
        element.innerHTML = createNestedTagInThisLevel();
        this.html = element.innerHTML;
    }
    ;
    TemplateConstructor.prototype.insert = function (destination, position, relative) {
        if (relative) {
            if (relative.parentElement !== destination) {
                throw new Error('"relative" should be a childNode of "destination".');
            }
            ;
        }
        ;
        if (!position) {
            destination.innerHTML = this.html;
        }
        else {
            var element = document.createElement('element');
            element.innerHTML = this.html;
            if (position === 'before') {
                for (var _i = 0, _a = Array.from(element.childNodes); _i < _a.length; _i++) {
                    var child = _a[_i];
                    destination.insertBefore(child, relative);
                }
                ;
            }
            else if (position === 'after') {
                if (relative === null || relative === void 0 ? void 0 : relative.nextElementSibling) {
                    var nextSibling = relative.nextSibling;
                    for (var _b = 0, _c = Array.from(element.childNodes); _b < _c.length; _b++) {
                        var child = _c[_b];
                        destination.insertBefore(child, nextSibling);
                    }
                    ;
                }
                else {
                    for (var _d = 0, _e = Array.from(element.childNodes); _d < _e.length; _d++) {
                        var child = _e[_d];
                        destination.appendChild(child);
                    }
                    ;
                }
            }
            ;
        }
        ;
    };
    ;
    return TemplateConstructor;
}());
export { TemplateConstructor };
;
var ua = navigator.userAgent || navigator.vendor || window.opera;
var mobile = /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(ua.toLowerCase());
if (!mobile)
    document.querySelector('body').classList.add('has-hover');
switch (localStorage.getItem('darkOrLightTheme')) {
    case 'light':
        document.documentElement.setAttribute('data-theme', 'light');
        break;
    case 'dark':
        document.documentElement.setAttribute('data-theme', 'dark');
        break;
    default:
        break;
}
;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('../service-worker.js')
        .then(function (reg) { return console.log('Service Worker registered with scope:', reg.scope); })
        .catch(function (error) { return console.error('Service Worker registration failed:', error); });
}
;
