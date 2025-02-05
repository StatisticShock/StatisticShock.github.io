// Import custom functions from "./functions.Js"
import CustomFunctions from "./functions.js";

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
   let card = document.querySelector('.card')             as HTMLDivElement;
   let pinterest = document.querySelector('#owned')       as HTMLDivElement;
   let shortcuts = document.querySelector('#shortcuts')   as HTMLElement;

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
    const bgs = [
        'grand_blue.jpg',
        'sam_integralista.jpg'
    ];
    let headerIndex: number = Math.floor(Math.random() * bgs.length);

    let header: HTMLElement = document.getElementById('header')!;

    header.style.backgroundImage = 'url(images/headers/' + bgs[headerIndex] + ')';
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
    const popUpShortcuts = [
        {button: 'reddit-google', popUpContainer: 'reddit-search-pop-up'},
        {button: 'wikipedia', popUpContainer: 'wikipedia-pop-up'}
    ];
    
    popUpShortcuts.forEach((object) => {
        let buttonElement = document.getElementById(object.button) as HTMLElement;
        let popUpElement = document.getElementById(object.popUpContainer) as HTMLElement;
        let popUpClass = document.querySelectorAll('.pop-up') as NodeListOf<HTMLElement>;
        let floatingLabelElement = popUpElement.querySelectorAll('.floating-label') as NodeListOf<HTMLElement>;

        buttonElement.onclick = () => {
            let display: string = popUpElement.style.display;
            
            if ((display == '') || (display == 'none')) {
                popUpElement.style.display = 'block';   //Makes the popUp appear
            } else {
                popUpElement.style.display = 'none';    //Makes the popUp disappear
            };

            popUpClass.forEach((element) => {   //Makes every other popUp disappear once the shorcut button is clicked
                if (element != popUpElement) {
                    element.style.display = 'none'
                };
            });

            floatingLabelElement.forEach((label) => {
                let parent = label.parentElement as HTMLElement;
                var siblings = Array.from(parent.children) as Array<HTMLElement>;
                var input = siblings[siblings.indexOf(label) - 1] as HTMLInputElement; //Gets the imediate predecessor sibling
                var rect = popUpElement.getBoundingClientRect();
                var inputRect = input.getBoundingClientRect();
    
                var left = inputRect.left - rect.left;
                label.style.left = left +'px';

                input.setAttribute('placeholder', ' ')
            })
        }

        popUpElement.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();     //Makes the form not submit
                let okButton = popUpElement.querySelector('.ok-button') as HTMLButtonElement;
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

        if (window.open(string, '_blank')) {
            window.open(string, '_blank')?.focus()
        };
    };
}

//To make the wikipedia search work
function wikipediaSearch (): void {
    let keywords = document.getElementById('keywords-wikipedia') as HTMLInputElement;

    let string = 'https://pt.wikipedia.org/w/index.php?search=';

    if (keywords.value) {
        string = string + keywords.value.replace(' ','+');

        window.open(string, '_blank')?.focus();
    }
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
        popUp.addEventListener('mouseup', stopDragging);
        popUp.addEventListener('touchend', stopDragging);
    })
    function startDragging (this: HTMLElement, event: MouseEvent | TouchEvent): void {
        let e: MouseEvent | Touch;
        
        if (event instanceof MouseEvent) {
            e = event;
        } else {
            e = event.touches[0];
        };
        
        if (event.target === this) {
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
            let rect = this.getBoundingClientRect();
            let x: number = e.clientX - offsetX;
            let y: number = e.clientY - offsetY;

            this.style.left = x + 'px';
            this.style.top  = y + 'px';
        }
    }; function stopDragging (): void {
        isDragging = false;
    }
}

document.getElementById('reddit-search-ok')!.onclick = redditSearch;
document.getElementById('wikipedia-ok')!.onclick = wikipediaSearch;

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
        }
    }
    
    async function getCSVData(url: string) {
        try {
            let response = await fetch(url).then((res) => res.text());
            let responseWithNoQuotation = response.replaceAll('"','');
            let data = responseWithNoQuotation.split(/\r?\n/); //Puts each line of the csv in a single line
            let splitData: Array<Array<string>> = [];

            data.forEach(row => {   //Splits each line by ';' characters
                splitData.push(row.split(/;/));
            });
            return splitData
        } catch (error: any) {
            console.error(error.message)
        }
    }

    interface imgMFCItem {
        id: string,
        title: string,
        root: string,
        category: string,
        releaseDate: string,
        releasePrice: string,
        scale: string,
        barcode: string,
        status: string,
        count: string,
        score: string,
        paymentDate: string,
        shippingDate: string,
        collectingDate: string,
        price: string,
        shop: string,
        shippingMethod: string,
        trackingNumber: string,
        wishability: string,
        note: string,
    }

    function arrayToObject (array: Array<string>): imgMFCItem {
        var object: imgMFCItem = {
            id:             array[0],
            title:          array[1],
            root:           array[2],
            category:       array[3],
            releaseDate:    array[4],
            releasePrice:   array[5],
            scale:          array[6],
            barcode:        array[7],
            status:         array[8],
            count:          array[9],
            score:          array[10],
            paymentDate:    array[11],
            shippingDate:   array[12],
            collectingDate: array[13],
            price:          array[14],
            shop:           array[15],
            shippingMethod: array[16],
            trackingNumber: array[17],
            wishability:    array[18],
            note:           array[19],
        }
        return object;
    }

    let dataOne = await getCSVData('myFigureCollection.csv') as Array<Array<string>>;
    let dataTwo = dataOne.map(arrayToObject);
    let data = CustomFunctions.shuffle(dataTwo);
    let owned = [];
    let ordered = [];

    for (let i = 1; i < data.length; i++) { // Loop through the values of dataObject
        
        if (data[i].status == 'Owned') {
            owned.push(data[i]);
        } else if (data[i].status == 'Ordered') {
            ordered.push(data[i]);
        }

    }
    
    owned.forEach(item => {
        createElement(item, 'owned')
    });

    ordered.forEach(item => {
        createElement(item, 'ordered')
    });
    
    function createElement (item: imgMFCItem, cardName: string) { //To create the necessary elements
        var div  = document.createElement('div');   // The container
        let img  = new Image()                      // The image
        let card = document.getElementById(cardName) as HTMLElement;

        div.setAttribute('alt', item.title);
        div.setAttribute('class', 'pinterest-grid-item');
        div.setAttribute('price', 'R$ ' + item.price.replace('.',','));
        img.src = `./images/mfc/${item.id}.jpg`;

        if (item.category == 'Prepainted') {
            div.style.color = 'green';
        } else if (item.category == 'Action/Dolls') {
            div.style.color = 'blue';
        } else {
            div.style.color = 'orange';
        }

        img.style.border = `3px solid ${div.style.color}`;

        let imgBorder = img.style.border.split(' ')[0];

        img.style.width = `calc(100% - ${imgBorder} * 2)`

        img.onclick = () => { //Format a pop-up for each item once it's image is clicked
            let popUp          = document.querySelector('#mfc-pop-up')              as HTMLDivElement;
            let title          = popUp.querySelector('.pop-up-title')               as HTMLSpanElement;
            let popUpImgAnchor = popUp.querySelector('#pop-up-img')                 as HTMLAnchorElement;
            let popUpImg       = popUpImgAnchor.childNodes[0]                       as HTMLImageElement;
            let rating         = popUp.querySelector('#mfc-item-rating')            as HTMLParagraphElement;
            let ratingBefore   = popUp.querySelector('#mfc-item-rating-before')     as HTMLParagraphElement;
            let price          = popUp.querySelector('#mfc-item-price')             as HTMLSpanElement;
            let collectingDate = popUp.querySelector('#mfc-item-collecting-date')   as HTMLSpanElement;
            let a              = popUp.querySelector('.pop-up-header > div > a')    as HTMLAnchorElement;

            title.innerHTML             = item.title;
            popUpImgAnchor.href         = `https://pt.myfigurecollection.net/item/${item.id}`;
            popUpImg.src                = img.src;
            price.innerHTML             = `R$ ${item.price.replace('.',',')}`;
            
            if (CustomFunctions.isParent(div, document.getElementById('owned')!)) {
                a.href                      = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user'
                collectingDate.parentElement!.style.display = '';
                rating.style.display                        = '';
                collectingDate.innerHTML    = CustomFunctions.revertArray(item.collectingDate.split('-')).join('/');
                rating.innerHTML            = '⭐'.repeat(Number(item.score.split('/')[0]));
                ratingBefore.innerHTML      = item.score;
            } else if (CustomFunctions.isParent(div, document.getElementById('ordered')!)) {
                collectingDate.parentElement!.style.display = 'none';
                rating.style.display                        = 'none';
                a.href                     = 'https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=-1&categoryId=-1&output=3&sort=since&order=desc&_tb=user'
            }
            
            popUp.style.display = 'block';

            popUp.addEventListener('mousemove', displayScoreAsNumber);
            popUp.addEventListener('touchstart', displayScoreAsNumber);
            
            let timerId:any = 0;

            function displayScoreAsNumber (event: Event): void {
                clearTimeout(timerId);
                timerId = setTimeout(() => {
                    if (event.target === rating) {
                        ratingBefore.style.display = 'block';
                    }
                }, 1000);
                if (event.target !== rating) {
                    ratingBefore.style.display = 'none';
                }
            }
        }

        div.append(img);
        card.append(div);
        div.append(item.title);
    }

    (function priceFollowCursor (): void {
        let aside = document.querySelector('aside') as HTMLElement;
        let items = aside.querySelectorAll('.pinterest-grid-item') as NodeListOf<HTMLDivElement>;
    
        let span = document.createElement('span') as HTMLSpanElement; // Creates the "pop-up"
        span.setAttribute('class', 'pinterest-grid-price');
        span.style.display = 'none';
        aside.appendChild(span);
    
        items.forEach((item) => {
            let img = item.firstChild as HTMLImageElement;
    
            item.addEventListener('mouseenter', () => {
                span.style.display = 'block';
                span.innerHTML = item.getAttribute('price')!;
                span.style.border = img.style.border;
            })
            item.addEventListener('mouseleave', () => {
                span.style.display = 'none';
            })
            item.addEventListener('mousemove', (event) => {
                let rect = aside.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                
                span.style.top  = y + 20 + 'px';
                span.style.left = x +  0 + 'px';
            });
        });
    })();

    setTimeout(resizeAllMasonryItems,500);
};

window.addEventListener('load', onLoadFunctions, true); async function onLoadFunctions () {
    openLinksInNewTab();
    redirectToEdge();
    setHeaderBackground();
    figuresSitDown();
    resizeAside(0)
    setDefaults();
    adjustGamecard();
    rotateGamecardText(0);
    dragPopUps();
    await addImages();
    mfcToggleSwitch();
    makeSwitchesSlide();
    formatPopUps();
};
window.addEventListener('resize', onResizeFunctions, true); function onResizeFunctions () {
    resizeAside();
    figuresSitDown();
    rotateGamecardText(0);
};
window.addEventListener('mousemove', onMouseMoveFunctions, true); function onMouseMoveFunctions (event: Event) {
    // console.log(event.target);
}