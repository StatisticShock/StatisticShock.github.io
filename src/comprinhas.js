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
class PageBuilding extends PageBuildingImport {
    static createSkeletons() {
        const skeleton = 'skeleton';
        const container = 'skeleton-container';
        function createGearSkeletons() {
            const gearSections = document.querySelectorAll(".flex-container section");
            const sample = {
                label: '. . .',
                joker: skeleton,
                jokerContainer: container,
            };
            gearSections.forEach((gearSection) => {
                new TemplateConstructor(document.querySelector('#gear-template'), Array(6).fill(sample)).insert(gearSection, "after");
            });
        }
        ;
        createGearSkeletons();
    }
    ;
}
;
class CloudStorageData {
    static load() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${server}contents/my-beloved-headers`);
            const myBelovedData = yield fetch(`${server}my-beloved`);
            this.json = yield response.json();
            this.json["my-beloved-gear"] = (yield myBelovedData.json())["data"];
        });
    }
    ;
    static loadContentFromJson() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = JSON.parse(JSON.stringify(this.json));
            function loadHeaders() {
                return __awaiter(this, void 0, void 0, function* () {
                    const possibleHeaders = content["my-beloved-headers"].filter((header) => header.active);
                    let index = CustomFunctions.randomIntFromInterval(0, possibleHeaders.length - 1);
                    let src = possibleHeaders[index].href;
                    possibleHeaders.forEach((imgSrc) => {
                        let img = new Image();
                        img.src = imgSrc.href;
                    });
                    const header = document.querySelector('#header div');
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
            function loadGear() {
                return __awaiter(this, void 0, void 0, function* () {
                    const typesOfGears = [];
                    for (const gear of CloudStorageData.json["my-beloved-gear"]) {
                        if (typesOfGears.indexOf(gear["tipo"]) === -1) {
                            typesOfGears.push(gear["tipo"]);
                        }
                        ;
                    }
                    ;
                    console.log(typesOfGears);
                    let strOne = "";
                    let strTwo = "";
                    for (const gear of typesOfGears) {
                        strOne += `<a href="${CustomFunctions.normalize(gear)}"><b>${gear}</b></a>`;
                        strTwo += `<section id="${CustomFunctions.normalize(gear)}" ${typesOfGears.indexOf(gear) !== 0 ? `style="display: none;"` : ""}><h2>${gear.toUpperCase()}</h2><gear-container></gear-container></section>`;
                    }
                    ;
                    const defaultMenu = document.querySelector("nav.menu a");
                    const container = document.querySelector(".flex-container");
                    defaultMenu.outerHTML = strOne;
                    container.innerHTML += strTwo;
                    for (const gear of typesOfGears) {
                        const data = CloudStorageData.json["my-beloved-gear"].filter((item) => item["tipo"] === gear);
                        const section = document.querySelector(`section#${CustomFunctions.normalize(gear)} gear-container`);
                        new TemplateConstructor(document.querySelector("#gear-template"), data).insert(section, "after");
                    }
                    ;
                });
            }
            ;
            loadHeaders();
            loadGear();
        });
    }
    ;
}
;
window.addEventListener('load', onLoadFunctions, true);
function onLoadFunctions(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        PageBuilding.makeSwitchesSlide();
        PageBuilding.nightModeToggle();
        PageBuilding.dragPopUps();
        PageBuilding.collapseHeader();
        PageBuilding.refreshData();
        yield CustomFunctions.sleep(300);
        PageBuilding.createLoaders(12);
        PageBuilding.putVersionOnFooter();
        PageBuilding.formatPopUps();
        PageBuilding.createSkeletons();
        if ((window.location.hostname === 'statisticshock.github.io') ? true : toggleExternalDataLoad) {
            yield CloudStorageData.load();
            yield Promise.all([
                Promise.all([
                    CloudStorageData.loadContentFromJson(),
                ]).then((res) => {
                    PageBuilding.changeHomeView(),
                        PageBuilding.deleteSkeletons(["header ", "gear "]);
                }),
            ]);
        }
        ;
        PageBuilding.openLinksInNewTab();
        PageBuilding.stopImageDrag();
        setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
    });
}
;
