// Import custom functions from "./functions.Js"
import CustomFunctions from "./functions.js";

// To make loaders work
function createLoaders (count: number): void {
    let loaders: NodeListOf<HTMLDivElement> = document.querySelectorAll('.loader');

    loaders.forEach(loader => {
        for (let i: number = 1; i <= count; i++) { //Create for loop to add the correct number of orbs
            let orb: HTMLDivElement = document.createElement('div');
            orb.setAttribute('class', 'orb');
            orb.setAttribute('style', `--index: ${i}; --count: ${count};`);
            loader.appendChild(orb);
        }
    });
}

// Stop image dragging
function stopImageDrag ():void {
    let images: HTMLCollectionOf<HTMLImageElement> = document.getElementsByTagName('img');

    Array.from(images).forEach((img) => {
        img.setAttribute('draggable', 'false')
    });
}

// Open in new tab
function openLinksInNewTab (): void {
    let shortcuts: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.shortcut-item');
    shortcuts.forEach((element) => {
        if (element.href.match(/docs\.google\.com/) == null) {
            element.target = '_blank';
        }
    });

    let gamecards: NodeListOf<HTMLDivElement> = document.querySelectorAll('.gamecard')!;
    gamecards.forEach(element => {
        var child = element.firstElementChild as HTMLAnchorElement;
        
        if (child.href.match(/docs\.google\.com/) == null) {
            child.target = '_blank';
        }
    });
}

//To make sheets open in edge
function redirectToEdge (): void {
    let links = document.querySelectorAll('a');
    links.forEach(link => {
        var hyperlink = link.href

        if (hyperlink.match(/docs\.google\.com/)) {
            link.href = 'microsoft-edge:' + hyperlink
            link.target = ''
        }
    });
}

//To make aside the same height of Shortcut-Item
function resizeAside (counter?: number): void {
   let aside = document.querySelector('aside')!;
   let card = document.querySelector('.card')               as HTMLDivElement;
   let pinterest = document.querySelector('#owned-ordered') as HTMLDivElement;
   let shortcuts = document.querySelector('#shortcuts')     as HTMLElement;

   aside.style.height = 'fit-content';
   card.style.height = 'fit-content';
   shortcuts.style.height = 'fit-content';

   let maxHeight = Math.max(pinterest.offsetHeight, shortcuts.offsetHeight);

   aside.style.height = maxHeight + 'px';
   card.style.height = maxHeight + 'px';
   shortcuts.style.height = maxHeight + 'px';

   if (counter == 0) {
      setTimeout(() => {
        resizeAside(1);
      },750)
   } 
}

// To make the gamecard occupy 50% of the screen on hover
function adjustGamecard(): void {
    let gameCardContainers: NodeListOf<HTMLElement> = document.querySelectorAll('.gamecard-container');
    gameCardContainers.forEach(gamecard_container => {
        var childCount: string = Math.max(gamecard_container.children.length, 2).toString();

        gamecard_container.style.setProperty('--gamecard-count', childCount);
    });

    let gameCardText: NodeListOf<HTMLElement> = document.querySelectorAll('.gamecard-text > span p');
    gameCardText.forEach((element) => {
        element.style.marginLeft = - (element.offsetWidth / 2 - 20) + 'px';
    });
}

function rotateGamecardText (counter: number): void {
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
}
// To make the header have different backgrounds
function setHeaderBackground (): void {
    let filePath: string = 'images/headers/'

    fetch(`${filePath}headers.json`)
        .then((res) => res.json())
        .then((json) => {
            let index: number = CustomFunctions.randomIntFromInterval(1, json.length);
            let src: string = filePath + json[index-1];

            json.forEach((imgSrc: string) => {
                let img = new Image();
                img.src = filePath + imgSrc;
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

                let arr: Array<string> = json.filter((headerImg: string) => {
                    return headerImg != src.split('/')[2];
                })
                let indexArr: number = CustomFunctions.randomIntFromInterval(1, arr.length);
                src = filePath + arr[indexArr-1];

                header.style.backgroundImage = `url('${src}')`;
            }
        });
}

// To make 2B and Ai sit on the navbar (and makke the MFC toggle sit under 2B)
function figuresSitDown (): void {
    let twoB: HTMLElement = document.getElementById('twoB')!;
    let twoB_Ass = Math.floor(parseFloat(getComputedStyle(twoB).height) * 493 / 920);
    let twoB_Pussy = Math.floor(parseFloat(getComputedStyle(twoB).width) * 182 / 356);
    let aside: HTMLElement = document.querySelector('aside')!;

    twoB.style.top = (- twoB_Ass) + 'px';
    twoB.style.right = (aside.offsetWidth / 2 - twoB_Pussy) + 'px';

    let ohto: HTMLElement = document.getElementById('ohto')!;
    let ohto_panties = getComputedStyle(ohto).height;
    let ohto_mouth = Math.floor(parseFloat(getComputedStyle(ohto).width) / 2);
    
    ohto.style.top = '-' + ohto_panties;
    ohto.style.left = getComputedStyle(twoB).right;

    let toggleSwitch: HTMLElement = document.getElementById('mfc-switch')!;
    
    toggleSwitch.style.width = twoB.style.width;
    toggleSwitch.style.right = parseFloat(twoB.style.right) + twoB.offsetWidth / 2 + 'px';
    toggleSwitch.style.transform = 'translate(50%, 0)'
}

//To make all switches work
function makeSwitchesSlide (): void {
    let sliders: NodeListOf<HTMLElement> = document.querySelectorAll('.switch > .slider'); 
    sliders.forEach((slider) => {
        let parent = slider.parentElement as HTMLElement;
        let input = parent.querySelector('input') as HTMLInputElement;

        let uncheckedPosition = getComputedStyle(slider, '::before').left;
        let checkedPosition   = parent.offsetWidth - parseFloat(uncheckedPosition) * 3 - parseFloat(getComputedStyle(slider, ':before').width) + 'px';

        slider.style.setProperty('--total-transition', checkedPosition);
        input.style.setProperty('--total-transition', checkedPosition);
    })
}

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
}

//To make the popups appear on click
function formatPopUps (): void {
    type popUpInterface = {button: HTMLAnchorElement, popUpContainer: HTMLFormElement}
    const popUpShortcuts: Array<popUpInterface> = [];

    (document.querySelectorAll('form.pop-up') as NodeListOf<HTMLFormElement>).forEach((form) => {
        if (form.classList.length < 2) return;

        let otherClass: string = Array.from(form.classList).filter((className) => {
            return className !== 'pop-up';
        })[0];

        let openButton = Array.from(document.querySelectorAll(`.${otherClass}`)).find((el) => el.classList.contains('shortcut-item')) as HTMLAnchorElement;

        if (openButton) {
            popUpShortcuts.push({button: openButton, popUpContainer: form});
        };
    });

    popUpShortcuts.forEach((object) => {
        let popUpClass           = document.querySelectorAll('.pop-up')                      as NodeListOf<HTMLElement>;
        let floatingLabelElement = object.popUpContainer.querySelectorAll('.floating-label') as NodeListOf<HTMLElement>;

        object.button.onclick = () => {
            let display: string = object.popUpContainer.style.display;
            
            if ((display == '') || (display == 'none')) {
                object.popUpContainer.style.display = 'block';   //Makes the popUp appear
            } else {
                object.popUpContainer.style.display = 'none';    //Makes the popUp disappear
            };

            popUpClass.forEach((element) => {   //Makes every other popUp disappear once the shorcut button is clicked
                if (element != object.popUpContainer) {
                    element.style.display = 'none'
                };
            });

            floatingLabelElement.forEach((label) => {
                let parent = label.parentElement as HTMLElement;
                var siblings = Array.from(parent.children) as Array<HTMLElement>;
                var input = siblings[siblings.indexOf(label) - 1] as HTMLInputElement; //Gets the imediate predecessor sibling
                var rect = object.popUpContainer.getBoundingClientRect();
                var inputRect = input.getBoundingClientRect();
    
                var left = inputRect.left - rect.left;
                label.style.left = left +'px';

                input.setAttribute('placeholder', ' ')
            })
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
}

// To make the reddit search work
function redditSearchTrigger (): void {
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
}

//To make the wikipedia search work
function wikipediaSearchTrigger (): void {
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
}

// To make MFC pop-up adjust
function mfcPopUpAdjust (): void {
    let mfc: HTMLDivElement = document.querySelector('.pop-up.mfc')!;

    // To make it have the proper aspect ratio
    let a

    let fontSize: number = parseFloat(getComputedStyle(mfc).fontSize);

    // alert(fontSize);
}

// To make the inputbox draggable
function dragPopUps (): void {
    let popUps: NodeListOf<HTMLElement> = document.querySelectorAll('.pop-up')
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

        if ((target === this || CustomFunctions.isParent(target, this)) &&
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
}

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
}

// To add MFC images in the aside and do 
async function addImages (): Promise<void> {
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

    let result = CustomFunctions.shuffle(await (await fetch('https://statisticshock-github-io.onrender.com/figurecollection/')).json());
    console.log(result)

    let createElementPromise = new Promise ((resolve, reject) => { //This creates a promise that will create every item in the aside
        resolve(result.map(createElement));
    });

    createElementPromise.then(() => {
        resizeAllMasonryItems();
        setTimeout(resizeAside, 500);
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
                characterLink = `https://buyee.jp/item/search/query/${item.characterJap}/category/2084023782?sort=end&order=a&store=1`;
            } else {
                characterLink = `https://buyee.jp/item/search/query/${item.character}/category/2084023782?sort=end&order=a&store=1`;
            };
            if (item.origin !== 'オリジナル' && item.origin !== undefined) {
                originName.parentElement!.style.display = '';
                originLink = `https://buyee.jp/item/search/query/${item.origin}/category/2084023782?sort=end&order=a&store=1`;
            } else {
                originName.parentElement!.style.display = 'none';
            };
            if (item.classification !== undefined) {
                classification.parentElement!.style.display = '';
                classificationLink = `https://buyee.jp/item/search/query/${item.classification.replaceAll('#','')}/category/2084023782?sort=end&order=a&store=1`;
            } else {
                classification.parentElement!.style.display = 'none';
            };

            title.innerHTML             = item.title;
            popUpImgAnchor.href         = item.href;
            popUpImg.src                = img.src;
            popUpImg.style.border       = `${imgBorder} solid ${div.style.color}`            
            originalName.innerHTML      = item.characterJap !== '' ? `<a target="_blank" href="${characterLink}">${item.characterJap}</a>` : `<a target="_blank" href="${characterLink}">${item.character}</a>`;
            originName.innerHTML        = `<a target="_blank" href="${originLink}">${item.origin}</a>`;
            classification.innerHTML    = `<a target="_blank" href="${classificationLink}">${item.classification}</a>`;

            if (item.type == 'Owned') {
                a.href                      = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user'
            } else if (item.type == 'Ordered') {
                a.href                      = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user'
            } else if (item.type == 'Wished') {
                a.href                      = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=0&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user'
            }

            if (navigator.userAgent.includes('Android') || navigator.userAgent.includes('like Mac OS')) {
                console.log('Running on mobile');
                //NEXT LINE MUST BE CHANGED EACH TIME A LINK IS ADDED 
                const links: HTMLAnchorElement[] = [originalName, originName, classification] as HTMLAnchorElement[];
            
                const updateLinks = async () => {
                    for (const itemLink of links) {
                        let anchorChild: HTMLAnchorElement = itemLink.firstElementChild! as HTMLAnchorElement;
                        anchorChild.href = '';
                        anchorChild.target = '';
                        anchorChild.onclick = (event) => {
                            event.preventDefault();
                            void navigator.clipboard.writeText(itemLink.textContent!);
                        };
                    };
                };
            
                updateLinks();
            }
            
            popUp.style.display = 'block';
        }

        div.append(img);
        card.append(div);
        div.append(item.character);
    }

    window.addEventListener('resize', () => {
        setTimeout(() => {
            resizeAllMasonryItems;
            resizeAside;
        },500);
    });
    setTimeout(() => { //Should run immeditialy after "resizeAllMasonryItems"
        let loader: HTMLDivElement = document.querySelector('aside > .card > .loader')!;
        let pinterestGrids: NodeListOf<HTMLSpanElement> = document.querySelectorAll('aside > .card > .pinterest-grid');
        
        loader.style.display = 'none';
        pinterestGrids.forEach((grid) => {
            grid.style.opacity = '1'
        });
    }, 1000);
};

// To add a MyAnimeList card
async function scrapeMyAnimeList (): Promise<void> {
    type malJson = {
        data: [{
            node: {
                id: number,
                main_picture: {
                    medium: string,
                    large: string
                },
                title: string
            },
            list_status: {
                is_rewatching: boolean,
                num_episodes_watched: number,
                score: number,
                status: string,
                updated_at: string,
            }
        }],
        paging: {
            next: string
        }
    };

    async function scrapeDataFromMAL (offset: number): Promise<malJson> {
        const data: malJson = await fetch(`https://statisticshock-github-io.onrender.com/animelist/HikariMontgomery/${offset}`)
        .then(response => response.json());

        return data;
    };

    let output: malJson = await scrapeDataFromMAL(0);
    const mal: HTMLDivElement = document.querySelector('#my-anime-list .inner-card')!;

    output.data.forEach((anime) => {
        let img: HTMLImageElement = new Image();
        img.src = anime.node.main_picture.large;
        let a: HTMLAnchorElement = document.createElement('a');
        a.appendChild(img);
        a.target = '_blank';
        a.href = `https://myanimelist.net/anime/${anime.node.id}/`
        let div: HTMLDivElement = document.createElement('div');
        div.classList.add('paragraph-container');
        let p: HTMLParagraphElement = document.createElement('p');
        p.innerHTML = `${anime.node.title}&nbsp;`;
        div.style.display = 'none';

        if (anime.list_status.score !== 0) {
            let p2: HTMLParagraphElement = document.createElement('p');
            p2.innerHTML = `${'⭐'.repeat(anime.list_status.score)} (${anime.list_status.score}/10)`;
            p.appendChild(p2);
        }
        
        div.appendChild(p);
        a.appendChild(div);
        
        mal.appendChild(a);

        a.addEventListener('mouseenter', showAnimeData, true);
        a.addEventListener('touchstart', showAnimeData, true);
        a.addEventListener('mouseleave', hideAnimeData, true);
        a.addEventListener('touchend', hideAnimeData, true);

        function showAnimeData (): void {
            div.style.display = '';
        };

        function hideAnimeData (): void {
            div.style.display = 'none';
        };
    });

    (function makeCarouselSlide (): void {
        let card: HTMLDivElement = document.querySelector('#my-anime-list .card')!;
        let innerCard: HTMLDivElement = card.querySelector('.inner-card')!;
        let leftButton: HTMLButtonElement = card.querySelector('#left')!;
        let rightButton: HTMLButtonElement = card.querySelector('#right')!;

        innerCard.addEventListener('load', scrollFunctions, true); function scrollFunctions (): void {
            leftButton.onclick = () => {
                let width: number  = innerCard.scrollWidth;
                innerCard.scrollBy({left: - width / 10, behavior: "smooth"});
            };

            rightButton.onclick = () => {
                let width: number  = innerCard.scrollWidth;
                innerCard.scrollBy({left: width / 10, behavior: "smooth"});
            }
        };
    })()

    setTimeout(() => { //Should run immeditialy after output.data.forEach
        let loader: HTMLDivElement = document.querySelector('#my-anime-list .loader')!;
        let innerCard: HTMLDivElement = document.querySelector('#my-anime-list .inner-card')!;
        
        loader.style.display = 'none';
        innerCard.style.opacity = '1';

    }, 1000);
}
window.addEventListener('load', onLoadFunctions, true); async function onLoadFunctions () {
    createLoaders(8);
    openLinksInNewTab();
    redirectToEdge();
    setHeaderBackground();
    figuresSitDown();
    resizeAside(0)
    setDefaults();
    adjustGamecard();
    rotateGamecardText(0);
    await addImages();
    mfcToggleSwitch();
    makeSwitchesSlide();
    formatPopUps();
    mfcPopUpAdjust();
    dragPopUps();
    stopImageDrag();
    redditSearchTrigger();
    wikipediaSearchTrigger();
    await scrapeMyAnimeList();
};
window.addEventListener('resize', onResizeFunctions, true); function onResizeFunctions () {
    setTimeout( () => {
        resizeAside();
        figuresSitDown();
        rotateGamecardText(0);
        mfcPopUpAdjust ();
    }, 500);
};
window.addEventListener('mousemove', onMouseMoveFunctions, true); function onMouseMoveFunctions (event: Event) {
    // console.log(event.target);
};
