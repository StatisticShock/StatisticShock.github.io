// Import custom functions from "./functions.Js"
import CustomFunctions from "./functions.js";
import * as MyTypes from "../server/types.js"

//A const that stores if the browser is mobile
const mobile: boolean = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))
const portrait: boolean = (window.innerWidth < window.innerHeight);

//The server
const server: string = window.location.href === 'http://127.0.0.1:5500/' ? 'http://localhost:3000/' : 'https://statisticshock-github-io.onrender.com/';
console.log(`Running server at ${server}`);

// Remove :hover effects
function goThroughRules (rules: CSSRuleList) {
    try {
        for (let j = rules.length - 1; j >= 0; j--) {
            const rule = rules[j];

            if (rule instanceof CSSStyleRule) {
                if (rule.selectorText.includes(':hover')) {
                    rule.cssText = '';
                } else if (rule.cssRules) {
                    goThroughRules(rule.cssRules);
                };
            };
        };
    } catch (err) {
        // Do nothing
    };
}

// To make loaders work
function createLoaders (counter: number): void { // NO NEED OF RESPONSIVENESS
    let loaders: NodeListOf<HTMLDivElement> = document.querySelectorAll('.loader');

    loaders.forEach(loader => {
        for (let i = 0; i < counter; i++) {
            const div: HTMLDivElement = document.createElement('div');
            
            div.setAttribute('class', 'loading');
            div.setAttribute('style', `--translation: 150; --index: ${i + 1}; --count: ${counter}`);

            loader.appendChild(div);
        };
    });
};

//To make all shortcuts available
async function loadContentFromJson () {
    const json: MyTypes.PageContent = JSON.parse(await (await fetch(`${server}contents?filename=contents`)).text());

    async function loadShortcuts () {
        const targetedNode: Element = document.querySelectorAll('#shortcuts h2')[1]!
        const shortcutsNode: Element = document.querySelector('#shortcuts')!;

        for (const section of json.shortcuts.sort((a, b) => a.index - b.index)) { //Creates the section
            const container: HTMLElement = document.createElement('section');
            container.id = section.id;
            const p: HTMLParagraphElement = document.createElement('p');
            p.innerHTML = section.title;
            const div: HTMLDivElement = document.createElement('div');
            div.classList.add('grid-container');

            for (const child of section.children.sort((a, b) => a.index - b.index)) { //Creates each shortcut
                const a: HTMLAnchorElement = document.createElement('a');
                a.classList.add('shortcut-item');
                a.href = child.href;
                a.setAttribute('alt', child.alt);
                a.id = child.id;

                const img: HTMLImageElement = document.createElement('img');
                img.src = child.img;

                a.appendChild(img);
                div.appendChild(a);
            };

            container.appendChild(p);
            container.appendChild(div);
            shortcutsNode.insertBefore(container, targetedNode); //Inserts the created element before the gaming cards
        }
    };

    async function loadHeaders () {
        let index: number = CustomFunctions.randomIntFromInterval(1, json.headers.length);
        let src: string = json.headers[index-1];

        json.headers.forEach((imgSrc: string) => { //To load each header image
            let img = new Image();
            img.src = imgSrc;
        });

        const header: HTMLElement = document.querySelector('#header')!;
        const h1: HTMLElement = header.querySelector('h1')!;
        header.style.backgroundImage = `url('${src}')`;

        header.onclick = (event: MouseEvent | TouchEvent) => {
            let target: EventTarget | null = null;
            if (event instanceof MouseEvent) {
                target = event.target;
            } else if (event instanceof TouchEvent) {
                target = event.touches[0].target;
            }

            if (typeof window.getSelection() !== undefined) {
                if (window.getSelection()?.toString() !== '') return;
            };

            let arr: Array<string> = json.headers.filter((headerImg: string) => {
                return headerImg != src.split('/').pop();
            })
            let indexArr: number = CustomFunctions.randomIntFromInterval(1, arr.length);
            src = arr[indexArr-1];

            header.style.backgroundImage = `url('${src}')`;
        };
    };

    (Array.from(document.body.children) as Array<HTMLElement>).concat(document.querySelector('footer')!).forEach((element) => {
        if (element.classList.contains('loader')) element.style.display = 'none';
        else element.removeAttribute('style');
    });

    loadShortcuts();
    loadHeaders();
}

// Stop image dragging
function stopImageDrag (): void { // NO NEED OF RESPONSIVENESS
    let images: HTMLCollectionOf<HTMLImageElement> = document.getElementsByTagName('img');

    Array.from(images).forEach((img) => {
        img.setAttribute('draggable', 'false')
    });
};

// Open in new tab
function openLinksInNewTab (): void { // RESPONSIVE
    const shortcuts: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.shortcut-item');
    for (const element of Array.from(shortcuts)) {
        if (!element.href) continue; 
        if (element.href.match(/docs\.google\.com/) == null || mobile) {
            element.target = '_blank';
        }
    };

    const gamecards: NodeListOf<HTMLDivElement> = document.querySelectorAll('.gamecard')!;
    gamecards.forEach((element) => {
        let child = element.firstElementChild as HTMLAnchorElement;
        
        if (child.href.match(/docs\.google\.com/) == null || mobile) {
            child.target = '_blank';
        }
    });
};

//To make sheets open in edge
function redirectToEdge (): void { // RESPONSIVE
    if (mobile) return;

    let links = document.querySelectorAll('a');
    links.forEach(link => {
        var hyperlink = link.href

        if (hyperlink.match(/docs\.google\.com/)) {
            link.href = 'microsoft-edge:' + hyperlink
            link.target = ''
        }
    });
};

//To make aside the same height of Shortcut-Item
function resizeAside (counter?: number): void { // RESPONSIVE
    const aside: HTMLElement = document.querySelector('aside')!;
    const shortcuts: HTMLElement = document.querySelector('#shortcuts')!;

    aside.style.height = 'fit-content'
    shortcuts.style.height = 'fit-content'

    if (parseFloat(getComputedStyle(aside).height) < parseFloat(getComputedStyle(shortcuts).height)) {
        aside.style.height = shortcuts.offsetHeight + 'px';
    } else {
        shortcuts.style.height = aside.offsetHeight + 'px';
    }

    if (counter == 0) {
        setTimeout(() => {
            resizeAside(1);
        },750);
    }; 
};

function expandAside (): void { // RESPONSIVE 
    const aside: HTMLElement = document.querySelector('aside')!;
    const div: HTMLDivElement = aside.querySelector('.button-bar')!;
    const bttn: HTMLButtonElement = aside.querySelector('#expand-button')!;
    const span: HTMLSpanElement = bttn.querySelector('span')!;
    const shortcuts: HTMLTableSectionElement = document.querySelector('#shortcuts')!;
    const flexContainer: HTMLDivElement = document.querySelector('.flex-container')!;
    const input: HTMLInputElement = aside.querySelector('input')!;

    bttn.onclick = function (ev) {
        if (!portrait) {
            if (aside.getBoundingClientRect().width < window.innerWidth * 0.3) {
                span.style.transform = `rotate(180deg) translate(0%,-10%)`;
                flexContainer.style.gridTemplateColumns = '54vw 2vw 1fr';
                input.style.width = `calc((46vw - 2vw - 10px) * 0.9)`; input.style.left = `calc(((44vw - 10px) * 0.1) / 2)`;
            } else {
                span.style.transform = `rotate(0deg) translate(0%,-10%)`;
                flexContainer.style.gridTemplateColumns = '76vw 2vw 1fr';
                input.style.width = `calc((24vw - 2vw - 10px) * 0.9)`; input.style.left = `calc(((22vw - 10px) * 0.1) / 2)`;
            };
        } else {
            if (!aside.classList.contains('hidden')) {
                aside.classList.add('hidden');
                bttn.style.transform = 'rotate(180deg) translate(20px, 0)'
            } else {
                aside.classList.remove('hidden');
                bttn.style.transform = 'translate(20px, 0)'
            };
        };
    };

    div.onclick = function (ev) {
        bttn.click();
    };

    span.onclick = function (ev) {
        bttn.click();
    };
};

function makeAsideButtonFollow (): void {
    if (mobile) return;

    const aside: HTMLElement = document.querySelector('aside')!;
    const div: HTMLDivElement = aside.querySelector('.button-bar')!;
    const button: HTMLButtonElement = div.querySelector('#expand-button')!;
    const buttonHeight: number = button.offsetHeight;

    div.addEventListener('mousemove', (ev: MouseEvent): void => {
        const target = ev.target as HTMLElement;
        
        if (CustomFunctions.isParent(target, button)) return;

        button.style.top = (ev.layerY) + 'px';
    });
};

// To make the gamecard occupy 50% of the screen on hover
function adjustGamecard (): void { // NEED TO TEST
    const gameCardContainers: NodeListOf<HTMLElement> = document.querySelectorAll('.gamecard-container');
    gameCardContainers.forEach(gamecardContainer => {
        let childCount: string = Math.max(gamecardContainer.children.length, 2).toString();

        gamecardContainer.style.setProperty('--gamecard-count', childCount);
    });

    const gameCardText: NodeListOf<HTMLElement> = document.querySelectorAll('.gamecard-text > span p');
    gameCardText.forEach((element) => {
        element.style.marginLeft = - (element.offsetWidth / 2 - 20) + 'px';
    });
};

function rotateGamecardText (counter: number): void { // RESPONSIVE
    let gameCardSpan: NodeListOf<HTMLElement> = document.querySelectorAll('.gamecard > a > span');
    gameCardSpan.forEach((element) => {
        let parentElement = element.parentElement as HTMLDivElement;
        let div = parentElement.firstChild as HTMLDivElement;

        if (div.scrollWidth > parentElement.offsetWidth) {
            element.style.transform = 'rotate(-90deg)'
        } else {
            element.style.transform = ''
        }
    })

    if (counter == 0) {
        setTimeout(rotateGamecardText,100);
    };
};

function resizeHeader (): void { // RESPONSIVE
    const header: HTMLElement = document.querySelector('header')!;
    const nav: HTMLElement = document.querySelector('nav')!;
    const height: number = parseFloat(getComputedStyle(header).height);
    const windowWidth: number = document.documentElement.scrollWidth;
    const scrollY: number = window.scrollY;
    const ohtoHeight: number = parseFloat(getComputedStyle(document.querySelector('#ohto')!).height);

    header.style.aspectRatio = Math.min(windowWidth / ohtoHeight, Math.max(5, (5 * ((scrollY + height) / height)))) + '';

    const newHeight: number = parseFloat(getComputedStyle(header).height);
    nav.style.top = newHeight + 'px';
}

// To make 2B and Ai sit on the navbar (and makke the MFC toggle sit under 2B)
function figuresSitDown (): void { // RESPONSIVE
    const twoB: HTMLElement = document.getElementById('twoB')!;
    const twoB_Ass = Math.floor(parseFloat(getComputedStyle(twoB).height) * 493 / 920);
    const twoB_Pussy = Math.floor(parseFloat(getComputedStyle(twoB).width) * 182 / 356);
    const aside: HTMLElement = document.querySelector('aside')!;

    twoB.style.top = (- twoB_Ass) + 'px';
    twoB.style.right = (!mobile) ? (aside.offsetWidth / 2 - twoB_Pussy) + 'px' : '5%';

    const ohto: HTMLElement = document.getElementById('ohto')!;
    const ohto_panties = getComputedStyle(ohto).height;
    const ohto_mouth = Math.floor(parseFloat(getComputedStyle(ohto).width) / 2);
    
    ohto.style.top = '-' + ohto_panties;
    ohto.style.left = getComputedStyle(twoB).right;

    const toggleSwitch: HTMLElement = document.getElementById('mfc-switch')!;
    
    toggleSwitch.style.width = twoB.style.width;
    toggleSwitch.style.right = parseFloat(twoB.style.right) + twoB.offsetWidth / 2 + 'px';
    toggleSwitch.style.transform = 'translate(50%, 0)'
};

//To make all switches work
function makeSwitchesSlide (): void { // NO NEED OF RESPONSIVENES
    const switches: NodeListOf<HTMLLabelElement> = document.querySelectorAll('.switch');
    switches.forEach((switchElement) => {
        const input: HTMLInputElement = document.createElement('input');
        const slider: HTMLDivElement = document.createElement('div');
        input.setAttribute('type', 'checkbox');
        slider.classList.add('slider');

        switchElement.appendChild(input);
        switchElement.appendChild(slider);

        switchElement.style.borderRadius = (parseFloat(getComputedStyle(switchElement).height) / 2) + 'px'
    });

    const sliders: NodeListOf<HTMLElement> = document.querySelectorAll('.switch > .slider'); 
    sliders.forEach((slider) => {
        let parent = slider.parentElement as HTMLElement;
        let input = parent.querySelector('input') as HTMLInputElement;

        let uncheckedPosition = getComputedStyle(slider, '::before').left;
        let checkedPosition   = parent.offsetWidth - parseFloat(uncheckedPosition) * 4 - parseFloat(getComputedStyle(slider, '::before').width) + 'px';

        slider.style.setProperty('--total-transition', checkedPosition);
        input.style.setProperty('--total-transition', checkedPosition);
    })
};

//To make MFC toggle switch work
function mfcToggleSwitch (): void { 
    let input = document.querySelector('#mfc-switch > input') as HTMLInputElement;
    let owned = document.getElementById('owned') as HTMLElement;
    let ordered = document.getElementById('ordered') as HTMLElement;
    let card = document.querySelector('.card') as HTMLElement;
    let cardWidth = card.scrollWidth as number;

    //scroll to the left on page load
    card.scrollTo({left: 0});

    input.onclick = () => { // Makes items slides on switch click
        if (input.checked) {
            card.scrollTo({left: cardWidth / 2 + 1, behavior: 'smooth'});
        } else {
            card.scrollTo({left: 0, behavior: 'smooth'});
        };
    };

    card.onscroll = () => { // Makes switch slide on items scroll
        if (card.scrollLeft == 0) { // Make sure it triggers only once it is in default position
            input.checked = false;
        } else if (card.scrollLeft == card.scrollWidth / 2) { // Makes sure it triggers only once it reaches second page
            input.checked = true;
        }
    }
};

//To toggle night mode
function nightModeToggle(): void { //RESPONSIVE
    const label = document.querySelector('#night-mode-toggle') as HTMLLabelElement;

    // Create input if it doesn't exist
    let input = label.querySelector('input') as HTMLInputElement;

    // Set initial state based on current theme
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    input.checked = isDark;

    // Listen for toggle
    input.addEventListener('change', (ev) => {
        if (input.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        };

        console.log(getComputedStyle(document.documentElement).getPropertyValue('--contrast-color').trim());
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const newColorScheme = event.matches ? "dark" : "light";
    });
}

//To make the popups appear on click
function formatPopUps (): void { //NO NEED OF RESPONSIVENESS
    type popUpInterface = {button: HTMLAnchorElement | HTMLButtonElement, popUpContainer: HTMLFormElement}
    const popUpShortcuts: Array<popUpInterface> = [];

    (document.querySelectorAll('form.pop-up') as NodeListOf<HTMLFormElement>).forEach((form) => {
        if (form.classList.length < 2) return;

        const otherClass: string = Array.from(form.classList).filter((className) => className !== 'pop-up')[0];

        const openBttn = Array.from(document.querySelectorAll(`.${otherClass}`)).filter((element) => element.classList.contains('pop-up-open'))[0] as HTMLAnchorElement | HTMLButtonElement;

        popUpShortcuts.push({button: openBttn, popUpContainer: form});
    });

    popUpShortcuts.forEach((object) => {
        let popUpClass           = document.querySelectorAll('.pop-up')                      as NodeListOf<HTMLElement>;
        let floatingLabelElement = object.popUpContainer.querySelectorAll('.floating-label') as NodeListOf<HTMLElement>;

        object.button.onclick = () => {
            let display: string = object.popUpContainer.style.display;
            
            if ((display == '') || (display == 'none')) {
                object.popUpContainer.style.display = 'block';   //Makes the popUp appear
            } else if (!(object.popUpContainer.classList.contains('create-shortcut') && object.button.classList.contains('create-shortcut') && !(object.button.id.replace('-button', '-item') === object.popUpContainer.getAttribute('x')))) {
                object.popUpContainer.style.display = 'none';    //Makes the popUp disappear
            };

            popUpClass.forEach((element) => {   //Makes every other popUp disappear once the shorcut button is clicked
                if (element != object.popUpContainer) {
                    element.style.display = 'none'
                };
            });

            setTimeout(() => {
                floatingLabelElement.forEach((label) => {
                    const parent = label.parentElement as HTMLElement;
                    const siblings = Array.from(parent.children) as Array<HTMLElement>;
                    const input = siblings[siblings.indexOf(label) - 1] as HTMLInputElement; //Gets the imediate predecessor sibling
                    const rect = object.popUpContainer.getBoundingClientRect();
                    const inputRect = input.getBoundingClientRect();
        
                    const left = inputRect.left - rect.left;
                    label.style.left = Math.max(left, 5) + 'px';

                    input.placeholder ? input.placeholder = input.placeholder : input.placeholder = ' ';
                });
            }, 10);
        }

        object.popUpContainer.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();     //Makes the form not submit
                let okButton = object.popUpContainer.querySelector('.ok-button') as HTMLButtonElement;
                okButton.click();
            }
        });
    });
    
    //To make the Close Button work
    let buttons = document.querySelectorAll('.close-button') as NodeListOf<HTMLButtonElement>;
    buttons.forEach((button) => {
        let parent = button.parentElement!.parentElement as HTMLElement;
        button.onclick = () => {
            parent.style.display = 'none';
            setDefaults();
        };
    })
};

// To make the reddit search work
function redditSearchTrigger (): void { //NO NEED OF RESPONSIVENESS
    let okButtonReddit: HTMLButtonElement = document.querySelector('.pop-up.reddit-google .ok-button')!;
    okButtonReddit.onclick = redditSearch;

    function redditSearch (): void {
        const keywords = document.getElementById('keywords-reddit') as HTMLInputElement;
        const subreddit = document.getElementById('subreddit') as HTMLInputElement;
        const from = document.getElementById('from-date') as HTMLInputElement;
        const to = document.getElementById('to-date') as HTMLInputElement;
    
        var subredditStrings = subreddit.value.split(/ \/ /).filter((text) => {
            if (text != '') return true;
        }) as Array<string>;
    
        if ((new Date(from.value) >= new Date(to.value)) && from.value && to.value) return;
    
        let string = 'https://www.google.com/search?q=';
    
        if (keywords.value) {
            string = string + keywords.value.replace(' ','+');
    
            if (subredditStrings[0]) {
                subredditStrings.forEach((text) => {
                    if (subredditStrings.indexOf(text) > 0) {
                        string = string + '+OR+site%3Ahttps%3A%2F%2Freddit.com%2Fr%2F' + text.replaceAll(' ','_');
                    } else {
                        string = string + '+site%3Ahttps%3A%2F%2Freddit.com%2Fr%2F' + text.replaceAll(' ','_');
                    }
                })
            } else {
                string = string + '+site%3Ahttps%3A%2F%2Freddit.com%2F'
            }
    
            if (from.value) {
                string = string + '+after%3A' + from.value;
            }
    
            if (to.value) {
                string = string + '+before%3A' + to.value;
            }
    
            window.open(string, '_blank')?.focus();
        };
    }
};

//To make the wikipedia search work
function wikipediaSearchTrigger (): void { //NO NEED OF RESPONSIVENESS
    let okButtonWikipedia: HTMLButtonElement = document.querySelector('.pop-up.wikipedia .ok-button')!;
    okButtonWikipedia.onclick = wikipediaSearch;

    function wikipediaSearch (): void {
        let keywords = document.getElementById('keywords-wikipedia') as HTMLInputElement;
    
        let string = 'https://pt.wikipedia.org/w/index.php?search=';
    
        if (keywords.value) {
            string = string + keywords.value.replace(' ','+');
    
            window.open(string, '_blank')?.focus();
        }
    }
};

//To create new shortcuts
function createShortcutsTrigger (): void {

}

// To make the inputbox draggable
function dragPopUps (): void {
    const popUps: NodeListOf<HTMLElement> = document.querySelectorAll('.pop-up');
    let isDragging: boolean = false;
    let offsetX: number, offsetY: number;
    
    popUps.forEach((popUp) => {
        popUp.addEventListener('mousedown', startDragging);
        popUp.addEventListener('touchstart', startDragging);
        popUp.addEventListener('mousemove', drag);
        popUp.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
    })
    function startDragging (this: HTMLElement, event: MouseEvent | TouchEvent): void {
        let e: MouseEvent | Touch;

        if (event instanceof MouseEvent) {
            e = event;
        } else {
            e = event.touches[0];
        };

        let target = e.target as HTMLElement;

        if ((target === this || CustomFunctions.isParent(target, this.querySelector('.pop-up-header')!)) &&
            !(target instanceof HTMLImageElement) &&
            !(target instanceof HTMLParagraphElement) &&
            !(target instanceof HTMLSpanElement) &&
            !(target instanceof HTMLInputElement)) {
            isDragging = true;
            offsetX = e.clientX - this.offsetLeft;
            offsetY = e.clientY - this.offsetTop;
        }
    }; function drag (this: HTMLElement, event: MouseEvent | TouchEvent): void {
        let e: MouseEvent | Touch;
        
        if (event instanceof MouseEvent) {
            e = event;
        } else {
            e = event.touches[0];
        };

        if (isDragging) {
            let x: number = e.clientX - offsetX;
            let y: number = e.clientY - offsetY;

            this.style.left = x + 'px';
            this.style.top  = y + 'px';
        }
        event.preventDefault();
    }; function stopDragging (): void {
        isDragging = false;
    }
};

async function dragAndDropHandler () {
    function toggleHeaderInput (header: HTMLElement, forceText?: boolean): void {
        if (header.querySelector('input') === null) {
            header.innerHTML = forceText ? header.innerHTML : `<img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/list-drag-handle.svg" class="drag-handle"><input type="text" value="${header.textContent}"><span><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/check.svg"></span>`;
        } else {
            const input = header.querySelector('input') as HTMLInputElement;
            header.innerHTML = `<img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/list-drag-handle.svg" class="drag-handle">${input.value}<span><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg"></span>`;
        };
    }

    function toggleShortcutInput (shorcut: HTMLElement, forceText?: boolean): void {
        if (shorcut.querySelector('input') === null) {
            shorcut.innerHTML = forceText ? shorcut.innerHTML : shorcut.innerHTML.replace(shorcut.textContent!, `<input type="text" value="${shorcut.textContent!}">`).replace('edit.svg', 'check.svg');
        } else {
            const input = shorcut.querySelector('input') as HTMLInputElement;
            input.outerHTML = `${input.value}`
            shorcut.innerHTML = shorcut.innerHTML.replace('check.svg', 'edit.svg')
        };
    }

    function updateIcon (shorcut: HTMLElement) {
        const icon: HTMLImageElement = shorcut.querySelectorAll('img')[1];
        const src: string = icon.src;
        
        icon.outerHTML = `<input type="file" accept="image/*">`

        const newIcon = Array.from(shorcut.querySelectorAll('input')).pop() as HTMLInputElement;

        newIcon.files = null;
    }

    const popUp: HTMLFormElement = document.querySelector('.pop-up.create-shortcut')!;
    const dragAndDrop: HTMLDivElement = popUp.querySelector('#drag-and-drop')!;
    const addItemButton: HTMLButtonElement = popUp.querySelector('#add-drag-and-drop-button')!;
    const addItem: HTMLDivElement = popUp.querySelector('#add-drag-and-drop')!;
    const fileDrop: HTMLElement = addItem.querySelector('#drop-file')!;
    const bttn: HTMLButtonElement = document.querySelector('.create-shortcut.pop-up-open')!;
    const json: MyTypes.PageContent = JSON.parse(await (await fetch(`${server}contents?filename=contents`)).text());
    const submitBttn: HTMLButtonElement = popUp.querySelector('.ok-button')!;
    const addNewEntryBttn: HTMLButtonElement = popUp.querySelector('#add-drag-and-drop-submit')!;

    bttn.addEventListener('click', (ev) => {
        fileDrop.querySelector('img')!.src = 'https://storage.googleapis.com/statisticshock_github_io_public/icons/static/image.svg';

        for (const input of Array.from(addItem.querySelectorAll('input'))) {
            input.value = '';
        }

        addItemButton.classList.remove('active');
        dragAndDrop.style.display = 'grid'
        dragAndDrop.innerHTML = '';
        
        for (const shortcut of json.shortcuts) {
            dragAndDrop.insertAdjacentHTML('beforeend', `<div id="${shortcut.id}-list" class="drag-and-drop-list" draggable="false" x="shown"><h3 class="drag-and-drop-list-header"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/list-drag-handle.svg" class="drag-handle">${shortcut.title}<span><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg"></span></h3><div style="--children-length: ${shortcut.children.length};"></div></div>`);

            const dragAndDropList: HTMLDivElement = dragAndDrop.querySelector(`#${shortcut.id}-list div`)!;
            const dragAndDropListHeader: HTMLElement = dragAndDropList.parentElement!.querySelector('h3')!;

            for (const child of shortcut.children) {
                addItem.style.display = 'none';
                dragAndDropList.innerHTML += `<div id="${child.id}-list" class="drag-and-drop-item" draggable="false" y="${child.href}"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/list-drag-handle.svg" class="drag-handle">${child.alt}<span><img src="${child.img}" draggable="false"><input type="file" accept="image/*"></span><span><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg"></span></div>`;
            };
        };

        fileDrop.querySelector('input')!.files = null;
        fileDrop.querySelector('p')!.innerHTML = `Solte uma imagem aqui`;
    });

    addItemButton.onclick = function (ev) {
        if (addItemButton.classList.contains('active')) {
            addItemButton.classList.remove('active');
            addItem.style.display = 'none';
            dragAndDrop.style.display = 'grid'
            submitBttn.removeAttribute('style')
        } else {
            addItemButton.classList.add('active');
            addItem.style.display = 'block';
            dragAndDrop.style.display = 'none'
            submitBttn.style.display = 'none'
        }
    }

    function handleDropFile (): void {
        function activeFileDrop (): void {
            fileDrop.style.border = '3px solid var(--pink-custom)';
        };

        function inactiveFileDrop (): void {
            fileDrop.style.border = '3px dashed grey';
        };

        const input: HTMLInputElement = fileDrop.querySelector('input')!;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((evName) => fileDrop.addEventListener(evName, (e) => e.preventDefault()));
        ['dragenter', 'dragover'].forEach((evName) => fileDrop.addEventListener(evName, (e) => activeFileDrop()));
        ['dragleave', 'drop'].forEach((evName) => fileDrop.addEventListener(evName, (e) => inactiveFileDrop()));
        fileDrop.addEventListener('drop', (e) => {
            const dt: DataTransfer = e.dataTransfer!;
            const filesDt: FileList = dt.files;

            input.files = filesDt;
            fileDrop.querySelector('p')!.innerHTML = `"${input.files[0].name}" selecionado.`
        });

        fileDrop.querySelector('input')!.addEventListener('change', (e) => {
            if (input.files && input.files[0]) {
                fileDrop.querySelector('p')!.innerHTML = `"${input.files[0].name}" selecionado.`
                
                let reader = new FileReader();

                reader.onload = (ev) => {fileDrop.querySelector('img')!.src = ev.target!.result as string}

                reader.readAsDataURL(input.files[0]);
            } else {
                fileDrop.querySelector('p')!.innerHTML = 'Solte uma imagem aqui';
            };
        });
    }

    handleDropFile();

    popUp.addEventListener('submit', async (ev) => { //It submits the adition of a shortcut
        ev.preventDefault();
        const formData: FormData = new FormData(popUp);

        addItem.querySelectorAll('input').forEach((input) => { //To alert if an input is empty
            if (input.type === 'text' && input.value === '') {
                input.style.setProperty('--initial-color', getComputedStyle(input).backgroundColor);
                input.classList.add('pulse');
                setTimeout(() => {
                    input.classList.remove('pulse');
                    input.style.removeProperty('--initial-color');
                }, 1800);
            } else if (input.type === 'file' && input.files!.length === 0) {
                input.parentElement!.style.setProperty('--initial-color', getComputedStyle(input).backgroundColor);
                input.parentElement!.classList.add('pulse');
                setTimeout(() => {
                    input.parentElement!.classList.remove('pulse');
                    input.parentElement!.style.removeProperty('--initial-color');
                }, 1800);
            };
        });
        
        for (const [key, value] of Array.from(formData)) {
            if (typeof value === 'string' && value === '') return;
            if (value instanceof File && value.size === 0) return;
        };

        try {
            const response: Response = await fetch(`${server}upload/`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const textJson: MyTypes.ShortcutResponse = await response.json();
                const targetListToAddNewData: HTMLDivElement | null = dragAndDrop.querySelector(`${textJson.sectionId}-list`);

                if (targetListToAddNewData === null) {

                } else {

                };
            } else {
                const textJson: MyTypes.ErrorJson = await response.json();
                alert(`ERRO:\n${textJson.message}`)
            }

        } catch (err) {

        };
    })

    dragAndDrop.addEventListener('click', (ev) => {
        const header = (ev.target as HTMLElement).closest('.drag-and-drop-list-header');
        if (!header) return;
        if ((ev.target as HTMLElement).tagName === 'INPUT') return;
        if (CustomFunctions.isParent(ev.target as HTMLElement, header.querySelector('span') as HTMLSpanElement)) {
            toggleHeaderInput(header as HTMLElement);
            return;
        };

        const container = header.parentElement!;

        const isShown = container.getAttribute('x') === 'shown';

        container.setAttribute('x', isShown ? 'hidden' : 'shown');
        container.classList.toggle('hidden', isShown);
    });

    dragAndDrop.addEventListener('click', (ev) => {
        const shortcut = (ev.target as HTMLElement).closest('.drag-and-drop-item') as HTMLDivElement;
        if (!shortcut) return;
        else if ((ev.target as HTMLElement).tagName === 'INPUT') return;
        else if (shortcut.querySelector('input') !== null && shortcut.querySelector('input')!.value === '') return;
        else if (CustomFunctions.isParent(ev.target as HTMLElement, shortcut.querySelector('span') as HTMLSpanElement)) toggleShortcutInput(shortcut as HTMLElement);
        else if ((ev.target as HTMLElement) === shortcut.querySelectorAll('img')[1]) updateIcon(shortcut);
    });

    dragAndDrop.addEventListener('mousemove', (ev) => {
        if (mobile) return;
        
        const sections: Array<HTMLElement> = Array.from(document.querySelectorAll('.container .flex-container section:has(.grid-container)'));

        sections.forEach((section) => {
            if (!(ev.target as HTMLElement).closest('.drag-and-drop-list')) return;
            if ((ev.target as HTMLElement).closest('.drag-and-drop-list')!.id.replace('-list', '') === section.id) {
                section.querySelector('p')!.classList.add('animated');
            } else {
                section.querySelector('p')!.classList.remove('animated')
            }
        })
    });

    dragAndDrop.addEventListener('mouseleave', (ev) => {
        const sections: Array<HTMLElement> = Array.from(document.querySelectorAll('.container .flex-container section:has(.grid-container)'));
        sections.forEach((section) => {
            section.querySelector('p')!.classList.remove('animated')
        })
    });
};

// To make the defaults load within the window
function setDefaults (): void {
    let keywordsReddit = document.getElementById('keywords-reddit') as HTMLInputElement;
    let subreddit = document.getElementById('subreddit') as HTMLInputElement;
    let toDate = document.getElementById('to-date') as HTMLInputElement;
    let fromDate = document.getElementById('from-date') as HTMLInputElement;

    keywordsReddit.value = '';
    subreddit.value = '';
    toDate.valueAsDate = new Date();
    fromDate.valueAsDate = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())

    let keywordsWikipedia = document.getElementById('keywords-wikipedia') as HTMLInputElement;

    keywordsWikipedia.value = '';
};

// To add MFC images in the aside and do 
async function addMfcImages (): Promise<void> {
    function resizeMasonryItem (item: HTMLElement): void {
        /* Get the grid object, its row-gap, and the size of its implicit rows */
        let grid = document.getElementsByClassName('pinterest-grid')[0],
            rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
            rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
      
        /*
         * Spanning for any brick = S
         * Grid's row-gap = G
         * Size of grid's implicitly create row-track = R
         * Height of item content = H
         * Net height of the item = H1 = H + G
         * Net height of the implicit row-track = T = G + R
         * S = H1 / T
         */
        let rowSpan = Math.ceil((item.offsetHeight + rowGap)/(rowHeight + rowGap));
      
        /* Set the spanning as calculated above (S) */
        item.style.gridRowEnd = 'span '+rowSpan;
    }
    
    function resizeAllMasonryItems (): void {
        // Get all item class objects in one list
        let allItems = document.querySelectorAll('.pinterest-grid-item') as NodeListOf<HTMLElement>;
      
        for(let i=0;i<allItems.length;i++){
          resizeMasonryItem(allItems[i]);
        };
    }

    type mfc = {
        [key: string]: string
        id: string,
        href: string,
        img: string,
        character: string,
        characterJap: string,
        origin: string,
        classification: string,
        category: string,
        type: string,
        title: string,
    }

    let result: mfc[] = await (await fetch(`${server}contents?filename=mfc`)).json();

    let createElementPromise = new Promise ((resolve, reject) => { //This creates a promise that will create every item in the aside
        resolve(result.sort((a: mfc, b: mfc) => Number(a.id) - Number(b.id)).map(createElement));
    });
    
    createElementPromise.then(() => {
        setTimeout(resizeAllMasonryItems, 1000);
        setTimeout(resizeAside, 1000);

        const input: HTMLInputElement = document.querySelector('#search-bar')!;
        const loader: HTMLDivElement = document.querySelector('.container .flex-container aside > .loader')!;

        let timeout: NodeJS.Timeout;
        input.addEventListener('keyup', (ev) => {
            clearTimeout(timeout);
            loader.style.display = '';
            
            timeout = setTimeout(() => {
                searchFigure(input, result);
                loader.style.display = 'none';
            }, 2000);
        })
    });
    
    function createElement (item: mfc) { //To create the necessary elements
        let div  = document.createElement('div');   // The container
        let img  = new Image()                      // The image
        let card: HTMLElement;

        if (item.type !== 'Wished') {
            card = document.getElementById('owned-ordered') as HTMLElement;
        } else {
            card = document.getElementById('wished') as HTMLElement;
            div.classList.add('wished');
        }
        

        div.setAttribute('alt', item.title);
        div.classList.add('pinterest-grid-item');
        div.id = item.id;
        img.src = item.img;

        if (item.category == 'Prepainted') {
            div.style.color = 'green';
        } else if (item.category == 'Action/Dolls') {
            div.style.color = '#0080ff';
        } else {
            div.style.color = 'orange';
        }

        img.style.border = `4px solid ${div.style.color}`;

        let imgBorder = img.style.border.split(' ')[0];

        img.style.width = `calc(100% - ${imgBorder} * 2)`

        img.onclick = () => { //Format a pop-up for each item once it's image is clicked
            console.log(1)
            let popUp          = document.querySelector('.pop-up.mfc')               as HTMLDivElement;
            let title          = popUp.querySelector('.pop-up-title')                as HTMLSpanElement;
            let popUpImgAnchor = popUp.querySelector('#pop-up-img')                  as HTMLAnchorElement;
            let popUpImg       = popUpImgAnchor.childNodes[0]                        as HTMLImageElement;
            let originalName   = popUp.querySelector('#mfc-character-original-name') as HTMLSpanElement;
            let originName     = popUp.querySelector('#mfc-character-origin')        as HTMLSpanElement;
            let classification = popUp.querySelector('#mfc-classification')          as HTMLSpanElement;
            let a              = popUp.querySelector('.pop-up-header > div > a')     as HTMLAnchorElement;

            let characterLink: string = '';
            let originLink: string = '';
            let classificationLink: string = '';


            if (item.characterJap) {
                characterLink = `https://buyee.jp/item/search/query/${encodeURIComponent(item.characterJap)}/category/2084023782?sort=end&order=a&store=1`;
            } else {
                characterLink = `https://buyee.jp/item/search/query/${encodeURIComponent(item.character)}/category/2084023782?sort=end&order=a&store=1`;
            };
            if (item.origin !== 'オリジナル' && item.origin !== undefined) {
                originName.parentElement!.style.display = '';
                originLink = `https://buyee.jp/item/search/query/${encodeURIComponent(item.origin)}/category/2084023782?sort=end&order=a&store=1`;
            } else {
                originName.parentElement!.style.display = 'none';
            };
            if (item.classification !== undefined) {
                classification.parentElement!.style.display = '';
                classificationLink = `https://buyee.jp/item/search/query/${encodeURIComponent(item.classification.replaceAll('#',''))}/category/2084023782?sort=end&order=a&store=1`;
            } else {
                classification.parentElement!.style.display = 'none';
            };
            
            title.innerHTML             = item.title;
            popUpImgAnchor.href         = item.href;
            popUpImg.src                = img.src;
            popUpImg.style.border       = `${imgBorder} solid ${div.style.color}`            
            
            const copySvg: string = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200.000000 200.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none"><path d="M721 1882 c-71 -36 -76 -51 -79 -268 l-3 -194 60 0 61 0 2 178 3 177 475 0 475 0 0 -475 0 -475 -117 -3 -118 -3 0 -60 0 -61 134 4 c151 3 175 12 209 79 16 31 17 73 15 531 -3 484 -4 497 -24 525 -47 64 -39 63 -574 63 -442 0 -488 -2 -519 -18z"/><path d="M241 1282 c-19 -9 -44 -30 -55 -45 -20 -28 -21 -41 -24 -525 -3 -555 -4 -542 67 -589 l34 -23 496 0 c477 0 497 1 529 20 18 11 41 34 52 52 19 32 20 52 20 529 l0 496 -23 34 c-47 70 -36 69 -577 69 -442 0 -488 -2 -519 -18z m994 -582 l0 -475 -475 0 -475 0 -3 465 c-1 256 0 471 3 478 3 10 104 12 477 10 l473 -3 0 -475z"/></g></svg>`;
            
            originalName.innerHTML      = item.characterJap !== '' ? `<a target="_blank" href="${characterLink}">${copySvg}&nbsp;${item.characterJap}</a>` : `<a target="_blank" href="${characterLink}">${copySvg}&nbsp;${item.character}</div></a>`;
            originName.innerHTML        = `<a target="_blank" href="${originLink}">${copySvg}&nbsp;${item.origin}</a>`;
            classification.innerHTML    = `<a target="_blank" href="${classificationLink}">${copySvg}&nbsp;${item.classification}</a>`;

            if (item.type == 'Owned') {
                a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user'
            } else if (item.type == 'Ordered') {
                a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user'
            } else if (item.type == 'Wished') {
                a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user'
            }

            //NEXT LINE MUST BE CHANGED EACH TIME A LINK IS ADDED 
            const links = [originalName, originName, classification] as HTMLSpanElement[];

            console.log(links);

            links.forEach((link) => {
                console.log(link);
                link.addEventListener('click', (ev: MouseEvent | TouchEvent) => {
                    console.log(1);
                    const target = (ev as TouchEvent).touches ? ((ev as TouchEvent).touches[0]?.target as HTMLElement) || (ev.target as HTMLElement) : (ev.target as HTMLElement);
                    const copyToClipboard = (ev: MouseEvent | TouchEvent, target: HTMLElement) => {
                        ev.preventDefault();
                        navigator.clipboard.writeText(target.textContent.trim());
                    };

                    if (target instanceof SVGElement) copyToClipboard(ev, target);
                    console.log(target);
                })
            })
            
            popUp.style.display = 'block';
        }

        div.append(img);
        card.append(div);
        div.append(item.character);
    };

    function searchFigure (textInput: HTMLInputElement, json: mfc[]) {
        let searchStr: RegExp = new RegExp(textInput.value, 'i');

        console.info(`A string procurada é ${searchStr}`);
        
        const figuresToHide = json.filter((figure) => {
            let count = 0;

            Object.keys(figure).forEach((key: string) => {
                if (searchStr.test(figure[key])) {
                    count += 1;
                }
            });

            return count === 0;
        });

        const divs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.pinterest-grid-item');

        divs.forEach((div) => {
            div.style.display = 'block';

            if (figuresToHide.filter((figure) => figure.id === div.id).length > 0) {
                div.style.display = 'none';
            };
        });
    };

    setInterval(() => {
        resizeAllMasonryItems();
    }, 500)

    setTimeout(() => { //Should run immeditialy after "resizeAllMasonryItems"
        const loader: HTMLDivElement = document.querySelector('aside > .card > .loader')!;
        const pinterestGrids: NodeListOf<HTMLSpanElement> = document.querySelectorAll('aside > .card > .pinterest-grid');
        
        loader.style.display = 'none';
        pinterestGrids.forEach((grid) => {
            grid.style.opacity = '1'
        });
    }, 1000);

    setInterval(() => {
        const card: HTMLDivElement = document.querySelector('aside .card')!;
        const grids: NodeListOf<HTMLDivElement> = card.querySelectorAll('.pinterest-grid');

        grids.forEach((grid) => {
            grid.style.width = (parseFloat(getComputedStyle(card).width) / 2) + 'px';
        })
    }, 500)
};

// To add a MyAnimeList card
async function scrapeMyAnimeList (): Promise<void> {
    async function scrapeDataFromMAL (offset: number): Promise<[MyTypes.AnimeList['data'], MyTypes.MangaList['data']]> {
        const animeData: MyTypes.AnimeList = await fetch(`${server}myanimelist?type=animelist&username=HikariMontgomery&offset=${offset}`)
        .then(response => response.json());
        const animeDataData: MyTypes.AnimeList["data"] = animeData.data.filter((entry) => entry.node.nsfw === 'white').slice(0, 10);

        const mangaData: MyTypes.MangaList = await fetch(`${server}myanimelist?type=mangalist&username=HikariMontgomery&offset=${offset}`)
        .then(response => response.json());
        const mangaDataData: MyTypes.MangaList["data"] = mangaData.data.filter((entry) => entry.node.nsfw === 'white').slice(0, 10);

        return [animeDataData, mangaDataData];
    };

    let output: Promise<[MyTypes.AnimeList['data'], MyTypes.MangaList['data']]> = scrapeDataFromMAL(0);
    const animeCard: HTMLDivElement = document.querySelector('#my-anime-list .inner-card.anime')!;
    const mangaCard: HTMLDivElement = document.querySelector('#my-anime-list .inner-card.manga')!;

    output.then((res) => {
        for (let i = 0; i < 2; i++) { //Adds two of each anime/manga entry to make it look infinite

            createCards(res[0], animeCard);
            createCards(res[1], mangaCard);

            if (i === 1) {
                makeCarouselSlide(res[0], animeCard);
                makeCarouselSlide(res[1], mangaCard);
            }
        };

        setDefaultScroll();
        selectOnlyTheCurrentImage();
    }).then((res) => {
        let loaders: NodeListOf<HTMLDivElement> = document.querySelectorAll('#my-anime-list .loader')!;
        let innerCards: NodeListOf<HTMLDivElement> = document.querySelectorAll('#my-anime-list .inner-card')!;
        
        loaders.forEach((loader) => {
            loader.style.display = 'none';
        })
        innerCards.forEach((innerCard) => {
            innerCard.style.opacity = '1';
        })
    })

    function createCards (entries: MyTypes.AnimeList['data'] | MyTypes.MangaList['data'], card: HTMLDivElement, insertBefore?: boolean): void {
        const firstCard = card.firstElementChild as HTMLAnchorElement | null;
        
        entries.forEach((entry) => {
            const typeOfMedia: string = Object.keys(entry.list_status).includes('is_rewatching') ? 'anime' : 'manga';

            const img: HTMLImageElement = new Image();
            img.src = entry.node.main_picture.large;
            const a: HTMLAnchorElement = document.createElement('a');
            a.appendChild(img);
            a.target = '_blank';
            a.href = `https://myanimelist.net/${typeOfMedia}/${entry.node.id}/`
            const div: HTMLDivElement = document.createElement('div');
            div.classList.add('paragraph-container');
            const bold: HTMLElement = document.createElement('b');
            bold.innerHTML = `#${entry.node.rank === undefined ? 'N/A' : entry.node.rank}`
            const span: HTMLSpanElement = document.createElement('span');
            span.innerHTML = `<p><span>Título&nbsp;</span><span>${entry.node.title}</span></p>`;
            const p2: HTMLParagraphElement = document.createElement('p');
            if ('num_episodes_watched' in entry.list_status && 'num_episodes' in entry.node) {
                p2.innerHTML = `<span>Assistidos&nbsp;</span><span>${entry.list_status.num_episodes_watched}/${entry.node.num_episodes === 0 ? '??' : entry.node.num_episodes}</span>`;
            } else if ('num_chapters_read' in entry.list_status && 'num_chapters' in entry.node) {
                p2.innerHTML = `<span>Lidos&nbsp;</span><span>${entry.list_status.num_chapters_read}/${entry.node.num_chapters === 0 ? '??' : entry.node.num_chapters}</span>`;
            };
            const p3: HTMLParagraphElement = document.createElement('p');
            const genres: Array<string> = [];
            for (const genre of entry.node.genres) {
                genres.push(genre.name);
            }
            p3.innerHTML = `<span>Gêneros&nbsp;</span><span>${genres.join(', ')}</span>`
            div.style.display = mobile ? '' : 'none';
            img.style.opacity = mobile ? '0.25' : '1'

            span.appendChild(p2);
            span.appendChild(p3);

            if (entry.list_status.score !== 0) {
                const p4: HTMLParagraphElement = document.createElement('p');
                p4.innerHTML = `<span>Pontuação&nbsp;</span><span>${'⭐'.repeat(entry.list_status.score)}\n(${entry.list_status.score}/10)</span>`;
                span.appendChild(p4);
            }
            
            div.appendChild(bold);
            div.appendChild(span);
            a.appendChild(div);
            
            if (insertBefore) {
                card.insertBefore(a, firstCard);
            } else {
                card.appendChild(a);
            }

            if (!mobile) {
                a.addEventListener('mouseenter', showEntryData, true);
                a.addEventListener('touchstart', showEntryData, true);
                a.addEventListener('mouseleave', hideEntryData, true);
                a.addEventListener('touchend', hideEntryData, true);
            };

            function showEntryData (): void {
                div.style.display = '';
                img.style.opacity = '0.25';
            };

            function hideEntryData (): void {
                div.style.display = 'none';
                img.style.opacity = '1';
            };
        });
    };

    function setDefaultScroll (): void {
        const itemWidth: number = animeCard.querySelector('a')!.getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(animeCard).gap);
        
        animeCard.scrollTo((itemWidth + gap) * 10,0);
        mangaCard.scrollTo((itemWidth + gap) * 10,0);
    };

    function makeCarouselSlide (entries: MyTypes.AnimeList['data'] | MyTypes.MangaList['data'], card: HTMLDivElement): void {
        function getClosestAnchor (container: HTMLDivElement): HTMLAnchorElement {
            const rect: DOMRect = container.getBoundingClientRect();
            const center: number = rect.left + rect.width / 2;
            
            const anchors: NodeListOf<HTMLAnchorElement> = container.querySelectorAll('a');
            let closestAnchor: HTMLAnchorElement | null = null;
            let closestDistance: number = Infinity; //First distance as a number
            
            anchors.forEach((anchor) => {
                const anchorRect: DOMRect = anchor.getBoundingClientRect();
                const anchorCenter: number = anchorRect.left + anchorRect.width / 2;
                const distance: number = Math.abs(center - anchorCenter);

                if (distance < closestDistance) {
                    closestDistance = distance; //Assigns the lowest possible distance
                    closestAnchor = anchor;
                }
            });

            return closestAnchor!;
        };

        const navBttns: NodeListOf<HTMLButtonElement> = card.parentElement!.querySelectorAll('.nav-button');
        navBttns.forEach((bttn) => {
            bttn.addEventListener('click', scrollFunction); function scrollFunction (e: MouseEvent | TouchEvent) {
                const target = e.target as HTMLButtonElement;
                const direction: string = target.classList.contains('left') ? 'left' : 'right';
                let anchor: HTMLAnchorElement = getClosestAnchor(card);
                const anchors: NodeListOf<HTMLAnchorElement> = card.querySelectorAll('a');

                const width: number = card.scrollWidth;
                const anchorWidth: number = parseFloat(getComputedStyle(anchor).width);
                const gap: number = parseFloat(getComputedStyle(card).gap);

                if (direction === 'left') {
                    card.scrollBy({left: - width / anchors.length, behavior: 'smooth'});

                    if (anchor === anchors[5] || anchor === anchors[4]) {
                        const frstChild = card.firstElementChild as HTMLAnchorElement;
                        const previousOffset: number = frstChild.offsetLeft;
                        
                        createCards(entries, card, true);

                        const newOffset: number = frstChild.offsetLeft;

                        card.style.scrollBehavior = 'auto'; //Sets to 'auto' momentanely
                        card.scrollLeft += (newOffset - previousOffset);
                        card.scrollBy({left: - width / anchors.length, behavior: 'smooth'});
                        card.style.scrollBehavior = 'smooth'; //Reverts it to 'smooth'

                        const allAnchors: NodeListOf<HTMLAnchorElement> = card.querySelectorAll('a');
                        const anchorsToRemove: Array<HTMLAnchorElement> = Array.from(allAnchors).slice(allAnchors.length - 10, allAnchors.length);
                        anchorsToRemove.forEach((anchorToRemove) => {
                            anchorToRemove.remove();
                        });
                    };
                } else if (direction === 'right') {
                    card.scrollBy({left: width / anchors.length, behavior: 'smooth'});

                    if (anchor === anchors[anchors.length - 5] || anchor === anchors[anchors.length - 4]) {
                        const frstChild = card.lastElementChild as HTMLAnchorElement;
                        const previousOffset: number = frstChild.offsetLeft;
                        
                        createCards(entries, card, false);

                        const allAnchors: NodeListOf<HTMLAnchorElement> = card.querySelectorAll('a');
                        const anchorsToRemove: Array<HTMLAnchorElement> = Array.from(allAnchors).slice(0, 10);
                        anchorsToRemove.forEach((anchorToRemove) => {
                            anchorToRemove.remove();
                        });

                        const newOffset: number = frstChild.offsetLeft;

                        card.style.scrollBehavior = 'auto'; //Sets to 'auto' momentanely
                        card.scrollLeft += (newOffset - previousOffset);
                        card.scrollBy({left: width / anchors.length, behavior: 'smooth'});
                        card.style.scrollBehavior = 'smooth'; //Reverts it to 'smooth'
                    };
                };
            };
        });
    };

    function selectOnlyTheCurrentImage (): void {
        if (!mobile) return;
        else {
            [animeCard, mangaCard].forEach((card) => {
                const entries = card.querySelectorAll('a');
                const navBttns = card.parentElement!.querySelectorAll('.nav-button') as NodeListOf<HTMLElement>;

                entries.forEach((entry) => {
                    entry.addEventListener('click', (e) => {
                        let collision: boolean = false;
                        navBttns.forEach((bttn) => {
                            if (CustomFunctions.doesItCollide(entry, bttn)) {
                                collision = true;
                            };
                        });

                        if (collision) {
                            e.preventDefault();
                        }
                    });
                });
            });
        };
    };
};

window.addEventListener('load', onLoadFunctions, true); async function onLoadFunctions (ev: Event) {
    createLoaders(10);
    await loadContentFromJson();
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
    if (mobile) goThroughRules(document.styleSheets[0].cssRules)
    await Promise.all([addMfcImages(), scrapeMyAnimeList()]);
};
window.addEventListener('resize', onResizeFunctions, true); function onResizeFunctions (ev: Event) {
    setTimeout(() => {
        resizeAside();
        figuresSitDown();
        rotateGamecardText(0);
    }, 500);
};
window.addEventListener('scroll', onScrollFunctions, true); function onScrollFunctions (ev: Event) {
    resizeHeader();
};