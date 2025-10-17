import PageBuilding from './shared.js';
import CustomFunctions from '../util/functions.js';
import * as MyTypes from '../util/types.js';
import { server } from './server-url.js';

class HistoryState {
	static routes = [
		{	
			type: 'shortcuts',
			title: 'Atualização de atalho',
		},
		{
			type: 'gamecards',
			title: 'Atualização de atalho gaming',
		},
		{
			type: 'mfc',
			title: 'Atualização de figure'
		},
		{
			type: 'headers',
			title: 'Atualização de headers'
		}
	];

	static data = {
		page: '',
		id: '',
	}
	
	static path (): void {
		const params: URLSearchParams = new URLSearchParams(window.location.search);
		const page: string = params.get('page')!;
		const id: string = params.get('id')!;

		this.data.id = id;
		this.data.page = page;
	};

	static updateContent({page, id}): void {
		history.replaceState('', '', `update/${page}/${Number(id) > 0 ? id : ''}`)

		const route = this.routes.filter((route) => route.type === page)[0] || { title: '404', type: 'Not Found'};
		if (route.title === '404') {
			window.location.href = window.location.origin + '/404.html';
		} else {
			document.getElementById('title')!.textContent = route.title;
		}
	};

	static async load ({page, id}): Promise<void> {
		// x
		const content: HTMLDivElement = document.querySelector('#content')!;
		const json: Partial<MyTypes.PageContent> = await fetch(`${server}contents/${page}`).then((res) => res.json());

		const upload = document.importNode((document.getElementById('upload-template') as HTMLTemplateElement).content, true);

		switch (page) {
			case 'shortcuts':
				const shortcutFolders: Array<MyTypes.Shortcut> = json[page]
				
				for (const folder of shortcutFolders) {
					const div: HTMLDivElement = document.createElement('div');
					div.id = folder.id;
					div.classList.add('folder');
					
					const div2: HTMLDivElement = document.createElement('div');
					div2.classList.add('folder-wrapper');
					const header: HTMLElement = document.createElement('h2');
					header.innerHTML = folder.title;

					div2.appendChild(header);
					
					const div3: HTMLDivElement = document.createElement('div');
					div3.classList.add('shortcuts-wrapper')
					
					for (const shortcut of folder.children) {
						const shortcutDiv: HTMLDivElement = document.createElement('div');
						shortcutDiv.id = shortcut.id;
						shortcutDiv.classList.add('shortcut')
						shortcutDiv.innerHTML = `<span class="shortcut-img-container">` +
								`<img src="${shortcut.img}">` +
							`</span>` +
							`<div class="text-container">` +
								`<span class="shortcut-name-container">` +
									`<span>${shortcut.alt}</span>` +
								`</span>` +
								`<span class="shortcut-link-container">` +
									`<span>${shortcut.href}</span>` +
								`</span>` +
								`<span class="shortcut-parent-container">` +
									`<span>${folder.title}</span>` +
								`</span>` +
							`</div>` +
							`<span class="shortcut-mobile-container">` +
								`<input type="checkbox" checked="${shortcut.showOnMobile}">` +
							`</span>`;

						div3.appendChild(shortcutDiv);
					};
					div.appendChild(div2);
					div.appendChild(div3);
					content.appendChild(div);
				};

				break;
			case 'gamecards':
				const gamecards: Array<MyTypes.Gamecard> = json[page];

				break;
			case 'mfc':
				const item: MyTypes.MFC = json[page].filter((item) => item.id === id)[0];
				const keys: Array<{title: string, locked: boolean}> = [
					{title: 'title', locked: false},
					{title: 'character', locked: false},
					{title: 'characterJap', locked: false},
					{title: 'source', locked: false},
					{title: 'sourceJap', locked: false},
					{title: 'classification', locked: false},
					{title: 'category', locked: false},
				];

				const div1: HTMLDivElement = document.createElement('div');
				const div2: HTMLDivElement = document.createElement('div');
				const div3: HTMLDivElement = document.createElement('div');

				div1.classList.add('mfc');
				div2.classList.add('img-wrapper');
				div3.classList.add('data-wrapper');
				
				let imgBorderColor: string;

				switch (item.category) {
					case 'Prepainted':
						imgBorderColor = 'green';
						break;
					case 'Action/Dolls':
						imgBorderColor = '#0080ff';
						break;
					default:
						imgBorderColor = 'orange';
						break
				}
				div2.innerHTML = `<img class="icon-image" style="border: 4px solid ${imgBorderColor};" src="${item.icon}"><img class="main-image" style="border: 4px solid ${imgBorderColor};" src="${item.img}">`

				for (const key of keys) {
					div3.innerHTML += `<div class="data-${key.title}"><p>${key.title}</p><p>${item[key.title] ?? '<span class="null">empty</span>'}</p></div>`;
				};

				div1.appendChild(div2);
				div1.appendChild(div3);

				div3.innerHTML += `<button id="update-trigger">Atualizar</button>`
				content.appendChild(div1);

				break;
			case 'headers':
				const headers: Array<MyTypes.Headers> = json[page];
				const headerContainer: HTMLDivElement = document.createElement('div');
				headerContainer.classList.add('headers')

				for (const header of headers) {
					const tpt = document.getElementById('header-template') as HTMLTemplateElement;
					const div = tpt.content.querySelector('div') as HTMLDivElement;
					const img = div.querySelector('img') as HTMLImageElement;
					const box = div.querySelector('input') as HTMLInputElement;
					const prg = div.querySelector('p') as HTMLParagraphElement;
					
					img.src = header.href;
					box.checked = header.active;
					prg.textContent = header.name;

					const node = document.importNode(tpt.content, true);
					headerContainer.appendChild(node);
				};

				content.appendChild(headerContainer);

				(content.querySelectorAll('div.headers img') as NodeListOf<HTMLImageElement>).forEach((img: HTMLImageElement) => {
					img.onclick = function (ev) {
						img.parentElement!.classList.toggle('hidden');
					}
				});

				headerContainer.appendChild(upload);

				break;
			default:
				content.innerHTML = 'Page Not Found';
		}
	};
};

window.addEventListener('load', onLoadFunctions); async function onLoadFunctions (): Promise<void> {
	PageBuilding.createLoaders(12);
	
	HistoryState.path();
	HistoryState.updateContent(HistoryState.data);
	await HistoryState.load(HistoryState.data);
};