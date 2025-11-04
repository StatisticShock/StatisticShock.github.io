import CustomFunctions from '../util/functions.js';
import * as MyTypes from '../util/types.js';
import { server } from '../util/server-url.js';
import PageBuildingImport, { TemplateConstructor } from './shared.js';

const toggleExternalDataLoad: boolean = true;

const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
const mobile = /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(ua.toLowerCase());
const portrait: boolean = (window.innerWidth < window.innerHeight);

class PageBuilding extends PageBuildingImport {
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

	static async putVersionOnFooter (): Promise<void> {
		const version: MyTypes.Version = await fetch(`${server}version`).then((res) => res.json());
		const footer: HTMLElement = document.querySelector('footer')!;

		footer.innerHTML += `<p><small>ver. ${version.page}</small></p>`;
	};

	static createSkeletons (): void {
		const skeleton: string = 'skeleton';
		const container: string = 'skeleton-container';

		function createShortcutSkeletons (): void {
			const shortcuts: HTMLElement = document.querySelector('#shortcuts')!;
			const maxIcons: number = Math.floor((parseFloat(getComputedStyle(shortcuts).width)) / (Math.min(50, document.documentElement.clientWidth * 0.2) + 30));
			const atalhos: HTMLElement = Array.from(shortcuts.querySelectorAll('h2')).filter((h2) => h2.textContent!.trim() === 'Atalhos')[0];
			const ra: HTMLElement = Array.from(shortcuts.querySelectorAll('h2')).filter((h2) => h2.textContent!.trim() === 'RetroAchievements')[0];

			const row: Array<string> = Array(maxIcons).fill({joker: skeleton, alt: '. . .'});

			new TemplateConstructor((document.querySelector('#shortcuts-template') as HTMLTemplateElement).content, Array(2).fill({jokerContainer: container, joker: skeleton, children: row})).insert(shortcuts, 'after', atalhos);
			new TemplateConstructor((document.querySelector('#shortcuts-template') as HTMLTemplateElement).content, Array(1).fill({jokerContainer: container, joker: skeleton, children: row})).insert(shortcuts, 'after', ra);

			shortcuts.querySelectorAll('img').forEach((img) => img.src = './icon/blank.svg')
		};

		function createGamecardSkeletons (): void {
			const gamecard: HTMLElement = document.querySelector('#gamecards')!;
			const sample: Array<object> = [{
				label: '',
				joker: 'skeleton',
				children: Array(3).fill({
					label: '',
					joker: 'skeleton'
				}),
			}];

			new TemplateConstructor((document.querySelector('#gamecard-template') as HTMLTemplateElement).content, sample).insert(gamecard);
		};

		function createMfcSkeletons (): void {
			const cards: NodeListOf<HTMLElement> = document.querySelectorAll('aside .card .mfc-card');
			const maxColumns: number = !mobile ? 4 : 2;
			const maxRows: number = Math.ceil(cards[0].parentElement!.offsetHeight! / (parseFloat(getComputedStyle(cards[0]).width) / maxColumns + 20));
			
			cards.forEach((card) => {
				new TemplateConstructor((document.querySelector('#mfc-item-template') as HTMLTemplateElement).content, Array(maxColumns * maxRows).fill({joker: skeleton})).insert(card);
				(card.querySelectorAll('.mfc') as NodeListOf<HTMLAnchorElement>).forEach((mfc) => {
					mfc.removeAttribute('href');
					mfc.firstElementChild!.remove();
				})
			});
		};

		createShortcutSkeletons();
		createGamecardSkeletons();
		createMfcSkeletons();
	}

	static deleteSkeletons (prefixes: Array<string>): void {
		for (const prefix of prefixes) {
			const skeletons: NodeListOf<HTMLElement> = document.querySelectorAll(prefix + '.skeleton-container');

			skeletons.forEach((skeleton) => {
				skeleton.remove();
			});
		};
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
					aside.classList.add('hidden');
					localStorage.setItem(asideShownName, 'false');
				} else {
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

	static async nightModeToggle(): Promise<void> { // RESPONSIVE
		const darkOrLightTheme: string = 'darkOrLightTheme';
		const svg: HTMLInputElement = document.querySelector('switch svg#theme-toggle')!;

		if (localStorage.getItem(darkOrLightTheme) !== null) {
			switch (localStorage.getItem(darkOrLightTheme)) {
				case 'light':
					document.documentElement.setAttribute('data-theme', 'light');
					break;
				case 'dark':
					document.documentElement.setAttribute('data-theme', 'dark');
					svg.querySelector('g')!.classList.toggle('dark');
					break;
			}
		} else {
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				localStorage.setItem(darkOrLightTheme, 'dark');
				document.documentElement.setAttribute('data-theme', 'dark');
				svg.querySelector('g')!.classList.toggle('dark');
			} else {
				localStorage.setItem(darkOrLightTheme, 'light');
				document.documentElement.setAttribute('data-theme', 'light');
			};
		};

		svg.onclick = function (ev: MouseEvent|TouchEvent) {
			const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark'|'light';
			svg.querySelector('g')!.classList.toggle('dark');

			switch (currentTheme) {
				case 'light':
					document.documentElement.setAttribute('data-theme', 'dark');
					localStorage.setItem(darkOrLightTheme, 'dark')
					break;
				case 'dark':
					document.documentElement.setAttribute('data-theme', 'light');
					localStorage.setItem(darkOrLightTheme, 'light')
					break;
			};
		};
	};

	static resizeHeader(): void { // NOT RESPONSIVE YET
		const header: HTMLElement = document.querySelector('header > div')!;
		const pageHeight: number = document.documentElement.scrollHeight - window.innerHeight;
		const ratio: number = Math.min(window.scrollY / (pageHeight * 0.1), 1)
		header.style.setProperty('--scroll-ratio', ratio.toString());
	};

	static collapseHeader (): void { // NO NEED OF RESPONSIVENESS
		const navbar: HTMLElement = document.querySelector('nav.menu')!;
		const svg: HTMLElement = navbar.querySelector('svg#expand-retract-header')!;
		const header: HTMLElement = document.querySelector('header')!;

		svg.addEventListener('click', async (ev) => {
			navbar.classList.toggle('animated');
			header.classList.toggle('hidden');
		});
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

		async function loadShortcuts (): Promise<void> {
			const shortcuts: HTMLElement = document.querySelector('section#shortcuts')!;
			const h2: HTMLElement = Array.from(shortcuts.querySelectorAll('h2')).filter((heading) => heading.textContent!.trim() === 'Atalhos')[0];

			const shortcutsOnMobile = content.shortcuts.map((folder) => {
				const folderClone = structuredClone(folder);
				folderClone.children = folderClone.children.filter((child) => {
					return child.showOnMobile;
				});

				return folderClone;
			}).filter((folder) => {
				return folder.children.length > 0;
			})

			new TemplateConstructor((document.querySelector('template#shortcuts-template') as HTMLTemplateElement).content, mobile ? shortcutsOnMobile : content.shortcuts).insert(shortcuts, 'after', h2);
		};

		async function loadGamecards (): Promise<void> {
			const gamecards: HTMLElement = document.querySelector('section#gamecards')!;

			new TemplateConstructor((document.querySelector('template#gamecard-template') as HTMLTemplateElement).content, content.gamecards).insert(gamecards);

			for (const gamecard of content.gamecards) {
				const gamecardAnchor: HTMLElement = document.querySelector('#' + gamecard.id + ' a')!;
				const outerGamecard: HTMLElement = document.querySelector('div#' + gamecard.id + ' .gamecard-outercard')!;

				outerGamecard.style.setProperty('--gamecard-count', Math.max(gamecard.children.length, 2).toString());

				for (const child of gamecard.children) {
					for (const css of child.img_css) {
						gamecardAnchor.style.setProperty(css.attribute, css.value);
					};
				};
			};
		};

		async function loadHeaders(): Promise<void> {
			const possibleHeaders: Array<MyTypes.Headers> = content.headers.filter((header) => header.active);
			let index: number = CustomFunctions.randomIntFromInterval(0, possibleHeaders.length - 1);
			let src: string = possibleHeaders[index].href;

			possibleHeaders.forEach((imgSrc: MyTypes.Headers) => {
				let img = new Image();
				img.src = imgSrc.href;
			});

			const header: HTMLElement = document.querySelector('#header div')!;
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

				let newHeadersArr: Array<MyTypes.Headers> = possibleHeaders.filter((headerObj: MyTypes.Headers) => {
					return headerObj.href !== src;
				})
				index = CustomFunctions.randomIntFromInterval(0, newHeadersArr.length - 1);
				src = newHeadersArr[index].href;

				header.style.backgroundImage = `url('${src}')`;
			};
		};

		loadShortcuts();
		loadGamecards();
		loadHeaders();
	};

	static async addMfcImages(): Promise<void> {
		const input: HTMLInputElement = document.querySelector('#search-bar')!;
		input.value = '';
		
		const wished: Array<MyTypes.MFC> = CustomFunctions.shuffle(this.json.mfc.filter((figure) => figure.type === 'Wished'));
		const owned: Array<MyTypes.MFC> = CustomFunctions.shuffle(this.json.mfc.filter((figure) => figure.type !== 'Wished'));

		const wishedCard: HTMLSpanElement = document.querySelector('.flex-container aside .card #wished')!;
		const ownedCard: HTMLSpanElement = document.querySelector('.flex-container aside .card #owned-ordered')!;

		const template: DocumentFragment = (document.querySelector('#mfc-item-template') as HTMLTemplateElement).content;
		
		new TemplateConstructor(template, wished).insert(wishedCard);
		new TemplateConstructor(template, owned).insert(ownedCard);

		document.querySelectorAll('.mfc').forEach((item) => {
			try {
				item.classList.add(CustomFunctions.normalize(this.json.mfc.filter((figure) => 'mfc-' + figure.id === item.id)[0].category.replace('/', '-')));
			} catch (err) {}
		});

		const figureDict: Array<any> = [];

		this.json.mfc.forEach((figure) => {
			const newObj: object = {};

			for (const key of Object.keys(figure)) {
				if (figure[key] instanceof Array) {
					newObj[key] = figure[key].join(', ');
				} else {
					newObj[key] = figure[key];
				};
			};

			figureDict.push(newObj);
		});

		const loader: HTMLDivElement = document.querySelector('aside > .loader')!;

		function searchFigure (): void {
			const regEx = new RegExp(JSON.stringify(input.value).slice(1, -1), 'gi');
			console.info(`A expressão procurada é ${regEx}`);

			const figuresThatMatch: Array<MyTypes.MFC> = [];
			
			for (const figure of figureDict) {
				if (Object.keys(figure).some((key) => regEx.test(figure[key]))) {
					figuresThatMatch.push(figure);
				};
			};

			console.table(figuresThatMatch, ['id', 'title']);

			for (const figure of figureDict) {
				if (figuresThatMatch.some((figureThatMatch) => figure.id === figureThatMatch.id)) {
					(document.querySelector('#mfc-' + figure.id)as HTMLElement).style.display = 'block';
				} else {
					(document.querySelector('#mfc-' + figure.id)as HTMLElement).style.display = 'none';
				}
			};

			loader.style.display = 'none';
		}

		let timeout: ReturnType<typeof setTimeout>|undefined;
		input.addEventListener('keyup', (ev: KeyboardEvent) => {
			loader.style.display = 'block';
			
			if (timeout) clearTimeout(timeout);

			timeout = setTimeout(searchFigure, 900);
		});
	};
};

class ExternalData {
	static async addRetroAchievementsAwards (): Promise<void> {
		const data: MyTypes.RetroAchievementsOutput = await fetch(`${server}retroAchievements/pt-BR/`).then((res) => res.json());
		
		const shortcuts: HTMLElement = document.querySelector('#shortcuts')!;
		const h2: HTMLElement = Array.from(shortcuts.querySelectorAll('h2') as NodeListOf<HTMLElement>).filter((h2) => h2.textContent!.trim() === 'RetroAchievements')[0];

		new TemplateConstructor((document.querySelector('#ra-template') as HTMLTemplateElement).content, [data]).insert(shortcuts, 'after', h2);

		data.awards.filter((award) => award.allData.some((data) => {
			return data.awardType.includes('Platinado');
		})).forEach((award) => {
			(document.querySelector('#ra-award-' + award.awardData) as HTMLElement).classList.add('mastered');
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
					const direction: string = target.closest('button')!.classList.contains('left') ? 'left' : 'right';
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
};

window.addEventListener('load', onLoadFunctions, true); async function onLoadFunctions(ev: Event) {
	UserInterface.expandAside();
	UserInterface.makeAsideButtonFollow();
	UserInterface.makeSwitchesSlide();
	UserInterface.nightModeToggle();
	UserInterface.dragPopUps();
	UserInterface.setPopUpDefaultValues();
	UserInterface.resetPopUpsOnOpen();
	UserInterface.showPopUps();
	UserInterface.resizeHeader();
	UserInterface.collapseHeader();

	await CustomFunctions.sleep(300);

	PageBuilding.createLoaders(12);
	PageBuilding.adjustGamecard();
	PageBuilding.putVersionOnFooter();
	PageBuilding.formatPopUps();
	PageBuilding.createSkeletons();
	
	ExternalSearch.redditSearchTrigger();
	ExternalSearch.wikipediaSearchTrigger();

	if ((window.location.hostname === 'statisticshock.github.io') ? true : toggleExternalDataLoad) {
		await CloudStorageData.load();

		await Promise.all([
			Promise.all([
				CloudStorageData.loadContentFromJson(),
				CloudStorageData.addMfcImages(),
				ExternalData.scrapeMyAnimeList(),
				ExternalData.addRetroAchievementsAwards(),
			]).then((res) => {
				PageBuilding.deleteSkeletons(['#shortcuts ', 'header ']);
			}),
		]);
	};

	PageBehaviour.openLinksInNewTab();
	PageBehaviour.stopImageDrag();

	setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
};
window.addEventListener('resize', onResizeFunctions, true); function onResizeFunctions(ev: Event) {
	PageBuilding.resizeAside();
	UserInterface.resizeHeader();
};
window.addEventListener('scroll', onScrollFunctions, true); function onScrollFunctions(ev: Event) {
	UserInterface.resizeHeader();
};