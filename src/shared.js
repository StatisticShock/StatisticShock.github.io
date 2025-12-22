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
    return SharedDomFunctions;
}());
export default SharedDomFunctions;
;
var TemplateConstructor = /** @class */ (function () {
    function TemplateConstructor(template, data) {
        function fillTempate(templateToFill, dataToFill) {
            var _a, _b;
            if (dataToFill === void 0) { dataToFill = data; }
            var newFragment = document.createDocumentFragment();
            for (var _i = 0, dataToFill_1 = dataToFill; _i < dataToFill_1.length; _i++) {
                var item = dataToFill_1[_i];
                var tpt = templateToFill.content.cloneNode(true);
                var walker = document.createTreeWalker(tpt);
                var bindings = [];
                while (walker.nextNode()) {
                    var node = walker.currentNode;
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        for (var _c = 0, _d = Array.from(node.attributes); _c < _d.length; _c++) {
                            var attr = _d[_c];
                            var matches = (_a = attr.textContent) === null || _a === void 0 ? void 0 : _a.match(/\{\{(\S+?)\}\}/g);
                            if (!matches)
                                continue;
                            for (var _e = 0, matches_1 = matches; _e < matches_1.length; _e++) {
                                var key = matches_1[_e];
                                bindings.push({
                                    key: key.replace(/[\{\}]/g, ''),
                                    node: attr,
                                });
                            }
                            ;
                        }
                        ;
                    }
                    else {
                        var matches = (_b = node.textContent) === null || _b === void 0 ? void 0 : _b.match(/\{\{(\S+?)\}\}/g);
                        if (!matches)
                            continue;
                        for (var _f = 0, matches_2 = matches; _f < matches_2.length; _f++) {
                            var key = matches_2[_f];
                            bindings.push({
                                key: key.replace(/[\{\}]/g, ''),
                                node: node,
                            });
                        }
                        ;
                    }
                    ;
                }
                ;
                var _loop_1 = function (binding) {
                    if (Array.isArray(item[binding.key])) {
                        var newTemplate = tpt.querySelector('#' + binding.key);
                        var el = Array.from(tpt.querySelectorAll('element')).filter(function (el) { return el.textContent === "{{".concat(binding.key, "}}"); })[0];
                        el.parentElement.insertBefore(fillTempate(newTemplate, item[binding.key]).cloneNode(true), el);
                        el.remove();
                    }
                    else {
                        binding.node.textContent = binding.node.textContent.replace(binding.key, item[binding.key] || '').replace(/[\{\}]/g, '');
                    }
                    ;
                };
                for (var _g = 0, _h = bindings.sort(function (a, b) { return a.key.split('-').length - b.key.split('-').length; }); _g < _h.length; _g++) {
                    var binding = _h[_g];
                    _loop_1(binding);
                }
                newFragment.appendChild(tpt);
            }
            ;
            return newFragment;
        }
        ;
        this.html = fillTempate(template);
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
            destination.innerHTML = '';
            destination.appendChild(this.html.cloneNode(true));
        }
        else {
            var element = document.createElement('element');
            element.appendChild(this.html.cloneNode(true));
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
        return this;
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
