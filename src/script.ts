import CustomFunctions from '../util/functions.js';
import * as MyTypes from '../util/types.js';
import { server } from '../util/server-url.js';
import PageBuildingImport, { TemplateConstructor } from './shared.js';

const toggleExternalDataLoad: boolean = true;

const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
const mobile = /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(ua.toLowerCase());

class PageBuilding extends PageBuildingImport {
	static async putVersionOnFooter (): Promise<void> {
		const version = await fetch('https://raw.githubusercontent.com/StatisticShock/StatisticShock.github.io/refs/heads/main/package.json')
			.then((res) => res.json())
			.then((data) => data.version);
		
		const footer: HTMLElement = document.querySelector('footer')!;

		footer.innerHTML += `<p><small>ver. ${version}</small></p>`;
	};

	static createSkeletons (): void {
		const skeleton: string = 'skeleton';
		const container: string = 'skeleton-container';

		function createShortcutSkeletons (): void {
			const shortcuts: HTMLElement = document.querySelector('#shortcuts block-container')!;
			const maxIcons: number = 16;

			const row: Array<string> = Array(maxIcons).fill({joker: skeleton, alt: '. . .'});

			new TemplateConstructor(document.querySelector('#shortcuts-template') as HTMLTemplateElement, Array(5).fill({jokerContainer: container, joker: skeleton, children: row})).insert(shortcuts);

			shortcuts.querySelectorAll('img').forEach((img) => img.src = './icon/blank.svg')
		};

		function createGamecardSkeletons (): void {
			const gamecard: HTMLElement = document.querySelector('#gaming gaming-container')!;
			const sample: object = {
				label: '. . .',
				joker: 'skeleton',
				jokerContainer: 'skeleton-container',
			};

			new TemplateConstructor(document.querySelector('#gamecard-template') as HTMLTemplateElement, Array(6).fill(sample)).insert(gamecard);
		};

		function createMfcSkeletons (): void {
			const mfc: HTMLElement = document.querySelector('#my-figure-collection my-figure-collection')!;
			const maxIcons: number = Math.floor(parseInt(getComputedStyle(mfc).width) / (60 + 20)) * 3;
			const sample: object = {
				joker: 'skeleton',
				jokerContainer: 'skeleton-container',
				icon: './icon/blank.svg'
			};
			
			new TemplateConstructor(document.querySelector('#mfc-template') as HTMLTemplateElement, Array(maxIcons).fill(sample)).insert(mfc);
		};

		function createMalSkeletons (): void {
			const mal: HTMLElement = document.querySelector('#my-anime-list my-anime-list')!;
			const maxIcons = 20;
			const sample: object = {
				joker: 'skeleton',
				rank: ' . . .',
				title: '. . .',
				jokerContainer: 'skeleton-container',
				"main_picture_large": './icon/blank.svg'
			}

			new TemplateConstructor(document.querySelector('#myanimelist-template') as HTMLTemplateElement, Array(maxIcons).fill(sample)).insert(mal);
		}

		createShortcutSkeletons();
		createGamecardSkeletons();
		createMfcSkeletons();
		createMalSkeletons();
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

	static changeHomeView (): void { // NO NEED OF RESPONSIVENESS
		const navBttns: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('nav a');

		navBttns.forEach((bttn) => {
			bttn.onclick = (ev: MouseEvent|TouchEvent) => {
				ev.preventDefault();
				const target = (ev as MouseEvent).target || (ev as TouchEvent).touches[0].target;
				const anchor = (target as HTMLElement).closest('a');
				
				document.querySelectorAll('.flex-container > section').forEach((section) => {
					(section as HTMLElement).style.display = section.id === anchor!.href.split('/').pop() ? '' : 'none';
				})
			}
		})
	};

	static async refreshData (): Promise<void> { // NO NEED OF RESPONSIVENESS
		const button = document.querySelector('button#refresh-button') as HTMLButtonElement;
		
		button.onclick = async (ev) => {
			await caches.delete('v1');
			window.location.reload();
		};
	};

	static handleShortcutEditToggle (): void { // NO NEED OF RESPONSIVENESS
		const toggleButton = document.querySelector('button#shortcuts-edit-mode') as HTMLButtonElement;
		const shotcuts = document.querySelector('section#shortcuts') as HTMLElement;
		const blocks = Array.from(shotcuts.querySelectorAll('block-container block')) as Array<HTMLElement>;

		toggleButton.onclick = (ev) => {
			shotcuts.classList.toggle('edit-mode');

			toggleButton.classList.toggle('trigger');
			toggleButton.classList.toggle('check');
		};

		blocks.forEach((block) => {
			block.addEventListener('mouseenter', (ev) => {
				if (document.body.classList.contains('has-hover')) {
					block.setAttribute('selected', 'true');
				};
			});

			block.addEventListener('mouseleave', (ev) => {
				if (document.body.classList.contains('has-hover')) {
					block.setAttribute('selected', 'false');
				};
			});

			block.addEventListener('click', (ev: MouseEvent|TouchEvent) => {
				const target = ((ev as MouseEvent).target || (ev as TouchEvent).touches[0].target) as HTMLElement;

				if (!target.closest('a') || shotcuts.classList.contains('edit-mode')) {
					ev.preventDefault();
				}

				if(!(ev as TouchEvent).touches) return;

				block.setAttribute('selected', (!Boolean(block.getAttribute('selected') || "false")).toString());
				blocks.forEach((el) => {
					if (el !== block) {
						el.setAttribute('selected', 'false')
					};
				});
			});
		});
	}

	static handleGamingEditToggle (): void { // NO NEED OF RESPONSIVENESS
		const toggleButton = document.querySelector('button#gaming-edit-mode') as HTMLButtonElement;

		toggleButton.onclick = (ev) => {
			toggleButton.classList.toggle('trigger');
			toggleButton.classList.toggle('check');
		};

		/* TODO */
	}
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

	static async load (): Promise<void> { // NO NEED OF RESPONSIVENESS
		const response = await fetch(`${server}contents/`);
		this.json = await response.json();
	}

	static async loadContentFromJson (): Promise<void> { // NO NEED OF RESPONSIVENESS
		const content: MyTypes.PageContent = JSON.parse(JSON.stringify(this.json));

		async function loadShortcuts (): Promise<void> {
			const shortcuts: HTMLElement = document.querySelector('section#shortcuts block-container')!;

			const shortcutsOnMobile = content.shortcuts.map((folder) => {
				const folderClone = structuredClone(folder);
				folderClone.children = folderClone.children.filter((child) => {
					return child.show_on_mobile;
				});

				return folderClone;
			}).filter((folder) => {
				return folder.children.length > 0;
			})

			new TemplateConstructor(document.querySelector('template#shortcuts-template') as HTMLTemplateElement, mobile ? shortcutsOnMobile : content.shortcuts).insert(shortcuts);
		};

		async function loadGamecards (): Promise<void> {
			const gamecards = document.querySelector('#gaming gaming-container') as HTMLElement;

			new TemplateConstructor(document.querySelector('template#gamecard-template') as HTMLTemplateElement, content.gamecards).insert(gamecards, 'after');

			// a
			for (const gamecard of content.gamecards) {
				for (const css of gamecard.img_css) {
					(document.querySelector('#' + gamecard.id + ' a') as HTMLAnchorElement).style.setProperty(css.attribute, css.value);
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

		async function loadMfc (): Promise<void> {
			const destination = document.querySelector('#my-figure-collection my-figure-collection') as HTMLElement
			new TemplateConstructor(document.querySelector('#mfc-template') as HTMLTemplateElement, content.mfc.sort((a, b) => Number(a.id) - Number(b.id))).insert(destination, 'after');

			document.querySelectorAll('mfc > img').forEach((mfcImg) => {
				mfcImg.addEventListener('click', (ev) => {
					mfcImg.parentElement!.classList.toggle('hidden');
				});
			});

			Array.from(document.querySelectorAll('mfc line > label') as NodeListOf<HTMLDivElement>).forEach((label) => {
				label.onclick = (ev: MouseEvent|TouchEvent) => {
					if (label.textContent! !== 'Tags') {
						navigator.clipboard.writeText(label.nextElementSibling!.textContent!);
					};
				};
			});

			Array.from(document.querySelectorAll('mfc line > data') as NodeListOf<HTMLDivElement>).forEach((dataField) => {
				dataField.onclick = (ev: MouseEvent|TouchEvent) => {
					dataField.parentElement!.classList.toggle('hidden');
				};
			});

			Array.from(document.querySelectorAll('mfc line > stores > a') as NodeListOf<HTMLAnchorElement>).forEach((store) => {
				const img = store.querySelector('img') as HTMLImageElement;
				const keyword = store.parentElement!.parentElement!.querySelector('data')!.textContent!;

				switch(img.alt) {
					case 'amiami icon':
						store.href = `https://www.amiami.com/eng/search/list/?s_keywords=${encodeURI(keyword)}&s_cate_tag=1&s_sortkey=preowned&s_st_condition_flg=1`
						break;
					case 'buyee icon':
						store.href = `https://buyee.jp/item/search/query/${encodeURI(keyword)}/category/25888?store=1&aucminprice=0&aucmaxprice=3000&suggest=1`
						break;
					case 'ninoma icon':
						store.href = `https://ninoma.com/search?filter.p.product_type=Figure&filter.v.availability=1&q=${encodeURI(keyword)}`
						break;
					default: break;
				}
			});

			function makeMfcSearchWork (): void { // NO NEED OF RESPONSIVENESS
				const searchBox = document.querySelector('search-box') as HTMLElement;
				const input = document.querySelector('input[name="mfc-filter"]') as HTMLInputElement;
				const figureMapKeys = ['id', 'title', 'type', 'category', 'or', 'and'];
				const figuresRegExMap = Array.from(content.mfc) as Array<MyTypes.MFC & {or: (expressions: Array<RegExp>) => boolean, and: (expressions: Array<RegExp>) => boolean}>;

				figuresRegExMap.forEach((figure) => {
					figure.or = (expressions: Array<RegExp>) => {
						if (expressions.length === 0) {
							return true;
						};

						return expressions.some((expression) => {
							return Object.keys(figure).some((key) => typeof figure[key] === 'string' && expression.test(figure[key]));
						});
					};
					
					figure.and = (expressions: Array<RegExp>) => {
						return expressions.every((expression) => {
							return Object.keys(figure).some((key) => typeof figure[key] === 'string' && expression.test(figure[key]));
						});
					};
				});

				function filterFigures (ev?: Event): void {
					const string = input.value;
					const regEx = new RegExp(string, 'ig');
					const regExes: {or: Array<RegExp>, and: Array<RegExp>} = {
						or: string.trim() === '' ? [] : [regEx],
						and: []
					};

					document.querySelectorAll('search-box search-word').forEach((searchWord) => {
						const newRegEx = new RegExp(searchWord.textContent.slice(0, -1), 'ig');
						regExes[searchWord.classList[0]].push(newRegEx);
					});

					if (regExes.or.length === 0 && regExes.and.length === 0) regExes.or.push(/:?/ig);

					figuresRegExMap.forEach((figure) => {						
						if (figure.or(regExes.or) && figure.and(regExes.and)) {
							document.getElementById(`mfc-${figure.id}`)!.style.display = 'flex';
						} else {
							document.getElementById(`mfc-${figure.id}`)!.style.display = 'none';
						};
					});
				};

				['keyup', 'paste'].forEach((eventName) => {
					input.addEventListener(eventName, filterFigures)
				});

				input.addEventListener('keypress', (ev: KeyboardEvent) => {
					if (ev.key === 'Enter') {
						if (input.value.trim().length === 0) return;

						const searchWord = document.createElement('search-word');
						searchWord.innerHTML = `${input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[&#,+()$~%.'":*?<>{}]/g,'')}<button type="button" class="close-button">&times;</button>`;
						searchWord.classList.add('or');

						searchWord.addEventListener('click', (ev: TouchEvent|MouseEvent) => {
							const target = ('touches' in ev ? ev.touches[0].target : ev.target) as HTMLElement;
							if (target.tagName === 'BUTTON') return;

							searchWord.classList.toggle('and');
							searchWord.classList.toggle('or');

							filterFigures();
						});

						searchBox.appendChild(searchWord);
						input.value = '';
					};
				});

				searchBox.addEventListener('click', (ev: TouchEvent|MouseEvent) => {
					const target = ('touches' in ev ? ev.touches[0].target : ev.target) as HTMLElement;

					if (target.tagName === 'BUTTON') {
						target.closest('search-word')?.remove();
						filterFigures();
					}
				})
			};

			makeMfcSearchWork();
		}

		loadShortcuts();
		loadGamecards();
		loadHeaders();
		loadMfc();
	};

	static async handleEdits (): Promise<void> { // NO NEED OF RESPONSIVENESS
		function shortcutsEdit (): void {
			const section = document.querySelector('section#shortcuts') as HTMLElement;
			const form = document.querySelector('form#create-shortcut') as HTMLFormElement;
			const inputFile = form.querySelector('input[type="file"]') as HTMLInputElement;

			let parendData: Omit<MyTypes.Shortcut, "children"> & {'children': number} | null = null;
			let editedShortcut: MyTypes.Shortcut["children"][0] | null = null;

			const buttons = document.querySelectorAll('button.shortcut-item') as NodeListOf<HTMLButtonElement>;

			buttons.forEach((button) => {
				button.onclick = function (ev) {
					form.style.display = 'block';

					const [parendId] = CloudStorageData.json.shortcuts.filter((folder) => folder.id === button.closest('block')!.id);

					parendData = {
						id: parendId.id,
						index: parendId.index,
						title: parendId.title,
						children: parendId.children.length
					};

					(form.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>).forEach((input) => {
						input.value = '';
					});
					(form.querySelector('input[type="checkbox"]') as HTMLInputElement).checked = true;
					(form.querySelector('input[type="file"]') as HTMLInputElement).value = '';
				};
			});

			const currentShortcuts = document.querySelectorAll('block a.shortcut-item') as NodeListOf<HTMLAnchorElement>;

			currentShortcuts.forEach((shortcut) => {
				shortcut.onclick = function (ev) {
					if (!section.classList.contains('edit-mode')) return;

					form.style.display = 'block';

					editedShortcut = CloudStorageData.json.shortcuts.filter((folder) => folder.id === shortcut.closest('block')!.id)[0].children.filter((shortcutOnJson) => shortcutOnJson.id === shortcut.id)[0];
					const [parendId] = CloudStorageData.json.shortcuts.filter((folder) => folder.id === shortcut.closest('block')!.id);

					parendData = {
						id: parendId.id,
						index: parendId.index,
						title: parendId.title,
						children: parendId.children.length
					};
					
					(form.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>).forEach((input) => {
						if (editedShortcut![input.name]) {
							input.value = editedShortcut![input.name];
						} else {
							input.value = '';
						};
					});
					(form.querySelector('input[type="checkbox"]') as HTMLInputElement).checked = editedShortcut!.show_on_mobile;
					(form.querySelector('input[type="file"]') as HTMLInputElement).value = '';
				};
			});

			const submitButton = form.querySelector('button.ok-button') as HTMLButtonElement;
			submitButton.onclick = async function (ev) {
				ev.preventDefault();

				if ((form.querySelector(`input[name="alt"]`) as HTMLInputElement).value === '') return;
				if ((form.querySelector(`input[name="href"]`) as HTMLInputElement).value === '') return;
				if ((form.querySelector(`input[name="image"]`) as HTMLInputElement).files!.length === 0) return;

				const formData = new FormData();
				formData.append('image', inputFile.files![0]);
				formData.append('path', 'icons/dynamic/');
				
				const response = await fetch(`${server}image/small`, {
					method: 'POST',
					body: formData
				});

				if (response.status === 200) {
					const json = await response.json();
					
					const postBody = {
						id: parendData!.id,
						index: parendData!.index.toString(),
						title: parendData!.title,
						children: [
							{
								alt: (document.querySelector('input[name="alt"]') as HTMLInputElement).value,
								id: CustomFunctions.normalize((document.querySelector('input[name="alt"]') as HTMLInputElement).value),
								index: parendData!.children,
								href: (document.querySelector('input[name="href"]') as HTMLInputElement).value,
								img: `https://storage.googleapis.com/statisticshock_github_io_public/icons/dynamic/${json['newFile']}`,
								floatingLabel: (document.querySelector('input[name="floatingLabel"]') as HTMLInputElement).value,
								show_on_mobile: (document.querySelector('input[name="show_on_mobile"]') as HTMLInputElement).value.toString() === 'on' ? true : false,
							}
						],
					};

					const request = await fetch(`${server}shortcuts`, {
						method: 'POST',
						headers: {
							'Content-type': 'application/json'
						},
						body: JSON.stringify(postBody),
					});

					if (request.ok) {
						alert('Atalho criado.');

						CloudStorageData.json.shortcuts.filter((folder) => folder.id === parendData!.id)[0].children.push(postBody.children[0])
					};
				}
			};
		};

		shortcutsEdit();
	};
};

class ExternalData {
	static async addRetroAchievementsAwards (): Promise<void> {
		const data: MyTypes.RetroAchievementsOutput = await fetch(`${server}retroAchievements/pt-BR/`).then((res) => res.json());
		
		const retroAchievements: HTMLElement = document.querySelector('#gaming retroachievements')!;

		new TemplateConstructor(document.querySelector('#ra-template') as HTMLTemplateElement, [data]).insert(retroAchievements);

		data.awards.filter((award) => award.allData.some((data) => {
			return data.awardType.includes('Platinado');
		})).forEach((award) => {
			(document.querySelector('#ra-award-' + award.awardData) as HTMLElement).classList.add('mastered');
		});
	};

	static MALData: Array<MyTypes.MALEntry>;

	static async scrapeMyAnimeList(): Promise<void> {
		async function scrapeDataFromMAL(options: {offset: number, limit: number}): Promise<Array<MyTypes.MALEntry>> {
			const animeData: Array<MyTypes.MALEntry> = (await fetch(`${server}myanimelist/animelist?username=HikariMontgomery&offset=${options.offset}&limit=${options.limit}`)
				.then(response => response.json()))['myanimelist'];

			const mangaData: Array<MyTypes.MALEntry> = (await fetch(`${server}myanimelist/mangalist?username=HikariMontgomery&offset=${options.offset}&limit=${options.limit}`)
				.then(response => response.json()))['myanimelist'];
			
			const response: Array<MyTypes.MALEntry> = [];
			animeData.forEach((anime) => response.push(anime));
			mangaData.forEach((manga) => response.push(manga));

			return response
		};

		scrapeDataFromMAL({offset: 0, limit: 40}).then((res) => {
			this.MALData = res;

			const malContainer = document.querySelector('#my-anime-list my-anime-list') as HTMLDivElement;
			new TemplateConstructor(document.querySelector('#myanimelist-template') as HTMLTemplateElement, res.sort((a, b) => - new Date(a.updated_at).getTime() + new Date(b.updated_at).getTime()).slice(0, 40)).insert(malContainer);
		});
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
	UserInterface.makeSwitchesSlide();
	UserInterface.nightModeToggle();
	UserInterface.dragPopUps();
	UserInterface.setPopUpDefaultValues();
	UserInterface.resetPopUpsOnOpen();
	UserInterface.collapseHeader();
	UserInterface.changeHomeView();
	UserInterface.refreshData();

	await CustomFunctions.sleep(300);

	PageBuilding.createLoaders(12);
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
				CloudStorageData.handleEdits(),
				ExternalData.scrapeMyAnimeList(),
				ExternalData.addRetroAchievementsAwards(),
			]).then((res) => {
				PageBuilding.deleteSkeletons(['#shortcuts ', 'header ', '#my-anime-list my-anime-list', 'gaming-container ', '#my-figure-collection ']);
			}),
		]);
	};

	UserInterface.handleShortcutEditToggle();
	UserInterface.handleGamingEditToggle();

	PageBehaviour.openLinksInNewTab();
	PageBehaviour.stopImageDrag();
	setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
};
window.addEventListener('resize', onResizeFunctions, true); function onResizeFunctions(ev: Event) {
	//
};
window.addEventListener('scroll', onScrollFunctions, true); function onScrollFunctions(ev: Event) {
	//
};