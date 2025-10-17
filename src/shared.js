var SharedDomFunctions = /** @class */ (function () {
    function SharedDomFunctions(template, data) {
        var element = document.createElement('span');
        function createNestedTagInThisLevel(currentElement, currentData, prefix) {
            if (currentElement === void 0) { currentElement = element; }
            if (currentData === void 0) { currentData = data; }
            if (prefix === void 0) { prefix = ''; }
            var string = '';
            for (var key in currentData) {
                if (currentData[key] instanceof Array) {
                }
                else {
                }
            }
            ;
            return string;
        }
        ;
        element.outerHTML = createNestedTagInThisLevel();
        this.html = element.outerHTML;
    }
    ;
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
    SharedDomFunctions.createPageLoadAwaiter = function () {
    };
    return SharedDomFunctions;
}());
export default SharedDomFunctions;
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
