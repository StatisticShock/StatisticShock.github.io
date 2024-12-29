//Add jQuery
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.7.1.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);

// Open in new tab
function openLinksInNewTab () {
    document.querySelectorAll('.shortcut-item').forEach(element => {
        if (element.href.match(/docs\.google\.com/) == null) {
            element.target = '_blank';
        }
    });

    document.querySelectorAll('.gamecard').forEach(element => {
        if (element.firstElementChild.href.match(/docs\.google\.com/) == null) {
            element.firstElementChild.target = '_blank';
        }
    });
}

//To make sheets open in edge
function redirectToEdge () {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        var hyperlink = link.href

        if (hyperlink.match(/docs\.google\.com/)) {
            link.href = 'microsoft-edge:' + hyperlink
            link.target = ''
        }
    });
}

//To make aside the same height of Shortcut-Item
function resizeAside (counter) {
   const aside = document.querySelector('aside');
   const card = document.querySelector('.card');
   const pinterest = document.querySelector('#owned');
   const shortcuts = document.querySelector('#shortcuts');

   aside.style.height = 'fit-content';
   card.style.height = 'fit-content';
   shortcuts.style.height = 'fit-content';

   var maxHeight = Math.max(pinterest.offsetHeight, shortcuts.offsetHeight);

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

function adjustGamecard() {
    document.querySelectorAll('.gamecard-container').forEach(gamecard_container => {
        var childCount = Math.max(gamecard_container.children.length, 2);

        gamecard_container.style.setProperty('--gamecard-count', childCount);
    });

    document.querySelectorAll('.gamecard-text > span p').forEach(element => {
        element.style.marginLeft = - (element.offsetWidth / 2 - 20) + 'px';
    });
}

function rotateGamecardText (counter) {
    document.querySelectorAll('.gamecard > a > span').forEach(element => {
        var elementId = '#' + element.parentElement.id;
        if ($(elementId)[0].firstChild.scrollWidth > $(elementId).width()) {
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
function setHeaderBackground () {
    const bgs = [
        'grand_blue.jpg',
        'sam_integralista.jpg'
    ];
    var headerIndex = Math.floor(Math.random() * bgs.length);

    const header = document.getElementById('header');

    header.style.backgroundImage = 'url(headers/' + bgs[headerIndex] + ')';
}

// To make 2B and Ai sit on the navbar (and makke the MFC toggle sit under 2B)
function figuresSitDown () {
    const twoB = document.getElementById('twoB');
    const twoB_Ass = Math.floor(parseFloat(getComputedStyle(twoB).height) * 493 / 920);
    const twoB_Pussy = Math.floor(parseFloat(getComputedStyle(twoB).width) * 182 / 356);
    const aside = document.querySelector('aside');

    twoB.style.top = (- twoB_Ass) + 'px';
    twoB.style.right = (aside.offsetWidth / 2 - twoB_Pussy) + 'px';

    const ohto = document.getElementById('ohto');
    const ohto_panties = getComputedStyle(ohto).height;
    const ohto_mouth = Math.floor(getComputedStyle(ohto).width / 2);
    
    ohto.style.top = '-' + ohto_panties;
    ohto.style.left = getComputedStyle(document.getElementById('twoB')).right;

    const toggleSwitch = document.getElementById('mfc-switch');
    
    toggleSwitch.style.right = parseFloat(twoB.style.right) + parseFloat(twoB.offsetWidth) / 2 + 'px';
    toggleSwitch.style.transform = 'translate(50%, 0)'
}

//To make all switches work
function makeSwitchesSlide () {
    document.querySelectorAll('.switch > .slider').forEach((slider) => {
        var parent = slider.parentElement;
        var input = parent.querySelector('input');

        var uncheckedPosition = getComputedStyle(slider, '::before').left;
        var checkedPosition   = parseFloat(parent.offsetWidth) - parseFloat(uncheckedPosition) * 3 - parseFloat(getComputedStyle(slider, ':before').width) + 'px';

        slider.style.setProperty('--total-transition', checkedPosition);
        input.style.setProperty('--total-transition', checkedPosition);
    })
}

//To make MFC toggle switch work
function toggleSwitch () {
    $('#mfc-switch  > input').click(() => {
        if ($('#mfc-switch > input').is(':checked')) {
            $('#owned').css('transform','translateX(-100%)');
            $('#ordered').css('transform','translateX(0%)');
            $('.card').attr('href','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=1&current=keywords&rootId=0&categoryId=-1&output=3&sort=category&order=asc&_tb=user');
        } else {
            $('#owned').css('transform','translateX(0%)');
            $('#ordered').css('transform','translateX(100%)');
            $('.card').attr('href','https://pt.myfigurecollection.net/?mode=view&username=HikariKun&tab=collection&page=1&status=2&current=keywords&rootId=0&categoryId=-1&output=3&sort=category&order=asc&_tb=user');
        };
    });
    $('#ordered').css('transform','translateX(100%)');  // Put it to the right so it doesn't appear on page load
    $('#ordered').css('display','grid');                // Make it "visible"
    resizeAllMasonryItems()                             // Resize the hidden entries
}

//To make the popups appear on click
function formatPopUps () {
    const popUpShortcuts = [
        ['reddit-google','reddit-search-pop-up'],
        ['wikipedia', 'wikipedia-pop-up']
    ];
    
    popUpShortcuts.forEach((array) => {
        var shortcut = document.getElementById(array[0]);
        var popUp = document.getElementById(array[1]);
        var popUpClass = document.querySelectorAll('.pop-up');

        shortcut.onclick = () => {
            var display = popUp.style.display;
            
            if ((display == '') || (display == 'none')) {
                popUp.style.display = 'block';
            } else {
                popUp.style.display = 'none';
            };

            popUpClass.forEach((element) => {
                if (element != popUp) {
                    element.style.display = 'none'
                };
            });
        }
    });
    
    //To make the Close Button work
    document.querySelectorAll('.close-button').forEach((button) => {
        var parent = button.parentElement.parentElement;
        button.onclick = () => {
            parent.style.display = 'none';
            setDefaults();
        };
    })
    
}

// To make the reddit search work
function redditSearch () {
    const keywords =    document.getElementById('keywords-reddit');
    const subreddit =   document.getElementById('subreddit');
    const from =        document.getElementById('from-date');
    const to =          document.getElementById('to-date');

    if ((new Date(from.value) >= new Date(to.value)) && from.value && to.value) return;

    let string = 'https://www.google.com/search?q=';

    if (keywords.value) {
        string = string + keywords.value.replace(' ','+');

        if (subreddit.value) {
            string = string + '+site%3Ahttps%3A%2F%2Freddit.com%2Fr%2F' + subreddit.value;
        } else {
            string = string + '+site%3Ahttps%3A%2F%2Freddit.com';
        }

        if (from.value) {
            string = string + '+after%3A' + from.value;
        }

        if (to.value) {
            string = string + '+before%3A' + to.value;
        }

        window.open(string, '_blank').focus();
    };
}

//To make the wikipedia search work
function wikipediaSearch () {
    const keywords = document.getElementById('keywords-wikipedia');

    let string = 'https://pt.wikipedia.org/w/index.php?search=';

    if (keywords.value) {
        string = string + keywords.value.replace(' ','+');

        window.open(string, '_blank').focus();
    }
}

// To make the inputbox draggable
function dragPopUp () {
    document.querySelectorAll('.pop-up').forEach(popUp => {
        // popUp.draggable = true;
    })
}

document.getElementById('reddit-search-ok').onclick = redditSearch;
document.getElementById('wikipedia-ok').onclick = wikipediaSearch;

// To make the defaults load within the window
function setDefaults () {
    document.getElementById('keywords-reddit').value = '';
    document.getElementById('subreddit').value = '';
    document.getElementById('to-date').valueAsDate = new Date();
    document.getElementById('from-date').valueAsDate = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())

    document.getElementById('keywords-wikipedia').value = '';
}


function shuffle (arr) {
    var j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}

// To add MFC images in the aside
function resizeMasonryItem(item){
    /* Get the grid object, its row-gap, and the size of its implicit rows */
    var grid = document.getElementsByClassName('pinterest-grid')[0],
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
    var rowSpan = Math.ceil((item.offsetHeight+rowGap)/(rowHeight+rowGap));
  
    /* Set the spanning as calculated above (S) */
    item.style.gridRowEnd = 'span '+rowSpan;
}

function resizeAllMasonryItems(){
    // Get all item class objects in one list
    var allItems = document.getElementsByClassName('pinterest-grid-item');
  
    for(var i=0;i<allItems.length;i++){
      resizeMasonryItem(allItems[i]);
    }
}

async function addImages () {
    async function getCSVData(url) {
        try {
            const response = await fetch(url).then((res) => res.text());
            const responseWithNoQuotation = response.replaceAll('"','',true);
            const data = responseWithNoQuotation.split(/\r?\n/); //Puts each line of the csv in a single line
            var splitData = [];

            data.forEach(row => {   //Splits each line by ';' characters
                splitData.push(row.split(/;/));
            });
            return splitData
        } catch (error) {
            console.error(error.message)
        }
    }

    function arrayToObject (array) {
        var object = {
            "id": array[0],
            "title": array[1],
            "category": array[3],
            "status": array[8],
            "tracking":array[17],
            "price": array[14]
        }
        return object;
    }

    var dataOne = await getCSVData('myFigureCollection.csv');
    var dataTwo = dataOne.map(arrayToObject);
    var data = shuffle(dataTwo);
    var owned = [];
    var ordered = [];

    for (i = 1; i < data.length; i++) { // Loop through the values of dataObject
        
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
    
    function createElement (item, cardName) { //To create the necessary elements
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
        var card = $('#' + cardName);
        card.append(div);
        div.append(item.title);
    }

    resizeAllMasonryItems();
};

function priceFollowCursor () {
    const card = document.querySelector('.card');
    const prices = card.querySelectorAll('.pinterest-grid-price')

    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        prices.forEach((price) => {
            price.style.left =      x + 'px';
            price.style.top  = 60 + y + 'px';
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