export default class SharedDomFunctions {
    static createLoaders(counter) {
        let loaders = document.querySelectorAll('.loader');
        loaders.forEach(loader => {
            for (let i = 0; i < counter; i++) {
                const div = document.createElement('div');
                div.setAttribute('class', 'loading');
                div.setAttribute('style', `--translation: 150; --index: ${i + 1}; --count: ${counter}`);
                loader.appendChild(div);
            }
            ;
        });
    }
    ;
    static formatPopUps() {
        const popUpShortcuts = [];
        function observer(form) {
            const _observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'style') {
                        setTimeout(() => {
                            const floatingLabelElement = form.querySelectorAll('.floating-label');
                            floatingLabelElement.forEach((label) => {
                                const parent = label.parentElement;
                                const siblings = Array.from(parent.children);
                                const input = siblings[siblings.indexOf(label) - 1];
                                const rect = form.getBoundingClientRect();
                                const inputRect = input.getBoundingClientRect();
                                const left = inputRect.left - rect.left;
                                label.style.left = Math.max(left, 5) + 'px';
                                if (input.placeholder)
                                    input.placeholder = input.placeholder;
                                else
                                    input.placeholder = ' ';
                            });
                        }, 10);
                    }
                });
            });
            _observer.observe(form, { attributeFilter: ['style'] });
        }
        ;
        document.querySelectorAll('form.pop-up').forEach((form) => {
            observer(form);
            if (form.classList.length < 2)
                return;
            const otherClass = Array.from(form.classList).filter((className) => className !== 'pop-up')[0];
            const openBttn = Array.from(document.querySelectorAll(`.${otherClass}`)).filter((element) => element.classList.contains('pop-up-open'))[0];
            popUpShortcuts.push({ button: openBttn, popUpContainer: form });
        });
        popUpShortcuts.forEach((object) => {
            let popUpClass = document.querySelectorAll('.pop-up');
            object.button.onclick = () => {
                let display = object.popUpContainer.style.display;
                if ((display == '') || (display == 'none')) {
                    object.popUpContainer.style.display = 'block';
                }
                else if (!(object.popUpContainer.classList.contains('create-shortcut') && object.button.classList.contains('create-shortcut') && !(object.button.id.replace('-button', '-item') === object.popUpContainer.getAttribute('x')))) {
                    object.popUpContainer.style.display = 'none';
                }
                ;
                popUpClass.forEach((element) => {
                    if (element != object.popUpContainer) {
                        element.style.display = 'none';
                    }
                    ;
                });
            };
            object.popUpContainer.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    let okButton = object.popUpContainer.querySelector('.ok-button');
                    okButton.click();
                }
            });
        });
    }
    ;
}
;
export class TemplateConstructor {
    constructor(template, data) {
        function fillTempate(templateToFill, dataToFill = data) {
            var _a, _b;
            const newFragment = document.createDocumentFragment();
            for (const item of dataToFill) {
                const tpt = templateToFill.content.cloneNode(true);
                const walker = document.createTreeWalker(tpt);
                const bindings = [];
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        for (const attr of Array.from(node.attributes)) {
                            const matches = (_a = attr.textContent) === null || _a === void 0 ? void 0 : _a.match(/\{\{(\S+?)\}\}/g);
                            if (!matches)
                                continue;
                            for (const key of matches) {
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
                        const matches = (_b = node.textContent) === null || _b === void 0 ? void 0 : _b.match(/\{\{(\S+?)\}\}/g);
                        if (!matches)
                            continue;
                        for (const key of matches) {
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
                for (const binding of bindings.sort((a, b) => a.key.split('-').length - b.key.split('-').length)) {
                    if (Array.isArray(item[binding.key])) {
                        const newTemplate = tpt.querySelector('#' + binding.key);
                        const [el] = Array.from(tpt.querySelectorAll('element')).filter((el) => el.textContent === `{{${binding.key}}}`);
                        el.parentElement.insertBefore(fillTempate(newTemplate, item[binding.key]).cloneNode(true), el);
                        el.remove();
                    }
                    else {
                        binding.node.textContent = binding.node.textContent.replace(binding.key, item[binding.key] || '').replace(/[\{\}]/g, '');
                    }
                    ;
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
    insert(destination, position, relative) {
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
            const element = document.createElement('element');
            element.appendChild(this.html.cloneNode(true));
            if (position === 'before') {
                for (const child of Array.from(element.childNodes)) {
                    destination.insertBefore(child, relative);
                }
                ;
            }
            else if (position === 'after') {
                if (relative === null || relative === void 0 ? void 0 : relative.nextElementSibling) {
                    const nextSibling = relative.nextSibling;
                    for (const child of Array.from(element.childNodes)) {
                        destination.insertBefore(child, nextSibling);
                    }
                    ;
                }
                else {
                    for (const child of Array.from(element.childNodes)) {
                        destination.appendChild(child);
                    }
                    ;
                }
            }
            ;
        }
        ;
        return this;
    }
    ;
}
;
const ua = navigator.userAgent || navigator.vendor || window.opera;
const mobile = /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(ua.toLowerCase());
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
        .then((reg) => console.log('Service Worker registered with scope:', reg.scope))
        .catch((error) => console.error('Service Worker registration failed:', error));
}
;
