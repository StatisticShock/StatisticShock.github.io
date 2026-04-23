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
import { server } from '../util/server-url.js';
import PageBuildingImport, { TemplateConstructor } from './shared.js';
const toggleExternalDataLoad = true;
const ua = navigator.userAgent || navigator.vendor || window.opera;
const mobile = /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(ua.toLowerCase());
class PageBuilding extends PageBuildingImport {
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
    static createSkeletons() {
        const skeleton = 'skeleton';
        const container = 'skeleton-container';
        function createShortcutSkeletons() {
            const shortcuts = document.querySelector('#shortcuts block-container');
            const maxIcons = 16;
            const row = Array(maxIcons).fill({ joker: skeleton, alt: '. . .' });
            new TemplateConstructor(document.querySelector('#shortcuts-template'), Array(5).fill({ jokerContainer: container, joker: skeleton, children: row })).insert(shortcuts);
            shortcuts.querySelectorAll('img').forEach((img) => img.src = './icon/blank.svg');
        }
        ;
        function createGamecardSkeletons() {
            const gamecard = document.querySelector('#gaming gaming-container');
            const sample = {
                label: '. . .',
                joker: 'skeleton',
                jokerContainer: 'skeleton-container',
            };
            new TemplateConstructor(document.querySelector('#gamecard-template'), Array(6).fill(sample)).insert(gamecard);
        }
        ;
        function createMfcSkeletons() {
            const mfc = document.querySelector('#my-figure-collection my-figure-collection');
            const maxIcons = Math.floor(parseInt(getComputedStyle(mfc).width) / (60 + 20)) * 3;
            const sample = {
                joker: 'skeleton',
                jokerContainer: 'skeleton-container',
                icon: './icon/blank.svg'
            };
            new TemplateConstructor(document.querySelector('#mfc-template'), Array(maxIcons).fill(sample)).insert(mfc);
        }
        ;
        function createMalSkeletons() {
            const mal = document.querySelector('#my-anime-list my-anime-list');
            const maxIcons = 20;
            const sample = {
                joker: 'skeleton',
                rank: ' . . .',
                title: '. . .',
                jokerContainer: 'skeleton-container',
                "main_picture_large": './icon/blank.svg'
            };
            new TemplateConstructor(document.querySelector('#myanimelist-template'), Array(maxIcons).fill(sample)).insert(mal);
        }
        createShortcutSkeletons();
        createGamecardSkeletons();
        createMfcSkeletons();
        createMalSkeletons();
    }
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
class UserInterface {
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
    static resetPopUpsOnOpen() {
        const buttons = document.querySelectorAll('.close-button');
        buttons.forEach((button) => {
            const parent = button.parentElement.parentElement;
            button.onclick = () => {
                parent.style.display = 'none';
                this.setPopUpDefaultValues();
            };
        });
    }
    ;
    static setPopUpDefaultValues() {
        let keywordsReddit = document.getElementById('keywords-reddit');
        let subreddit = document.getElementById('subreddit');
        let toDate = document.getElementById('to-date');
        let fromDate = document.getElementById('from-date');
        keywordsReddit.value = '';
        subreddit.value = '';
        toDate.valueAsDate = new Date();
        fromDate.valueAsDate = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate());
        let keywordsWikipedia = document.getElementById('keywords-wikipedia');
        keywordsWikipedia.value = '';
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
    static handleShortcutEditToggle() {
        const toggleButton = document.querySelector('button#shortcuts-edit-mode');
        const shotcuts = document.querySelector('section#shortcuts');
        const blocks = Array.from(shotcuts.querySelectorAll('block-container block'));
        toggleButton.onclick = (ev) => {
            shotcuts.classList.toggle('edit-mode');
            toggleButton.classList.toggle('trigger');
            toggleButton.classList.toggle('check');
        };
        blocks.forEach((block) => {
            block.addEventListener('mouseenter', (ev) => {
                if (document.body.classList.contains('has-hover')) {
                    block.setAttribute('selected', 'true');
                }
                ;
            });
            block.addEventListener('mouseleave', (ev) => {
                if (document.body.classList.contains('has-hover')) {
                    block.setAttribute('selected', 'false');
                }
                ;
            });
            block.addEventListener('click', (ev) => {
                const target = (ev.target || ev.touches[0].target);
                if (!target.closest('a') || shotcuts.classList.contains('edit-mode')) {
                    ev.preventDefault();
                }
                if (!ev.touches)
                    return;
                block.setAttribute('selected', (!Boolean(block.getAttribute('selected') || "false")).toString());
                blocks.forEach((el) => {
                    if (el !== block) {
                        el.setAttribute('selected', 'false');
                    }
                    ;
                });
            });
        });
    }
    static handleGamingEditToggle() {
        const toggleButton = document.querySelector('button#gaming-edit-mode');
        toggleButton.onclick = (ev) => {
            toggleButton.classList.toggle('trigger');
            toggleButton.classList.toggle('check');
        };
        /* TODO */
    }
}
;
class ExternalSearch {
    static redditSearchTrigger() {
        let okButtonReddit = document.querySelector('.pop-up.reddit-google .ok-button');
        okButtonReddit.onclick = redditSearch;
        function redditSearch() {
            var _a;
            const keywords = document.getElementById('keywords-reddit');
            const subreddit = document.getElementById('subreddit');
            const from = document.getElementById('from-date');
            const to = document.getElementById('to-date');
            var subredditStrings = subreddit.value.split(/ \/ /).filter((text) => {
                if (text != '')
                    return true;
            });
            if ((new Date(from.value) >= new Date(to.value)) && from.value && to.value)
                return;
            let string = 'https://www.google.com/search?q=';
            if (keywords.value) {
                string = string + keywords.value.replace(' ', '+');
                if (subredditStrings[0]) {
                    subredditStrings.forEach((text) => {
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
    static wikipediaSearchTrigger() {
        let okButtonWikipedia = document.querySelector('.pop-up.wikipedia .ok-button');
        okButtonWikipedia.onclick = wikipediaSearch;
        function wikipediaSearch() {
            var _a;
            let keywords = document.getElementById('keywords-wikipedia');
            let string = 'https://pt.wikipedia.org/w/index.php?search=';
            if (keywords.value) {
                string = string + keywords.value.replace(' ', '+');
                (_a = window.open(string, '_blank')) === null || _a === void 0 ? void 0 : _a.focus();
            }
        }
    }
    ;
}
;
class CloudStorageData {
    static load() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${server}contents/`);
            this.json = yield response.json();
        });
    }
    static loadContentFromJson() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = JSON.parse(JSON.stringify(this.json));
            function loadShortcuts() {
                return __awaiter(this, void 0, void 0, function* () {
                    const shortcuts = document.querySelector('section#shortcuts block-container');
                    const shortcutsOnMobile = content.shortcuts.map((folder) => {
                        const folderClone = structuredClone(folder);
                        folderClone.children = folderClone.children.filter((child) => {
                            return child.show_on_mobile;
                        });
                        return folderClone;
                    }).filter((folder) => {
                        return folder.children.length > 0;
                    });
                    new TemplateConstructor(document.querySelector('template#shortcuts-template'), mobile ? shortcutsOnMobile : content.shortcuts).insert(shortcuts);
                });
            }
            ;
            function loadGamecards() {
                return __awaiter(this, void 0, void 0, function* () {
                    const gamecards = document.querySelector('#gaming gaming-container');
                    new TemplateConstructor(document.querySelector('template#gamecard-template'), content.gamecards).insert(gamecards, 'after');
                    // a
                    for (const gamecard of content.gamecards) {
                        for (const css of gamecard.img_css) {
                            document.querySelector('#' + gamecard.id + ' a').style.setProperty(css.attribute, css.value);
                        }
                        ;
                    }
                    ;
                });
            }
            ;
            function loadHeaders() {
                return __awaiter(this, void 0, void 0, function* () {
                    const possibleHeaders = content.headers.filter((header) => header.active);
                    let index = CustomFunctions.randomIntFromInterval(0, possibleHeaders.length - 1);
                    let src = possibleHeaders[index].href;
                    possibleHeaders.forEach((imgSrc) => {
                        let img = new Image();
                        img.src = imgSrc.href;
                    });
                    const header = document.querySelector('#header div');
                    const h1 = header.querySelector('h1');
                    header.style.backgroundImage = `url('${src}')`;
                    header.onclick = (event) => {
                        var _a;
                        let target = null;
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
                        let newHeadersArr = possibleHeaders.filter((headerObj) => {
                            return headerObj.href !== src;
                        });
                        index = CustomFunctions.randomIntFromInterval(0, newHeadersArr.length - 1);
                        src = newHeadersArr[index].href;
                        header.style.backgroundImage = `url('${src}')`;
                    };
                });
            }
            ;
            function loadMfc() {
                return __awaiter(this, void 0, void 0, function* () {
                    const destination = document.querySelector('#my-figure-collection my-figure-collection');
                    new TemplateConstructor(document.querySelector('#mfc-template'), content.mfc.sort((a, b) => Number(a.id) - Number(b.id))).insert(destination, 'after');
                    document.querySelectorAll('mfc > img').forEach((mfcImg) => {
                        mfcImg.addEventListener('click', (ev) => {
                            mfcImg.parentElement.classList.toggle('hidden');
                        });
                    });
                    Array.from(document.querySelectorAll('mfc line > label')).forEach((label) => {
                        label.onclick = (ev) => {
                            if (label.textContent !== 'Tags') {
                                navigator.clipboard.writeText(label.nextElementSibling.textContent);
                            }
                            ;
                        };
                    });
                    Array.from(document.querySelectorAll('mfc line > data')).forEach((dataField) => {
                        dataField.onclick = (ev) => {
                            dataField.parentElement.classList.toggle('hidden');
                        };
                    });
                    Array.from(document.querySelectorAll('mfc line > stores > a')).forEach((store) => {
                        const img = store.querySelector('img');
                        const keyword = store.parentElement.parentElement.querySelector('data').textContent;
                        switch (img.alt) {
                            case 'amiami icon':
                                store.href = `https://www.amiami.com/eng/search/list/?s_keywords=${encodeURI(keyword)}&s_cate_tag=1&s_sortkey=preowned&s_st_condition_flg=1`;
                                break;
                            case 'buyee icon':
                                store.href = `https://buyee.jp/item/search/query/${encodeURI(keyword)}/category/25888?store=1&aucminprice=0&aucmaxprice=3000&suggest=1`;
                                break;
                            case 'ninoma icon':
                                store.href = `https://ninoma.com/search?filter.p.product_type=Figure&filter.v.availability=1&q=${encodeURI(keyword)}`;
                                break;
                            default: break;
                        }
                    });
                    function makeMfcSearchWork() {
                        const searchBox = document.querySelector('search-box');
                        const input = document.querySelector('input[name="mfc-filter"]');
                        const figureMapKeys = ['id', 'title', 'type', 'category', 'or', 'and'];
                        const figuresRegExMap = Array.from(content.mfc);
                        figuresRegExMap.forEach((figure) => {
                            figure.or = (expressions) => {
                                if (expressions.length === 0) {
                                    return true;
                                }
                                ;
                                return expressions.some((expression) => {
                                    return Object.keys(figure).some((key) => typeof figure[key] === 'string' && expression.test(figure[key]));
                                });
                            };
                            figure.and = (expressions) => {
                                return expressions.every((expression) => {
                                    return Object.keys(figure).some((key) => typeof figure[key] === 'string' && expression.test(figure[key]));
                                });
                            };
                        });
                        function filterFigures(ev) {
                            const string = input.value;
                            const regEx = new RegExp(string, 'ig');
                            const regExes = {
                                or: string.trim() === '' ? [] : [regEx],
                                and: []
                            };
                            document.querySelectorAll('search-box search-word').forEach((searchWord) => {
                                const newRegEx = new RegExp(searchWord.textContent.slice(0, -1), 'ig');
                                regExes[searchWord.classList[0]].push(newRegEx);
                            });
                            if (regExes.or.length === 0 && regExes.and.length === 0)
                                regExes.or.push(/:?/ig);
                            figuresRegExMap.forEach((figure) => {
                                if (figure.or(regExes.or) && figure.and(regExes.and)) {
                                    document.getElementById(`mfc-${figure.id}`).style.display = 'flex';
                                }
                                else {
                                    document.getElementById(`mfc-${figure.id}`).style.display = 'none';
                                }
                                ;
                            });
                        }
                        ;
                        ['keyup', 'paste'].forEach((eventName) => {
                            input.addEventListener(eventName, filterFigures);
                        });
                        input.addEventListener('keypress', (ev) => {
                            if (ev.key === 'Enter') {
                                if (input.value.trim().length === 0)
                                    return;
                                const searchWord = document.createElement('search-word');
                                searchWord.innerHTML = `${input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[&#,+()$~%.'":*?<>{}]/g, '')}<button type="button" class="close-button">&times;</button>`;
                                searchWord.classList.add('or');
                                searchWord.addEventListener('click', (ev) => {
                                    const target = ('touches' in ev ? ev.touches[0].target : ev.target);
                                    if (target.tagName === 'BUTTON')
                                        return;
                                    searchWord.classList.toggle('and');
                                    searchWord.classList.toggle('or');
                                    filterFigures();
                                });
                                searchBox.appendChild(searchWord);
                                input.value = '';
                            }
                            ;
                        });
                        searchBox.addEventListener('click', (ev) => {
                            var _a;
                            const target = ('touches' in ev ? ev.touches[0].target : ev.target);
                            if (target.tagName === 'BUTTON') {
                                (_a = target.closest('search-word')) === null || _a === void 0 ? void 0 : _a.remove();
                                filterFigures();
                            }
                        });
                    }
                    ;
                    makeMfcSearchWork();
                });
            }
            loadShortcuts();
            loadGamecards();
            loadHeaders();
            loadMfc();
        });
    }
    ;
    static handleEdits() {
        return __awaiter(this, void 0, void 0, function* () {
            function shortcutsEdit() {
                const section = document.querySelector('section#shortcuts');
                const form = document.querySelector('form#create-shortcut');
                const inputFile = form.querySelector('input[type="file"]');
                let parendData = null;
                let editedShortcut = null;
                const buttons = document.querySelectorAll('button.shortcut-item');
                buttons.forEach((button) => {
                    button.onclick = function (ev) {
                        form.style.display = 'block';
                        const [parendId] = CloudStorageData.json.shortcuts.filter((folder) => folder.id === button.closest('block').id);
                        parendData = {
                            id: parendId.id,
                            index: parendId.index,
                            title: parendId.title,
                            children: parendId.children.length
                        };
                        form.querySelectorAll('input[type="text"]').forEach((input) => {
                            input.value = '';
                        });
                        form.querySelector('input[type="checkbox"]').checked = true;
                        form.querySelector('input[type="file"]').value = '';
                    };
                });
                const currentShortcuts = document.querySelectorAll('block a.shortcut-item');
                currentShortcuts.forEach((shortcut) => {
                    shortcut.onclick = function (ev) {
                        if (!section.classList.contains('edit-mode'))
                            return;
                        form.style.display = 'block';
                        editedShortcut = CloudStorageData.json.shortcuts.filter((folder) => folder.id === shortcut.closest('block').id)[0].children.filter((shortcutOnJson) => shortcutOnJson.id === shortcut.id)[0];
                        const [parendId] = CloudStorageData.json.shortcuts.filter((folder) => folder.id === shortcut.closest('block').id);
                        parendData = {
                            id: parendId.id,
                            index: parendId.index,
                            title: parendId.title,
                            children: parendId.children.length
                        };
                        form.querySelectorAll('input[type="text"]').forEach((input) => {
                            if (editedShortcut[input.name]) {
                                input.value = editedShortcut[input.name];
                            }
                            else {
                                input.value = '';
                            }
                            ;
                        });
                        form.querySelector('input[type="checkbox"]').checked = editedShortcut.show_on_mobile;
                        form.querySelector('input[type="file"]').value = '';
                    };
                });
                const submitButton = form.querySelector('button.ok-button');
                submitButton.onclick = function (ev) {
                    return __awaiter(this, void 0, void 0, function* () {
                        ev.preventDefault();
                        if (form.querySelector(`input[name="alt"]`).value === '')
                            return;
                        if (form.querySelector(`input[name="href"]`).value === '')
                            return;
                        if (form.querySelector(`input[name="image"]`).files.length === 0)
                            return;
                        const formData = new FormData();
                        formData.append('image', inputFile.files[0]);
                        formData.append('path', 'icons/dynamic/');
                        const response = yield fetch(`${server}image/small`, {
                            method: 'POST',
                            body: formData
                        });
                        if (response.status === 200) {
                            const json = yield response.json();
                            const postBody = {
                                id: parendData.id,
                                index: parendData.index.toString(),
                                title: parendData.title,
                                children: [
                                    {
                                        alt: document.querySelector('input[name="alt"]').value,
                                        id: CustomFunctions.normalize(document.querySelector('input[name="alt"]').value),
                                        index: parendData.children,
                                        href: document.querySelector('input[name="href"]').value,
                                        img: `https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/${json['newFile']}`,
                                        floatingLabel: document.querySelector('input[name="floatingLabel"]').value,
                                        show_on_mobile: document.querySelector('input[name="show_on_mobile"]').value.toString() === 'on' ? true : false,
                                    }
                                ],
                            };
                            const request = yield fetch(`${server}shortcuts`, {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                body: JSON.stringify(postBody),
                            });
                            if (request.ok) {
                                alert('Atalho criado.');
                                CloudStorageData.json.shortcuts.filter((folder) => folder.id === parendData.id)[0].children.push(postBody.children[0]);
                            }
                            ;
                        }
                    });
                };
            }
            ;
            shortcutsEdit();
        });
    }
    ;
}
;
class ExternalData {
    static addRetroAchievementsAwards() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fetch(`${server}retroAchievements/pt-BR/`).then((res) => res.json());
            const retroAchievements = document.querySelector('#gaming retroachievements');
            new TemplateConstructor(document.querySelector('#ra-template'), [data]).insert(retroAchievements);
            data.awards.filter((award) => award.allData.some((data) => {
                return data.awardType.includes('Platinado');
            })).forEach((award) => {
                document.querySelector('#ra-award-' + award.awardData).classList.add('mastered');
            });
        });
    }
    ;
    static scrapeMyAnimeList() {
        return __awaiter(this, void 0, void 0, function* () {
            function scrapeDataFromMAL(options) {
                return __awaiter(this, void 0, void 0, function* () {
                    const animeData = (yield fetch(`${server}myanimelist/animelist?username=HikariMontgomery&offset=${options.offset}&limit=${options.limit}`)
                        .then(response => response.json()))['myanimelist'];
                    const mangaData = (yield fetch(`${server}myanimelist/mangalist?username=HikariMontgomery&offset=${options.offset}&limit=${options.limit}`)
                        .then(response => response.json()))['myanimelist'];
                    const response = [];
                    animeData.forEach((anime) => response.push(anime));
                    mangaData.forEach((manga) => response.push(manga));
                    return response;
                });
            }
            ;
            scrapeDataFromMAL({ offset: 0, limit: 40 }).then((res) => {
                this.MALData = res;
                const malContainer = document.querySelector('#my-anime-list my-anime-list');
                new TemplateConstructor(document.querySelector('#myanimelist-template'), res.sort((a, b) => -new Date(a.updated_at).getTime() + new Date(b.updated_at).getTime()).slice(0, 40)).insert(malContainer);
            });
        });
    }
    ;
}
;
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
}
;
window.addEventListener('load', onLoadFunctions, true);
function onLoadFunctions(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        UserInterface.makeSwitchesSlide();
        UserInterface.nightModeToggle();
        UserInterface.dragPopUps();
        UserInterface.setPopUpDefaultValues();
        UserInterface.resetPopUpsOnOpen();
        UserInterface.collapseHeader();
        UserInterface.changeHomeView();
        UserInterface.refreshData();
        yield CustomFunctions.sleep(300);
        PageBuilding.createLoaders(12);
        PageBuilding.putVersionOnFooter();
        PageBuilding.formatPopUps();
        PageBuilding.createSkeletons();
        ExternalSearch.redditSearchTrigger();
        ExternalSearch.wikipediaSearchTrigger();
        if ((window.location.hostname === 'statisticshock.github.io') ? true : toggleExternalDataLoad) {
            yield CloudStorageData.load();
            yield Promise.all([
                Promise.all([
                    CloudStorageData.loadContentFromJson(),
                    CloudStorageData.handleEdits(),
                    ExternalData.scrapeMyAnimeList(),
                    ExternalData.addRetroAchievementsAwards(),
                ]).then((res) => {
                    PageBuilding.deleteSkeletons(['#shortcuts ', 'header ', '#my-anime-list my-anime-list', 'gaming-container ', '#my-figure-collection ']);
                }),
            ]);
        }
        ;
        UserInterface.handleShortcutEditToggle();
        UserInterface.handleGamingEditToggle();
        PageBehaviour.openLinksInNewTab();
        PageBehaviour.stopImageDrag();
        setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
    });
}
;
window.addEventListener('resize', onResizeFunctions, true);
function onResizeFunctions(ev) {
    //
}
;
window.addEventListener('scroll', onScrollFunctions, true);
function onScrollFunctions(ev) {
    //
}
;
