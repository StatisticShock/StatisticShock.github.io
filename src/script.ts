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

    header.style.backgroundImage = 'url(headers/' + bgs[headerIndex] + ')';
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
function toggleSwitch (): void {
    let input = document.querySelector('#mfc-switch > input') as HTMLInputElement;
    let owned = document.getElementById('owned') as HTMLElement;
    let ordered = document.getElementById('ordered') as HTMLElement;
    let card = document.querySelector('.card') as HTMLElement;


    input.onclick = () => {
        if (input.checked) {
            owned.style.transform = 'translateX(-100%)';
            ordered.style.transform = 'translateX(0%)';
            card.setAttribute('href','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=0&categoryId=-1&output=3&sort=category&order=asc&_tb=user');
        } else {
            owned.style.transform = 'translateX(0%)';
            ordered.style.transform = 'translateX(100%)';
            card.setAttribute('href','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=0&categoryId=-1&output=3&sort=category&order=asc&_tb=user');
        };
    };
    ordered.style.transform = 'translateX(100%)';  // Put it to the right so it doesn't appear on page load
    ordered.style.display = 'grid';                // Make it "visible"
    resizeAllMasonryItems()                        // Resize the hidden entries
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
function dragPopUp (): void {
    document.querySelectorAll('.pop-up').forEach(popUp => {
        // popUp.draggable = true;
    })
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

// To add MFC images in the aside
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
    let rowSpan = Math.ceil((item.offsetHeight+rowGap)/(rowHeight+rowGap));
  
    /* Set the spanning as calculated above (S) */
    item.style.gridRowEnd = 'span '+rowSpan;
}

function resizeAllMasonryItems (): void {
    // Get all item class objects in one list
    var allItems = document.querySelectorAll('pinterest-grid-item') as NodeListOf<HTMLElement>;
  
    for(var i=0;i<allItems.length;i++){
      resizeMasonryItem(allItems[i]);
    }
}

function shuffle (arr: Array<any>): Array<any> {
    var j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    };
    return arr;
    }

async function addImages () {
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
        id:       string,
        title:    string,
        category: string,
        status:   string,
        tracking: string,
        price:    string
    }

    function arrayToObject (array: Array<string>): imgMFCItem {
        var object: imgMFCItem = {
            id:       array[0],
            title:    array[1],
            category: array[3],
            status:   array[8],
            tracking: array[17],
            price:    array[14]
        }
        return object;
    }

    var dataOne = await getCSVData('myFigureCollection.csv') as Array<Array<string>>;
    var dataTwo = dataOne.map(arrayToObject);
    var data = shuffle(dataTwo);
    var owned = [];
    var ordered = [];

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
        var div  = document.createElement('div');   //The container
        var span = document.createElement('span');  // The price "pop-up"
        var img  = document.createElement('img');

        div.setAttribute('alt', item.title);
        div.setAttribute('class', 'pinterest-grid-item');
        span.innerHTML = 'R$ ' + item.price.replace('.',',');
        span.setAttribute('class', 'pinterest-grid-price');
        img.setAttribute('src', 'https://static.myfigurecollection.net/upload/items/2/' + item.id + '-' + item.tracking + '.jpg');
        
        if (item.category == 'Prepainted') {
            div.style.color = 'green';
            span.style.border = '2px solid green';
            img.style.border = '2px solid green';
        } else if (item.category == 'Action/Dolls') {
            div.style.color = 'blue';
            span.style.border = '2px solid blue';
            img.style.border = '2px solid blue';
        } else {
            div.style.color = 'orange';
            span.style.border = '2px solid orange';
            img.style.border = '2px solid orange';
        }

        div.append(img);
        div.append(span);
        let card = document.getElementById(cardName) as HTMLElement;
        card.append(div);
        div.append(item.title);
    }

    resizeAllMasonryItems();
};

function priceFollowCursor () {
    let card = document.querySelector('.card') as HTMLElement;
    let prices = card.querySelectorAll('.pinterest-grid-price') as NodeListOf<HTMLElement>;


    card.addEventListener('mousemove', (event) => {
        let rect = card.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        prices.forEach((price) => {
            price.style.left =      x + 'px';
            price.style.top  = 55 + y + 'px';
        })
    });
}

window.addEventListener('load', onLoadFunctions, true); async function onLoadFunctions () {
    openLinksInNewTab();
    redirectToEdge();
    setHeaderBackground();
    figuresSitDown();
    resizeAside(0)
    setDefaults();
    adjustGamecard();
    rotateGamecardText(0);
    dragPopUp();
    await addImages();
    toggleSwitch();
    makeSwitchesSlide();
    formatPopUps();
};
window.addEventListener('resize', onResizeFunctions, true); function onResizeFunctions () {
    resizeAside();
    figuresSitDown();
    rotateGamecardText(0);
};
window.addEventListener('mousemove', onMouseMoveFunctions, true); function onMouseMoveFunctions () {
    priceFollowCursor();
}