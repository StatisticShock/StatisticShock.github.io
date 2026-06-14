var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CustomFunctions from '../util/functions.js';
class PageBehaviour {
    static stopImageDrag() {
        let images = document.getElementsByTagName('img');
        Array.from(images).forEach((img) => {
            img.setAttribute('draggable', 'false');
        });
    }
    ;
    static openLinksInNewTab() {
        const shortcuts = document.querySelectorAll('.shortcut-item');
        for (const element of Array.from(shortcuts)) {
            if (!element.href)
                continue;
            if (element.href.match(/docs\.google\.com/) == null || mobile) {
                element.target = '_blank';
            }
        }
        ;
        const gamecards = document.querySelectorAll('.gamecard');
        gamecards.forEach((element) => {
            let child = element.firstElementChild;
            if (child.href.match(/docs\.google\.com/) == null || mobile) {
                child.target = '_blank';
            }
        });
    }
    ;
    static nightModeToggle() {
        return __awaiter(this, void 0, void 0, function* () {
            const darkOrLightTheme = 'darkOrLightTheme';
            const svg = document.querySelector('switch svg#theme-toggle');
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
                const currentTheme = document.documentElement.getAttribute('data-theme');
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
        });
    }
    ;
    static collapseHeader() {
        const navbar = document.querySelector('nav.menu');
        const svg = navbar.querySelector('svg#expand-retract-header');
        const header = document.querySelector('header');
        svg.addEventListener('click', (ev) => __awaiter(this, void 0, void 0, function* () {
            navbar.classList.toggle('animated');
            header.classList.toggle('hidden');
        }));
    }
    ;
    static makeSwitchesSlide() {
        const switches = document.querySelectorAll('.switch');
        switches.forEach((switchElement) => {
            const input = document.createElement('input');
            const slider = document.createElement('div');
            input.setAttribute('type', 'checkbox');
            slider.classList.add('slider');
            switchElement.appendChild(input);
            switchElement.appendChild(slider);
            switchElement.style.borderRadius = (parseFloat(getComputedStyle(switchElement).height) / 2) + 'px';
        });
        const sliders = document.querySelectorAll('.switch > .slider');
        sliders.forEach((slider) => {
            let parent = slider.parentElement;
            let input = parent.querySelector('input');
            let uncheckedPosition = getComputedStyle(slider, '::before').left;
            let checkedPosition = parent.offsetWidth - parseFloat(uncheckedPosition) * 4 - parseFloat(getComputedStyle(slider, '::before').width) + 'px';
            slider.style.setProperty('--total-transition', checkedPosition);
            input.style.setProperty('--total-transition', checkedPosition);
        });
    }
    ;
    static dragPopUps() {
        const popUps = document.querySelectorAll('.pop-up');
        let isDragging = false;
        let offsetX, offsetY;
        popUps.forEach((popUp) => {
            popUp.addEventListener('mousedown', startDragging);
            popUp.addEventListener('touchstart', startDragging);
            popUp.addEventListener('mousemove', drag);
            popUp.addEventListener('touchmove', drag);
            document.addEventListener('mouseup', stopDragging);
            document.addEventListener('touchend', stopDragging);
        });
        function startDragging(event) {
            let e;
            if (event instanceof MouseEvent) {
                e = event;
            }
            else {
                e = event.touches[0];
            }
            ;
            let target = e.target;
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
            let e;
            if (event instanceof MouseEvent) {
                e = event;
            }
            else {
                e = event.touches[0];
            }
            ;
            if (isDragging) {
                let x = e.clientX - offsetX;
                let y = e.clientY - offsetY;
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
    static changeHomeView() {
        const navBttns = document.querySelectorAll('nav a');
        navBttns.forEach((bttn) => {
            bttn.onclick = (ev) => {
                ev.preventDefault();
                const target = ev.target || ev.touches[0].target;
                const anchor = target.closest('a');
                document.querySelectorAll('.flex-container > section').forEach((section) => {
                    section.style.display = section.id === anchor.href.split('/').pop() ? '' : 'none';
                });
            };
        });
    }
    ;
    static refreshData() {
        return __awaiter(this, void 0, void 0, function* () {
            const button = document.querySelector('button#refresh-button');
            button.onclick = (ev) => __awaiter(this, void 0, void 0, function* () {
                yield caches.delete('v1');
                window.location.reload();
            });
        });
    }
    ;
    static putVersionOnFooter() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = yield fetch('https://raw.githubusercontent.com/StatisticShock/StatisticShock.github.io/refs/heads/main/package.json')
                .then((res) => res.json())
                .then((data) => data.version);
            const footer = document.querySelector('footer');
            footer.innerHTML += `<p><small>ver. ${version}</small></p>`;
        });
    }
    ;
    static deleteSkeletons(prefixes) {
        for (const prefix of prefixes) {
            const skeletons = document.querySelectorAll(prefix + '.skeleton-container');
            skeletons.forEach((skeleton) => {
                skeleton.remove();
            });
        }
        ;
    }
    ;
}
;
export default class SharedDomFunctions extends PageBehaviour {
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
