import { AsyncLocalStorage } from "async_hooks";
import CustomFunctions from "../util/functions.js";
import * as MyTypes from "../util/types.js";
import { text } from "stream/consumers";

const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
const mobile = /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(ua.toLowerCase());
const portrait: boolean = (window.innerWidth < window.innerHeight);

const server: string = window.location.href === 'http://127.0.0.1:5500/' ? 'http://localhost:3000/' : 'https://statisticshock-github-io.onrender.com/';
console.log(`Running server at ${server}`);

class PageBuilding {
	static createLoaders(counter: number): void {	// NO NEED OF RESPONSIVENESS
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

	static resizeAside(counter?: number): void {	// RESPONSIVE
		const aside: HTMLElement = document.querySelector('aside')!;
		const shortcuts: HTMLElement = document.querySelector('#shortcuts')!;
		const card: HTMLDivElement = aside.querySelector('.card')!;

		aside.style.height = 'fit-content';
		shortcuts.style.height = 'fit-content';
		card.style.height = 'fit-content';

		if (parseFloat(getComputedStyle(aside).height) < parseFloat(getComputedStyle(shortcuts).height)) {
			aside.style.height = (shortcuts.offsetHeight + 10) + 'px';
		} else {
			shortcuts.style.height = aside.offsetHeight + 'px';
		};

		aside.style.height = aside.offsetHeight + 'px';
		shortcuts.style.height = shortcuts.offsetHeight + 'px';
		card.style.height = card.offsetHeight + 'px';

		if (counter == 0) {
			setTimeout(() => {
				this.resizeAside(1);
			}, 750);
		};
	};

	static adjustGamecard(): void { // NEED TO TEST
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

	static adjustGamecardText(counter: number): void { // RESPONSIVE
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
			setTimeout(this.adjustGamecardText, 100);
		};
	};

	static figuresSitDown(): void {	// RESPONSIVE
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

	static formatPopUps(): void { // NO NEED OF RESPONSIVENESS
		type popUpInterface = { button: HTMLAnchorElement | HTMLButtonElement, popUpContainer: HTMLFormElement }
		const popUpShortcuts: Array<popUpInterface> = [];

		(document.querySelectorAll('form.pop-up') as NodeListOf<HTMLFormElement>).forEach((form) => {
			if (form.classList.length < 2) return;

			const otherClass: string = Array.from(form.classList).filter((className) => className !== 'pop-up')[0];

			const openBttn = Array.from(document.querySelectorAll(`.${otherClass}`)).filter((element) => element.classList.contains('pop-up-open'))[0] as HTMLAnchorElement | HTMLButtonElement;

			popUpShortcuts.push({ button: openBttn, popUpContainer: form });
		});

		popUpShortcuts.forEach((object) => {
			let popUpClass = document.querySelectorAll('.pop-up') as NodeListOf<HTMLElement>;
			let floatingLabelElement = object.popUpContainer.querySelectorAll('.floating-label') as NodeListOf<HTMLElement>;

			object.button.onclick = () => {
				let display: string = object.popUpContainer.style.display;

				if ((display == '') || (display == 'none')) {
					object.popUpContainer.style.display = 'block';
				} else if (!(object.popUpContainer.classList.contains('create-shortcut') && object.button.classList.contains('create-shortcut') && !(object.button.id.replace('-button', '-item') === object.popUpContainer.getAttribute('x')))) {
					object.popUpContainer.style.display = 'none';
				};

				popUpClass.forEach((element) => {
					if (element != object.popUpContainer) {
						element.style.display = 'none'
					};
				});

				setTimeout(() => {
					floatingLabelElement.forEach((label) => {
						const parent = label.parentElement as HTMLElement;
						const siblings = Array.from(parent.children) as Array<HTMLElement>;
						const input = siblings[siblings.indexOf(label) - 1] as HTMLInputElement;
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
					e.preventDefault();
					let okButton = object.popUpContainer.querySelector('.ok-button') as HTMLButtonElement;
					okButton.click();
				}
			});
		});
	};
};

class UserInterface {
	static expandAside(): void { // RESPONSIVE
		const asideShownName: string = 'asideIsShown'
		if (localStorage.getItem(asideShownName) === null) localStorage.setItem(asideShownName, 'true');

		const aside: HTMLElement = document.querySelector('aside')!;
		const div: HTMLDivElement = aside.querySelector('.button-bar')!;
		const bttn: HTMLButtonElement = aside.querySelector('#expand-button')!;
		const span: HTMLSpanElement = bttn.querySelector('span')!;
		const shortcuts: HTMLTableSectionElement = document.querySelector('#shortcuts')!;
		const flexContainer: HTMLDivElement = document.querySelector('.flex-container')!;
		const input: HTMLInputElement = aside.querySelector('input')!;

		if (localStorage.getItem(asideShownName) !== 'false') aside.classList.remove('hidden');

		bttn.onclick = function (ev) {
			if (!portrait) {
				if (!aside.classList.contains('hidden')) {
					span.style.transform = `rotate(180deg) translate(0%,-10%)`;
					aside.classList.add('hidden');
					localStorage.setItem(asideShownName, 'false');
				} else {
					span.style.transform = `rotate(0deg) translate(0%,-10%)`;
					aside.classList.remove('hidden');
					localStorage.setItem(asideShownName, 'true');
				};
			} else {
				if (!aside.classList.contains('hidden')) {
					aside.classList.add('hidden');
					localStorage.setItem(asideShownName, 'false');
				} else {
					aside.classList.remove('hidden');
					localStorage.setItem(asideShownName, 'true');
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

	static makeAsideButtonFollow(): void { // NOT RESPONSIVE YET
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

	static nightModeToggle(): void { // RESPONSIVE
		const label = document.querySelector('#night-mode-toggle') as HTMLLabelElement;

		let input = label.querySelector('input') as HTMLInputElement;

		const themeStyleName: string = 'darkOrLightTheme';
		if (localStorage.getItem(themeStyleName) === null) {
			const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
			input.checked = isDark;
		} else if (localStorage.getItem(themeStyleName) === 'dark') {
			input.checked = true;
		} else if (localStorage.getItem(themeStyleName) === 'light') {
			document.documentElement.setAttribute('data-theme', 'light');
		};

		input.addEventListener('change', (ev) => {
			setTimeout(() => {
				if (input.checked) {
					document.documentElement.setAttribute('data-theme', 'dark');
					localStorage.setItem(themeStyleName, 'dark');
				} else {
					document.documentElement.setAttribute('data-theme', 'light');
					localStorage.setItem(themeStyleName, 'light');
				};
			}, 100);
		});
	};

	static resizeHeader(): void { // NOT RESPONSIVE YET
		const header: HTMLElement = document.querySelector('header')!;
		const nav: HTMLElement = document.querySelector('nav')!;
		const height: number = parseFloat(getComputedStyle(header).height);
		const windowWidth: number = document.documentElement.scrollWidth;
		const scrollY: number = window.scrollY;
		const ohtoHeight: number = parseFloat(getComputedStyle(document.querySelector('#ohto')!).height);

		header.style.aspectRatio = Math.min(windowWidth / ohtoHeight, Math.max(5, (5 * ((scrollY + height) / height)))) + '';

		const newHeight: number = parseFloat(getComputedStyle(header).height);
		nav.style.top = newHeight + 'px';
	};

	static makeSwitchesSlide(): void { // NO NEED OF RESPONSIVENES
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
			let checkedPosition = parent.offsetWidth - parseFloat(uncheckedPosition) * 4 - parseFloat(getComputedStyle(slider, '::before').width) + 'px';

			slider.style.setProperty('--total-transition', checkedPosition);
			input.style.setProperty('--total-transition', checkedPosition);
		})
	};

	static dragPopUps(): void {	// RESPONSIVE
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
		function startDragging(this: HTMLElement, event: MouseEvent | TouchEvent): void {
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
		}; function drag(this: HTMLElement, event: MouseEvent | TouchEvent): void {
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
				this.style.top = y + 'px';
			}
			event.preventDefault();
		}; function stopDragging(): void {
			isDragging = false;
		}
	};

	static resetPopUpsOnOpen (): void {	// NO NEED OF RESPONSIVENESS
		const buttons = document.querySelectorAll('.close-button') as NodeListOf<HTMLButtonElement>;
		buttons.forEach((button) => {
			const parent = button.parentElement!.parentElement as HTMLElement;
			button.onclick = () => {
				parent.style.display = 'none';
				this.setPopUpDefaultValues();
			};
		});
	};

	static setPopUpDefaultValues (): void {	// NO NEED OF RESPONSIVENESS
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

	static showPopUps(): void { //NO NEED OF RESPONSIVENESS
		type popUpInterface = { button: HTMLAnchorElement | HTMLButtonElement, popUpContainer: HTMLFormElement }
		const popUpShortcuts: Array<popUpInterface> = [];

		(document.querySelectorAll('form.pop-up') as NodeListOf<HTMLFormElement>).forEach((form) => {
			if (form.classList.length < 2) return;

			const otherClass: string = Array.from(form.classList).filter((className) => className !== 'pop-up')[0];

			const openBttn = Array.from(document.querySelectorAll(`.${otherClass}`)).filter((element) => element.classList.contains('pop-up-open'))[0] as HTMLAnchorElement | HTMLButtonElement;

			popUpShortcuts.push({ button: openBttn, popUpContainer: form });
		});

		popUpShortcuts.forEach((object) => {
			let popUpClass = document.querySelectorAll('.pop-up') as NodeListOf<HTMLElement>;
			let floatingLabelElement = object.popUpContainer.querySelectorAll('.floating-label') as NodeListOf<HTMLElement>;

			object.button.onclick = () => {
				let display: string = object.popUpContainer.style.display;

				if ((display == '') || (display == 'none')) {
					object.popUpContainer.style.display = 'block';
				} else if (!(object.popUpContainer.classList.contains('create-shortcut') && object.button.classList.contains('create-shortcut') && !(object.button.id.replace('-button', '-item') === object.popUpContainer.getAttribute('x')))) {
					object.popUpContainer.style.display = 'none';    //Makes the popUp disappear
				};

				popUpClass.forEach((element) => {   // Makes every other popUp disappear once the shorcut button is clicked
					if (element != object.popUpContainer) {
						element.style.display = 'none'
					};
				});

				setTimeout(() => {
					floatingLabelElement.forEach((label) => {
						const parent = label.parentElement as HTMLElement;
						const siblings = Array.from(parent.children) as Array<HTMLElement>;
						const input = siblings[siblings.indexOf(label) - 1] as HTMLInputElement;
						const rect = object.popUpContainer.getBoundingClientRect();
						const inputRect = input.getBoundingClientRect();

						const left = inputRect.left - rect.left;

						label.style.left = '5px';

						input.placeholder ? input.placeholder = input.placeholder : input.placeholder = ' ';
					});
				}, 10);
			}

			object.popUpContainer.addEventListener('keydown', function (e) {
				if (e.key === 'Enter') {
					e.preventDefault();
					let okButton = object.popUpContainer.querySelector('.ok-button') as HTMLButtonElement;
					okButton.click();
				}
			});
		});

		let buttons = document.querySelectorAll('.close-button') as NodeListOf<HTMLButtonElement>;
		buttons.forEach((button) => {
			let parent = button.parentElement!.parentElement as HTMLElement;
			button.onclick = () => {
				parent.style.display = 'none';
				this.setPopUpDefaultValues();
			};
		})
	};

	static makeButtonFromAsideFollowHeader (): void { // RESPONSIVE
		if (!portrait) return;
		
		const height: number = document.querySelector('header')!.offsetHeight;
		const button: HTMLElement = document.querySelector('aside .button-bar')!;
		const bubble: HTMLButtonElement = button.querySelector('#expand-button')!;

		
	};
};

class ExternalSearch {
	static redditSearchTrigger(): void { // NO NEED OF RESPONSIVENESS
		let okButtonReddit: HTMLButtonElement = document.querySelector('.pop-up.reddit-google .ok-button')!;
		okButtonReddit.onclick = redditSearch;

		function redditSearch(): void {
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
				string = string + keywords.value.replace(' ', '+');

				if (subredditStrings[0]) {
					subredditStrings.forEach((text) => {
						if (subredditStrings.indexOf(text) > 0) {
							string = string + '+OR+site%3Ahttps%3A%2F%2Freddit.com%2Fr%2F' + text.replaceAll(' ', '_');
						} else {
							string = string + '+site%3Ahttps%3A%2F%2Freddit.com%2Fr%2F' + text.replaceAll(' ', '_');
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

	static wikipediaSearchTrigger(): void { // NO NEED OF RESPONSIVENESS
		let okButtonWikipedia: HTMLButtonElement = document.querySelector('.pop-up.wikipedia .ok-button')!;
		okButtonWikipedia.onclick = wikipediaSearch;

		function wikipediaSearch(): void {
			let keywords = document.getElementById('keywords-wikipedia') as HTMLInputElement;

			let string = 'https://pt.wikipedia.org/w/index.php?search=';

			if (keywords.value) {
				string = string + keywords.value.replace(' ', '+');

				window.open(string, '_blank')?.focus();
			}
		}
	};
};

class CloudStorageData {
	static json: MyTypes.PageContent;

	static async load (): Promise<void> {
		const response = await fetch(`${server}contents/`);
		this.json = await response.json();
	}

	static async loadContentFromJson (): Promise<void> {
		const content: MyTypes.PageContent = JSON.parse(JSON.stringify(this.json));

		async function loadShortcuts(): Promise<void> {
			const targetedNode: Element = document.querySelectorAll('#shortcuts h2')[1]!
			const shortcutsNode: Element = document.querySelector('#shortcuts')!;

			for (const section of content.shortcuts.sort((a, b) => a.index - b.index)) {
				const container: HTMLElement = document.createElement('section');
				container.id = section.id;
				const p: HTMLParagraphElement = document.createElement('p');
				p.innerHTML = section.title;
				const div: HTMLDivElement = document.createElement('div');
				div.classList.add('grid-container');

				for (const child of section.children.sort((a, b) => a.index - b.index)) {
					if (mobile && !child.showOnMobile) continue;
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

				if (div.childElementCount > 0) {
					container.appendChild(p);
					container.appendChild(div);
					shortcutsNode.insertBefore(container, targetedNode);
				};
			};
		};

		async function loadGamecards (): Promise<void> {
			const targetedNode: Element = document.querySelector('#shortcuts #gaming')!

			for (const gamecardData of content.gamecards.sort((a, b) => a.position - b.position)) {
				const outerGamecard: HTMLDivElement = document.createElement('div');
				outerGamecard.id = gamecardData.id;
				outerGamecard.classList.add('gamecard-text');
				outerGamecard.innerHTML = `<span><p>${gamecardData.label}</p></span><div class="gamecard-container"></div>`;

				for (const game of gamecardData.children.sort((a, b) => a.position - b.position)) {
					let gameStyleString: string = '';
					for (const cssAtttribute of game.img_css) {
						gameStyleString += `${cssAtttribute.attribute}: ${cssAtttribute.value}; `;
					};

					outerGamecard.querySelector('.gamecard-container')!.innerHTML += `<div class="gamecard" id="${game.id}"><a href="${game.href}" style="background-image: url(${game.img}); ${gameStyleString}"><span><b>${game.label}</b></span></a></div>`
				};

				targetedNode.appendChild(outerGamecard);
			}
		}

		async function loadHeaders(): Promise<void> {
			let index: number = CustomFunctions.randomIntFromInterval(0, content.headers.length - 1);
			let src: string = content.headers[index].href;

			content.headers.forEach((imgSrc: MyTypes.Headers) => {
				let img = new Image();
				img.src = imgSrc.href;
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

				let newHeadersArr: Array<MyTypes.Headers> = content.headers.filter((headerObj: MyTypes.Headers) => {
					return headerObj.href !== src;
				})
				index = CustomFunctions.randomIntFromInterval(0, newHeadersArr.length - 1);
				src = newHeadersArr[index].href;

				header.style.backgroundImage = `url('${src}')`;
			};
		};

		(Array.from(document.body.children) as Array<HTMLElement>).concat(document.querySelector('footer')!).forEach((element) => {
			if (element.classList.contains('loader')) element.style.display = 'none';
			else element.removeAttribute('style');
		});

		loadShortcuts();
		loadGamecards();
		loadHeaders();
	};

	static shortcutButtons = {
		editBttn: '<span class="edit-shortcut-wrapper"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg"></span>',
		checkBttn: '<span class="edit-shortcut-wrapper"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/check.svg"></span>',
		deleteBttn (sourceImg: HTMLImageElement): string {return `<span class="delete-shortcut" old-data="src: ${sourceImg.src};"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/x.svg"></span>`},
		imageWrapper (sourceImg: string): string {return `<span class="shortcut-icon-wrapper"><img src="${sourceImg}" draggable="false"><input type="file" accept="image/*"></span>`},
		moveButtonsContainer60: '<div class="move-buttons-container" style="height: 60px;"><button type="button" class="move-up"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/arrow.svg" style="transform: rotate(-90deg);"></button><button type="button" class="move-down"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/arrow.svg" style="transform: rotate(90deg);"></button></div>',
		moveButtonsContainer40: '<div class="move-buttons-container" style="height: 40px;"><button type="button" class="move-up"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/arrow.svg" style="transform: rotate(-90deg);"></button><button type="button" class="move-down"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/arrow.svg" style="transform: rotate(90deg);"></button></div>',
	};

	static async createNewShortcuts (): Promise<void> {	// NEED TO BE COMPLETED
		const popUp: HTMLFormElement = document.querySelector('.pop-up.create-shortcut')!;
		const dragAndDrop: HTMLDivElement = popUp.querySelector('#drag-and-drop')!;
		const addItemButton: HTMLButtonElement = popUp.querySelector('#add-new-shortcut-button')!;
		const addItem: HTMLDivElement = popUp.querySelector('#add-drag-and-drop')!;
		const fileDrop: HTMLElement = addItem.querySelector('#drop-file')!;
		const submitNewShortcutBttn: HTMLButtonElement = popUp.querySelector('#add-new-shortcut-submit')!
		const submitUpdateBttn: HTMLButtonElement = popUp.querySelector('.ok-button')!;

		addItemButton.onclick = async function (ev) {
			if (addItemButton.classList.contains('active')) {
				addItemButton.classList.remove('active');
				addItem.style.height = '0';
				addItem.style.padding = '0';
				dragAndDrop.style.height = '60vh';
				dragAndDrop.style.padding = '10px'
				submitUpdateBttn.removeAttribute('style');
			} else {
				addItemButton.classList.add('active');
				addItem.style.height = addItem.scrollHeight + 'px';
				addItem.style.padding = '20px 0';
				dragAndDrop.style.height = '0';
				dragAndDrop.style.padding = '0 10px';
				submitUpdateBttn.style.display = 'none';
			}
		};
		
		function handleDropFile(): void {
			function activeFileDrop(): void {fileDrop.style.border = '3px solid var(--pink-custom)';};

			function inactiveFileDrop(): void {fileDrop.style.border = '3px dashed grey';};

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

					reader.onload = (ev) => { fileDrop.querySelector('img')!.src = ev.target!.result as string }

					reader.readAsDataURL(input.files[0]);
				} else {
					fileDrop.querySelector('p')!.innerHTML = 'Solte uma imagem aqui';
				};
			});
		};

		handleDropFile();

		submitNewShortcutBttn.onclick = async (ev) => {
			const formData: FormData = new FormData(popUp);
			addItem.querySelectorAll('input').forEach((input) => {
				if (input.type === 'text' && (input.value.trim() === '' || input.value.match(/[a-zA-Z]+/) === null)) {
					input.style.setProperty('--initial-color', getComputedStyle(input).backgroundColor);
					input.value = '';
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
				if (typeof value === 'string' && (value.trim() === '' || value.match(/[a-zA-Z]+/) === null)) return;
				if (value instanceof File && value.size === 0) return;
			};

			const response: Response = await fetch(`${server}shortcuts/`, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const textJson: MyTypes.UploadShortcutResponse = await response.json();
				let targetListToAddNewData: HTMLDivElement | null = null;

				dragAndDrop.querySelectorAll('h3').forEach((h3) => {
					if (h3.textContent === formData.get('folder')!.toString().trim()) {
						targetListToAddNewData = h3.parentElement as HTMLDivElement;
					}
				});
				
				const itemListStr: string = `<div id="${CustomFunctions.normalize(formData.get('title')!.toString())}-list" class="drag-and-drop-item" draggable="false" href="${formData.get('url')!.toString()}">${CloudStorageData.shortcutButtons.moveButtonsContainer40}${formData.get('title')!.toString()}<span class="shortcut-icon-wrapper"><img src="${textJson.newImgPath}" draggable="false"><input type="file" accept="image/*"></span><span class="edit-shortcut-wrapper"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg"></span></div>`

				if (targetListToAddNewData === null) {
					targetListToAddNewData = document.createElement('div');
					targetListToAddNewData.id = `${CustomFunctions.normalize(formData.get('folder')!.toString())}-list`;
					targetListToAddNewData.classList.add('drag-and-drop-list');
					targetListToAddNewData.classList.add('hidden');
					targetListToAddNewData.setAttribute('x', 'hidden');
					targetListToAddNewData.innerHTML = `<h3 class="drag-and-drop-list-header">${CloudStorageData.shortcutButtons.moveButtonsContainer60}${formData.get('folder')!.toString()}<span><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg"></span></h3><div style="--children-length: 1;">${itemListStr}</div>`;
					dragAndDrop.appendChild(targetListToAddNewData);
				} else {

				};
			} else {
				const textJson: MyTypes.ErrorJson = await response.json();
				alert(`ERRO:\n${textJson.message}`)
			}
		};
	};

	static async dragAndDropHandler (): Promise<void> {
		const popUp: HTMLFormElement = document.querySelector('.pop-up.create-shortcut')!;
		const headerImg: HTMLImageElement = popUp.querySelector('.pop-up-header img')!;
		const dragAndDrop: HTMLDivElement = popUp.querySelector('#drag-and-drop')!;

		headerImg.addEventListener('click', (ev) => {
			const containers: Array<HTMLDivElement> = Array.from(dragAndDrop.querySelectorAll('.drag-and-drop-list'));

			if (containers.some((container) => !container.classList.contains('hidden'))) {
				containers.forEach((container) => {
					container.classList.add('hidden');
					container.setAttribute('x', 'hidden');
				});
			} else {
				containers.forEach((container) => {
					container.classList.remove('hidden');
					container.setAttribute('x', 'shown');
				});
			}
		});

		dragAndDrop.addEventListener('click', async (ev) => {
			function shrinkHeader (): void {
				const header = (ev.target as HTMLElement).closest('.drag-and-drop-list-header');
				if (!header) return;
				if ((ev.target as HTMLElement).tagName === 'INPUT') return;
				if ((ev.target as HTMLElement).closest('.move-buttons-container')) return;
				if (CustomFunctions.isParent(ev.target as HTMLElement, header.querySelector('span') as HTMLSpanElement)) return;

				const container = header.parentElement!;

				const isShown = container.getAttribute('x') === 'shown';

				container.setAttribute('x', isShown ? 'hidden' : 'shown');
				container.classList.toggle('hidden', isShown);
			};

			async function moveItemUpOrDown (): Promise<void> {
				const moveButtonsContainer: HTMLDivElement | null = (ev.target as HTMLElement).closest('.move-buttons-container');
				if (!moveButtonsContainer) return;
				if (!(ev.target as HTMLElement).closest('button')) return;

				const parent = (moveButtonsContainer.closest('.drag-and-drop-item') || moveButtonsContainer.closest('.drag-and-drop-list')) as HTMLDivElement;
				const copyOfParent = parent.cloneNode(true) as HTMLElement;
				const bttn: HTMLButtonElement = (ev.target as HTMLElement).closest('button')!;
				const transitionTime: number = Number(getComputedStyle(parent).transition.match(/[\d\.]+/)![0]) * 1000;

				if (bttn.classList.contains('move-up')) {
					if (parent === parent.parentElement!.firstChild) return;
					const previousSibling = parent.previousElementSibling! as HTMLElement;
					parent.classList.add('fade-out');

					await CustomFunctions.sleep(transitionTime);

					const computedHeight: string = getComputedStyle(parent).height;
					parent.style.height = computedHeight
					await CustomFunctions.sleep(10);
					parent.style.height = '0';
					await CustomFunctions.sleep(transitionTime);
					parent.remove();

					await CustomFunctions.sleep(transitionTime);

					copyOfParent.classList.add('fade-in');
					copyOfParent.style.height = '0';
					previousSibling.before(copyOfParent);

					await CustomFunctions.sleep(10);

					copyOfParent.style.height = computedHeight;

					await CustomFunctions.sleep(transitionTime);
					copyOfParent.setAttribute('style', copyOfParent.getAttribute('style')!.replace(/height\: [\d\s\S]+\;/, ''));
					if (copyOfParent.getAttribute('style') === '') copyOfParent.removeAttribute('style');
					

					await CustomFunctions.sleep(transitionTime);

					copyOfParent.classList.remove('fade-in');
				} else if (bttn.classList.contains('move-down')) {
					if (parent === parent.parentElement!.lastChild) return;
					const nextSibling = parent.nextElementSibling! as HTMLElement;
					parent.classList.add('fade-out');

					await CustomFunctions.sleep(transitionTime);

					const computedHeight: string = getComputedStyle(parent).height;
					parent.style.height = computedHeight
					await CustomFunctions.sleep(10);
					parent.style.height = '0';
					await CustomFunctions.sleep(transitionTime);
					parent.remove();

					await CustomFunctions.sleep(transitionTime);

					copyOfParent.classList.add('fade-in');
					copyOfParent.style.height = '0';
					nextSibling.after(copyOfParent);

					await CustomFunctions.sleep(10);

					copyOfParent.style.height = computedHeight;

					await CustomFunctions.sleep(transitionTime);
					copyOfParent.setAttribute('style', copyOfParent.getAttribute('style')!.replace(/height\: [\d\s\S]+\;/, ''));
					if (copyOfParent.getAttribute('style') === '') copyOfParent.removeAttribute('style');
					

					await CustomFunctions.sleep(transitionTime);

					copyOfParent.classList.remove('fade-in');					
				}
			};

			shrinkHeader();
			moveItemUpOrDown();
		});
	};

	static async updateShortCut (): Promise<void> {
		function toggleHeaderInput(header: HTMLElement, forceText?: boolean): void {
			if (header.querySelector('input') === null) {
				header.innerHTML = forceText ? header.innerHTML : `${CloudStorageData.shortcutButtons.moveButtonsContainer60}</div><input type="text" value="${header.textContent}"><span><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/check.svg"></span>`;
			} else {
				const input = header.querySelector('input') as HTMLInputElement;
				header.parentElement!.id = `${CustomFunctions.normalize(input.value)}-list`
				input.outerHTML = input.value;
				header.innerHTML = header.innerHTML.replace('check.svg', 'edit.svg')
			};
		};

		function toggleShortcutInput(shorcut: HTMLElement, forceText?: boolean): void {
			if (shorcut.querySelector(':scope > input') === null) {
				const textWrapper: HTMLSpanElement = shorcut.querySelector('span.text-wrapper')!;
				const imgWrapper: HTMLSpanElement = shorcut.querySelector('span.shortcut-icon-wrapper')!;
				const editWrapper: HTMLSpanElement = shorcut.querySelector('span.edit-shortcut-wrapper')!;
				
				textWrapper.outerHTML = forceText ? textWrapper.outerHTML : `<input type="text" value="${textWrapper.textContent}">`;
				imgWrapper.outerHTML = forceText ? imgWrapper.outerHTML : CloudStorageData.shortcutButtons.deleteBttn(imgWrapper.querySelector('img') as HTMLImageElement);
				editWrapper.outerHTML = forceText ? editWrapper.outerHTML : CloudStorageData.shortcutButtons.checkBttn;
			} else {
				const input: HTMLInputElement = shorcut.querySelector(':scope > input') as HTMLInputElement;
				const deleteBttn: HTMLSpanElement = shorcut.querySelector('span.delete-shortcut')!;
				const checkBttn: HTMLSpanElement = shorcut.querySelector('span.edit-shortcut-wrapper')!;

				shorcut.id = `${CustomFunctions.normalize(input.value)}-list`
				input.outerHTML = `<span class="text-wrapper">${input.value}</span>`;
				deleteBttn.outerHTML = CloudStorageData.shortcutButtons.imageWrapper(deleteBttn.getAttribute('old-data')!.replace(/(src\: |\;)/g, ''));
				checkBttn.outerHTML = CloudStorageData.shortcutButtons.editBttn;
			};
		};

		function updateIcon(shorcut: HTMLElement) {};

		const popUp: HTMLFormElement = document.querySelector('.pop-up.create-shortcut')!;
		const dragAndDrop: HTMLDivElement = popUp.querySelector('#drag-and-drop')!;

		dragAndDrop.addEventListener('click', (ev) => {
			function handleToggleHeaderInput (): void {
				const header = (ev.target as HTMLElement).closest('.drag-and-drop-list-header');
				if (!header) return;
				if ((ev.target as HTMLElement).tagName === 'INPUT') return;
				if (CustomFunctions.isParent(ev.target as HTMLElement, header.querySelector('span') as HTMLSpanElement)) {
					toggleHeaderInput(header as HTMLElement);
					return;
				};
			};

			function handleToggleShortcutInput (): void {
				const shortcut = (ev.target as HTMLElement).closest('.drag-and-drop-item') as HTMLDivElement;
				if (!shortcut) return;
				else if ((ev.target as HTMLElement).tagName === 'INPUT') return;
				// else if ((ev.target as HTMLElement) === shortcut.querySelectorAll('img')[1]) updateIcon(shortcut);	I don't remember what was the purpose of this
				else if (shortcut.querySelector(':scope > input') !== null && shortcut.querySelector('input')!.value === '') return;
				else if (CustomFunctions.isParent(ev.target as HTMLElement, shortcut.querySelector('.edit-shortcut-wrapper') as HTMLSpanElement)) toggleShortcutInput(shortcut as HTMLElement);
			};

			handleToggleHeaderInput();
			handleToggleShortcutInput();
		});
	};

	static async fillDragAndDrop (): Promise<void> {
		const popUp: HTMLFormElement = document.querySelector('.pop-up.create-shortcut')!;
		const dragAndDrop: HTMLDivElement = popUp.querySelector('#drag-and-drop')!;
		const headerImg: HTMLImageElement = popUp.querySelector('.pop-up-header img')!;
		const addItem: HTMLDivElement = popUp.querySelector('#add-drag-and-drop')!;
		const fileDrop: HTMLElement = addItem.querySelector('#drop-file')!;
		const bttn: HTMLButtonElement = document.querySelector('.create-shortcut.pop-up-open')!;
		const content: MyTypes.PageContent = JSON.parse(JSON.stringify(this.json));

		bttn.addEventListener('click', (ev) => {
			fileDrop.querySelector('img')!.src = 'https://storage.googleapis.com/statisticshock_github_io_public/icons/static/image.svg';
			fileDrop.querySelector('p')!.textContent = 'Solte uma imagem aqui';
			for (const input of Array.from(addItem.querySelectorAll('input'))) {
				input.value = '';
			};
			dragAndDrop.style.display = 'grid'
			dragAndDrop.innerHTML = '';

			for (const shortcut of content.shortcuts) {
				dragAndDrop.insertAdjacentHTML('beforeend', `<div id="${shortcut.id}-list" class="drag-and-drop-list" draggable="false" x="shown"><h3 class="drag-and-drop-list-header">${CloudStorageData.shortcutButtons.moveButtonsContainer60}${shortcut.title}<span><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg"></span></h3><div style="--children-length: ${shortcut.children.length};"></div></div>`);

				const dragAndDropList: HTMLDivElement = dragAndDrop.querySelector(`#${shortcut.id}-list > div`)!;
				const dragAndDropListHeader: HTMLElement = dragAndDropList.parentElement!.querySelector('h3')!;

				for (const child of shortcut.children) {
					dragAndDropList.innerHTML += `<div id="${child.id}-list" class="drag-and-drop-item" draggable="false" href="${child.href}">${CloudStorageData.shortcutButtons.moveButtonsContainer40}<span class="text-wrapper">${child.alt}</span>${CloudStorageData.shortcutButtons.imageWrapper(child.img)}<span class="edit-shortcut-wrapper"><img src="https://storage.googleapis.com/statisticshock_github_io_public/icons/static/edit.svg"></span></div>`;
				};
			};

			headerImg.click();
		});
	};

	static async addMfcImages(): Promise<void> {
		function resizeMasonryItem(item: HTMLElement): void {
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
			let rowSpan = Math.ceil((item.offsetHeight + rowGap) / (rowHeight + rowGap));

			/* Set the spanning as calculated above (S) */
			item.style.gridRowEnd = 'span ' + rowSpan;
		}

		function resizeAllMasonryItems(): void {
			let allItems = document.querySelectorAll('.pinterest-grid-item') as NodeListOf<HTMLElement>;

			for (let i = 0; i < allItems.length; i++) {
				resizeMasonryItem(allItems[i]);
			};
		}

		const result: MyTypes.MFC[] = JSON.parse(JSON.stringify(this.json.mfc));

		let createElementPromise = new Promise((resolve, reject) => {
			resolve(result.sort((a: MyTypes.MFC, b: MyTypes.MFC) => Number(a.id) - Number(b.id)).map(createElement));
		});

		createElementPromise.then(() => {
			setTimeout(resizeAllMasonryItems, 1000);
			setTimeout(PageBuilding.resizeAside, 1000);

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

		function createElement(item: MyTypes.MFC) {
			let div = document.createElement('div');
			let img = new Image()
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
			img.src = item.icon;

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

			img.onclick = () => {
				let popUp = document.querySelector('.pop-up.mfc') as HTMLDivElement;
				let title = popUp.querySelector('.pop-up-title') as HTMLSpanElement;
				let popUpImgAnchor = popUp.querySelector('#pop-up-img') as HTMLAnchorElement;
				let popUpImg = popUpImgAnchor.childNodes[0] as HTMLImageElement;
				let originalName = popUp.querySelector('#mfc-character-original-name') as HTMLSpanElement;
				let originName = popUp.querySelector('#mfc-character-source') as HTMLSpanElement;
				let classification = popUp.querySelector('#mfc-classification') as HTMLSpanElement;
				let a = popUp.querySelector('.pop-up-header > div > a') as HTMLAnchorElement;

				let characterLink: string = '';
				let originLink: string = '';
				let classificationLink: string = '';


				if (item.characterJap) {
					characterLink = `https://buyee.jp/item/search/query/${encodeURIComponent(item.characterJap)}/category/2084023782?sort=end&order=a&store=1&lang=en`;
				} else {
					characterLink = `https://buyee.jp/item/search/query/${encodeURIComponent(item.character)}/category/2084023782?sort=end&order=a&store=1&lang=en`;
				};

				if (item.sourceJap !== 'オリジナル' && item.sourceJap !== undefined) {
					originName.parentElement!.style.display = '';
					originLink = `https://buyee.jp/item/search/query/${encodeURIComponent(item.sourceJap)}/category/2084023782?sort=end&order=a&store=1&lang=en`;
				} else {
					originName.parentElement!.style.display = 'none';
				};

				if (item.classification !== undefined) {
					classification.parentElement!.style.display = '';
					classificationLink = `https://buyee.jp/item/search/query/${encodeURIComponent(item.classification.replaceAll('#', ''))}/category/2084023782?sort=end&order=a&store=1&lang=en`;
				} else {
					classification.parentElement!.style.display = 'none';
				};

				title.innerHTML = item.title;
				popUpImgAnchor.href = item.href;
				popUpImgAnchor.style.border = `${imgBorder} solid ${div.style.color}`
				popUpImg.src = item.img;

				const copySvg: string = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200.000000 200.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none"><path d="M721 1882 c-71 -36 -76 -51 -79 -268 l-3 -194 60 0 61 0 2 178 3 177 475 0 475 0 0 -475 0 -475 -117 -3 -118 -3 0 -60 0 -61 134 4 c151 3 175 12 209 79 16 31 17 73 15 531 -3 484 -4 497 -24 525 -47 64 -39 63 -574 63 -442 0 -488 -2 -519 -18z"/><path d="M241 1282 c-19 -9 -44 -30 -55 -45 -20 -28 -21 -41 -24 -525 -3 -555 -4 -542 67 -589 l34 -23 496 0 c477 0 497 1 529 20 18 11 41 34 52 52 19 32 20 52 20 529 l0 496 -23 34 c-47 70 -36 69 -577 69 -442 0 -488 -2 -519 -18z m994 -582 l0 -475 -475 0 -475 0 -3 465 c-1 256 0 471 3 478 3 10 104 12 477 10 l473 -3 0 -475z"/></g></svg>`;

				originalName.innerHTML = item.characterJap !== '' ? `<a target="_blank" href="${characterLink}">${copySvg}&nbsp;${item.characterJap}</a>` : `<a target="_blank" href="${characterLink}">${copySvg}&nbsp;${item.character}</div></a>`;
				originName.innerHTML = `<a target="_blank" href="${originLink}">${copySvg}&nbsp;${item.sourceJap}</a>`;
				classification.innerHTML = `<a target="_blank" href="${classificationLink}">${copySvg}&nbsp;${item.classification}</a>`;

				switch (item.type) {
					case 'Owned':
						a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
					case 'Ordered':
						a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
					case 'Wished':
						a.href = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user';
					default:
						console.error(`Weird MFC item type: ${item.type}`);
				}

				//NEXT LINE MUST BE CHANGED EACH TIME A LINK IS ADDED
				const links = [originalName.querySelector('a'), originName.querySelector('a'), classification.querySelector('a')] as HTMLSpanElement[];

				links.forEach((link) => {
					link.addEventListener('click', (ev: MouseEvent | TouchEvent) => {
						const target = (ev as TouchEvent).touches ? ((ev as TouchEvent).touches[0]?.target as HTMLElement) || (ev.target as HTMLElement) : (ev.target as HTMLElement);
						const copyToClipboard = (ev: MouseEvent | TouchEvent, target: HTMLElement) => {
							ev.preventDefault();
							navigator.clipboard.writeText(target.parentElement!.textContent!.trim());
							console.log(`Copied ${target.parentElement!.textContent!}`);
						};

						if (target instanceof SVGElement) copyToClipboard(ev, target);
					})
				})

				popUp.style.display = 'block';
			}

			div.append(img);
			card.append(div);
			div.append(item.character);
		};

		function searchFigure(textInput: HTMLInputElement, json: MyTypes.MFC[]) {
			let searchStr: RegExp = new RegExp(textInput.value, 'i');

			console.info(`A string procurada é ${searchStr}`);

			const figuresToHide = json.filter((figure) => {
				let count: number = 0;

				Object.keys(figure).forEach((key: string) => {if (searchStr.test(figure[key])) count++});

				return count === 0;
			});

			const divs: NodeListOf<HTMLDivElement> = document.querySelectorAll('aside .card .pinterest-grid-item');

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

		setTimeout(() => {
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
};

class ExternalData {
	static async addRetroAchievementsAwards (): Promise<void> {
		const raUrl: string = 'https://retroachievements.org';
		const response: MyTypes.RetroAchievementsOutput = await fetch(`${server}retroAchievements/pt-BR/`).then((res) => res.json());
		const awards = response.awards;
		const consoles = response.consoles;
		const gridContainer: HTMLDivElement = document.querySelector('#retroachievements-awards > .grid-container')!;
		const popUp: HTMLDivElement = document.querySelector('.pop-up.retroachievements-awards')!;

		awards.map(createRetroAchievementsAwardCard);

		function createRetroAchievementsAwardCard (award: MyTypes.RetroAchievementsFormattedAward): void {
			gridContainer.innerHTML += `<div id="${CustomFunctions.normalize(award.title)}" class="shortcut-item retroachievements-award" alt="${award.title}" target="_blank"><img src="${award.imageIcon}" style="border: 2px solid ${award.allData.some((a) => a.awardType.includes('Platinado')) ? 'gold' : '#e5e7eb'};" draggable="false"></div>`;
		};

		gridContainer.querySelectorAll('.retroachievements-award').forEach((awardCard) => {
			const currentAwardData: MyTypes.RetroAchievementsFormattedAward = awards.filter((award) => CustomFunctions.normalize(award.title) === awardCard.id)[0];
			const currentConsoleData: MyTypes.RetroAchievementsConsole = consoles.filter((consoleId) => consoleId.id === currentAwardData.consoleId)[0];

			awardCard.addEventListener('click', (ev) => {
				popUp.style.display = 'block';

				(popUp.querySelector('#pop-up-img') as HTMLAnchorElement).href = `${raUrl}/game/${currentAwardData.awardData}`;
				(popUp.querySelector('#pop-up-img') as HTMLAnchorElement).style.border = `2px solid ${currentAwardData.allData.some((a) => a.awardType.includes('Platinado')) ? 'gold' : '#e5e7eb'}`;
				(popUp.querySelector('#pop-up-img') as HTMLAnchorElement).style.aspectRatio = '1';
				(popUp.querySelector('#pop-up-img > img') as HTMLImageElement).src = currentAwardData.imageIcon;
				(popUp.querySelectorAll('.pop-up-header > div > a')[1] as HTMLAnchorElement).href = `${raUrl}/system/${currentConsoleData.id}-${CustomFunctions.normalize(currentConsoleData.name)}/games`;
				(popUp.querySelectorAll('.pop-up-header > div > a > img')[1] as HTMLImageElement).src = consoles.filter((consoleId) => consoleId.id === currentAwardData.consoleId)[0].iconUrl;
				(popUp.querySelector('.pop-up-title') as HTMLSpanElement).innerHTML = `<p>${currentAwardData.title}</p><p><small>${currentConsoleData.name}</small></p>`;
				(popUp.querySelector('.data-container') as HTMLDivElement).innerHTML = '';

				for (const data of currentAwardData.allData) {
					(popUp.querySelector('.data-container') as HTMLDivElement).innerHTML += `<div style="border-top: 1px solid var(--contrast-color-3);"><p>Prêmio&nbsp;<span>${data.awardType}</span></p><p>Data&nbsp;<span>${Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'}).format(new Date(data.awardedAt))}</span></p></div>`;
				}
			});
		});
	};

	static async scrapeMyAnimeList(): Promise<void> {
		async function scrapeDataFromMAL(offset: number): Promise<[MyTypes.AnimeList['data'], MyTypes.MangaList['data']]> {
			const animeData: MyTypes.AnimeList = await fetch(`${server}myanimelist/animelist?username=HikariMontgomery&offset=${offset}`)
				.then(response => response.json());
			const animeDataData: MyTypes.AnimeList["data"] = animeData.data.filter((entry) => entry.node.nsfw === 'white').slice(0, 10);

			const mangaData: MyTypes.MangaList = await fetch(`${server}myanimelist/mangalist?username=HikariMontgomery&offset=${offset}`)
				.then(response => response.json());
			const mangaDataData: MyTypes.MangaList["data"] = mangaData.data.filter((entry) => entry.node.nsfw === 'white').slice(0, 10);

			return [animeDataData, mangaDataData];
		};

		const translations: Array<Array<string>> = [
			['api', 'en-US', 'pt-BR'],
			['completed', 'Completed', 'Finalizado'],
			['reading', 'Reading', 'Lendo'],
			['watching', 'Watching', 'Assistindo'],
			['plan_to_read', 'Plan to read', 'Planeja ler'],
			['plan_to_watch', 'Plan to watch', 'Planeja assistir'],
			['dropped', 'Dropped', 'Abandonado'],
			['on_hold', 'On hold', 'Em espera']
		]

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

		function createCards(entries: MyTypes.AnimeList['data'] | MyTypes.MangaList['data'], card: HTMLDivElement, insertBefore?: boolean): void {
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
				
				p3.innerHTML = `<span>Gêneros&nbsp;</span><span>${genres.join(', ')}</span>`;

				const p4: HTMLParagraphElement = document.createElement('p');
				p4.innerHTML = `<span>Status</span><span>${CustomFunctions.vlookup(entry.list_status.status, translations, translations[0].indexOf('pt-BR') + 1)}</span>`;

				div.style.display = mobile ? '' : 'none';
				img.style.opacity = mobile ? '0.25' : '1'

				span.appendChild(p2);
				span.appendChild(p3);
				span.appendChild(p4);

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

				function showEntryData(): void {
					div.style.display = '';
					img.style.opacity = '0.25';
				};

				function hideEntryData(): void {
					div.style.display = 'none';
					img.style.opacity = '1';
				};
			});
		};

		function setDefaultScroll(): void {
			const itemWidth: number = animeCard.querySelector('a')!.getBoundingClientRect().width;
			const gap = parseFloat(getComputedStyle(animeCard).gap);

			animeCard.scrollTo((itemWidth + gap) * 10, 0);
			mangaCard.scrollTo((itemWidth + gap) * 10, 0);
		};

		function makeCarouselSlide(entries: MyTypes.AnimeList['data'] | MyTypes.MangaList['data'], card: HTMLDivElement): void {
			function getClosestAnchor(container: HTMLDivElement): HTMLAnchorElement {
				const rect: DOMRect = container.getBoundingClientRect();
				const center: number = rect.left + rect.width / 2;

				const anchors: NodeListOf<HTMLAnchorElement> = container.querySelectorAll('a');
				let closestAnchor: HTMLAnchorElement | null = null;
				let closestDistance: number = Infinity;

				anchors.forEach((anchor) => {
					const anchorRect: DOMRect = anchor.getBoundingClientRect();
					const anchorCenter: number = anchorRect.left + anchorRect.width / 2;
					const distance: number = Math.abs(center - anchorCenter);

					if (distance < closestDistance) {
						closestDistance = distance;
						closestAnchor = anchor;
					}
				});

				return closestAnchor!;
			};

			const navBttns: NodeListOf<HTMLButtonElement> = card.parentElement!.querySelectorAll('.nav-button');
			navBttns.forEach((bttn) => {
				bttn.addEventListener('click', scrollFunction); function scrollFunction(e: MouseEvent | TouchEvent) {
					const target = e.target as HTMLButtonElement;
					const direction: string = target.classList.contains('left') ? 'left' : 'right';
					let anchor: HTMLAnchorElement = getClosestAnchor(card);
					const anchors: NodeListOf<HTMLAnchorElement> = card.querySelectorAll('a');

					const width: number = card.scrollWidth;
					const anchorWidth: number = parseFloat(getComputedStyle(anchor).width);
					const gap: number = parseFloat(getComputedStyle(card).gap);

					if (direction === 'left') {
						card.scrollBy({ left: - width / anchors.length, behavior: 'smooth' });

						if (anchor === anchors[5] || anchor === anchors[4]) {
							const frstChild = card.firstElementChild as HTMLAnchorElement;
							const previousOffset: number = frstChild.offsetLeft;

							createCards(entries, card, true);

							const newOffset: number = frstChild.offsetLeft;

							card.style.scrollBehavior = 'auto';
							card.scrollLeft += (newOffset - previousOffset);
							card.scrollBy({ left: - width / anchors.length, behavior: 'smooth' });
							card.style.scrollBehavior = 'smooth';

							const allAnchors: NodeListOf<HTMLAnchorElement> = card.querySelectorAll('a');
							const anchorsToRemove: Array<HTMLAnchorElement> = Array.from(allAnchors).slice(allAnchors.length - 10, allAnchors.length);
							anchorsToRemove.forEach((anchorToRemove) => {
								anchorToRemove.remove();
							});
						};
					} else if (direction === 'right') {
						card.scrollBy({ left: width / anchors.length, behavior: 'smooth' });

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

							card.style.scrollBehavior = 'auto';
							card.scrollLeft += (newOffset - previousOffset);
							card.scrollBy({ left: width / anchors.length, behavior: 'smooth' });
							card.style.scrollBehavior = 'smooth';
						};
					};
				};
			});
		};

		function selectOnlyTheCurrentImage(): void {
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
};

class PageBehaviour {
	static stopImageDrag(): void { // NO NEED OF RESPONSIVENESS
		let images: HTMLCollectionOf<HTMLImageElement> = document.getElementsByTagName('img');

		Array.from(images).forEach((img) => {
			img.setAttribute('draggable', 'false')
		});
	};

	static openLinksInNewTab(): void { // RESPONSIVE
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

	static redirectLinksToEdge(): void { // RESPONSIVE
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
};

window.addEventListener('load', onLoadFunctions, true); async function onLoadFunctions(ev: Event) {
	PageBuilding.createLoaders(10);

	await CloudStorageData.load();
	
	await Promise.all([
		CloudStorageData.loadContentFromJson(),
		CloudStorageData.createNewShortcuts(),
		CloudStorageData.dragAndDropHandler(),
		CloudStorageData.updateShortCut(),
		CloudStorageData.fillDragAndDrop(),
		CloudStorageData.addMfcImages(),
		ExternalData.scrapeMyAnimeList(),
		ExternalData.addRetroAchievementsAwards()
	]);
	
	PageBuilding.figuresSitDown();
	PageBuilding.adjustGamecard();
	PageBuilding.adjustGamecardText(0);

	UserInterface.expandAside();
	UserInterface.makeAsideButtonFollow();
	UserInterface.makeSwitchesSlide();
	UserInterface.nightModeToggle();
	UserInterface.dragPopUps();
	UserInterface.setPopUpDefaultValues();
	UserInterface.resetPopUpsOnOpen();
	UserInterface.showPopUps();
	
	ExternalSearch.redditSearchTrigger();
	ExternalSearch.wikipediaSearchTrigger();

	PageBehaviour.openLinksInNewTab();
	PageBehaviour.redirectLinksToEdge();
	PageBehaviour.stopImageDrag();
};
window.addEventListener('resize', onResizeFunctions, true); function onResizeFunctions(ev: Event) {
	setTimeout(() => {
		PageBuilding.resizeAside();
		PageBuilding.figuresSitDown();
		PageBuilding.adjustGamecardText(0);
	}, 500);
};
window.addEventListener('scroll', onScrollFunctions, true); function onScrollFunctions(ev: Event) {
	UserInterface.resizeHeader();
	UserInterface.makeButtonFromAsideFollowHeader();
};