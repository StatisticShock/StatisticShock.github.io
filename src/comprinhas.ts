import CustomFunctions from '../util/functions.js';
import * as MyTypes from '../util/types.js';
import { server } from '../util/server-url.js';
import PageBuildingImport, { TemplateConstructor } from './shared.js';

const toggleExternalDataLoad: boolean = true;

class PageBuilding extends PageBuildingImport {
	static createSkeletons (): void {
		const skeleton: string = 'skeleton';
		const container: string = 'skeleton-container';

		function createGearSkeletons (): void {
			const gearSections: NodeListOf<HTMLElement> = document.querySelectorAll(".flex-container section")!;
			const sample: object = {
				label: '. . .',
				joker: skeleton,
				jokerContainer: container,
			};

			gearSections.forEach((gearSection) => {
				new TemplateConstructor(document.querySelector('#gear-template') as HTMLTemplateElement, Array(6).fill(sample)).insert(gearSection, "after");
			});
		};

		createGearSkeletons();
	};
};

class CloudStorageData {
	static json: any;

	static async load (): Promise<void> { // NO NEED OF RESPONSIVENESS
		const response = await fetch(`${server}contents/my-beloved-headers`);
		const myBelovedData = await fetch(`${server}my-beloved`);

		this.json = await response.json();
		this.json["my-beloved-gear"] = (await myBelovedData.json())["data"];
	};

	static async loadContentFromJson (): Promise<void> { // NO NEED OF RESPONSIVENESS
		const content: MyTypes.PageContent = JSON.parse(JSON.stringify(this.json));

		async function loadHeaders (): Promise<void> {
			const possibleHeaders: Array<MyTypes.Headers> = content["my-beloved-headers"].filter((header) => header.active);
			let index: number = CustomFunctions.randomIntFromInterval(0, possibleHeaders.length - 1);
			let src: string = possibleHeaders[index].href;

			possibleHeaders.forEach((imgSrc: MyTypes.Headers) => {
				let img = new Image();
				img.src = imgSrc.href;
			});

			const header: HTMLElement = document.querySelector('#header div')!;
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

		async function loadGear () {
			const typesOfGears: Array<string> = [];

			for (const gear of CloudStorageData.json["my-beloved-gear"]) {
				if (typesOfGears.indexOf(gear["tipo"] as string) === -1) {
					typesOfGears.push(gear["tipo"]);
				};
			};

			let strOne = "";
			let strTwo = "";
			for (const gear of typesOfGears) {
				strOne += `<a href="${CustomFunctions.normalize(gear)}"><b>${gear}</b></a>`;
				strTwo += `<section id="${CustomFunctions.normalize(gear)}" ${typesOfGears.indexOf(gear) !== 0 ? `style="display: none;"` : ""}><h2>${gear.toUpperCase()}</h2><gear-container></gear-container></section>`;
			};

			const defaultMenu = document.querySelector("nav.menu a");
			const container = document.querySelector(".flex-container");
			defaultMenu!.outerHTML = strOne;
			container!.innerHTML += strTwo;

			for (const gear of typesOfGears) {
				const data = CloudStorageData.json["my-beloved-gear"].filter((item) => item["tipo"] === gear);
				const section = document.querySelector(`section#${CustomFunctions.normalize(gear)} gear-container`) as HTMLElement;
				new TemplateConstructor((document.querySelector("#gear-template") as HTMLTemplateElement), data).insert(section, "after");
			};

			document.querySelectorAll("gear-container gear").forEach((gearElement) => {
				const expand = gearElement.querySelector("animate.expand") as SVGAnimationElement;
				const collapse = gearElement.querySelector("animate.collapse") as SVGAnimationElement;
	
				gearElement.addEventListener("mouseenter", () => {expand.beginElement()});
				gearElement.addEventListener("mouseleave", () => {collapse.beginElement()});
			});
		};

		loadHeaders();
		loadGear();
	};
};

window.addEventListener("load", onLoadFunctions, true); async function onLoadFunctions (ev: Event) {
	PageBuilding.makeSwitchesSlide();
	PageBuilding.nightModeToggle();
	PageBuilding.dragPopUps();
	PageBuilding.collapseHeader();
	PageBuilding.refreshData();

	await CustomFunctions.sleep(300);

	PageBuilding.createLoaders(12);
	PageBuilding.putVersionOnFooter();
	PageBuilding.formatPopUps();
	PageBuilding.createSkeletons();

	if ((window.location.hostname === 'statisticshock.github.io') ? true : toggleExternalDataLoad) {
		await CloudStorageData.load();

		await Promise.all([
			Promise.all([
				CloudStorageData.loadContentFromJson(),
			]).then((res) => {
				PageBuilding.changeHomeView(),
				PageBuilding.deleteSkeletons(["header ", "gear "])
			}),
		]);
	};

	PageBuilding.openLinksInNewTab();
	PageBuilding.stopImageDrag();
	setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
};
window.addEventListener("resize", onResizeFunctions, true); async function onResizeFunctions (ev: Event) {
	//
};