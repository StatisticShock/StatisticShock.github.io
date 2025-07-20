api.send('renderer-message', 'A api esta funcionando.'); //Sends an message to the main.js
api.on('fetch-json-again', async (event, message) => {
    document.querySelectorAll('.container a').forEach((anchor) => {
        anchor.remove();
        console.log('removed');
    });
    await fetchJson();
    document.querySelectorAll('.container button').forEach((button) => {
        button.click();
        button.click();
    });
});

async function fetchJson () {
    const paragraph = document.querySelector('.main.pop-up');
    const searchBar = document.querySelector('#search-bar');

    paragraph.style.display = ''
    
    api.load();
    api.onReply((event, json) => {
        console.log(`Loaded from "api.load()".`, json);
        
        loadContent(event, json);
        
        let timeout;
        searchBar.addEventListener('keyup', (ev) => {
            clearTimeout(timeout);
            
            timeout = setTimeout(() => {
                searchFigure(json);
            }, 1500);
        })
    });
};

function loadContent (event, json) {
    const paragraph = document.querySelector('.main.pop-up');
    paragraph.style.display = 'none'

    json.forEach((item) => {
        const container = document.querySelector(`.container .${item.type.toLowerCase()}`);
        const button = document.createElement('a');
        button.id = item.id;
        button.className = 'pinterest-grid-item'
        button.innerHTML = `<img src="${item.img}">`
        button.style.opacity = 0;

        button.onclick = function (ev) {
            const popUp = document.querySelector('.pop-up.mfc')
            const img = popUp.querySelector('#pop-up-img img');
            const closeBttn = popUp.querySelector('.close-button');
            const updateBttn = popUp.querySelector('.update.button');
            const showBttn = popUp.querySelector('.show.button');

            popUp.style.display = 'block';
            img.src = item.img;
            img.parentElement.onclick = function (ev) {api.send('href', item.href)}
            closeBttn.onclick = function (ev) {popUp.style.display = 'none'}

            let originalName   = popUp.querySelector('#mfc-character-original-name');
            let originName     = popUp.querySelector('#mfc-character-origin');
            let classification = popUp.querySelector('#mfc-classification');

            originalName.innerHTML      = item.characterJap !== undefined ? item.characterJap : '';
            originName.innerHTML        = item.origin !== undefined ? item.origin : '';
            classification.innerHTML    = item.classification !== undefined ? item.classification : '';

            updateBttn.onclick = function (ev) {
                console.log('should update');
                updateItem(item.id, json);
            };

            showBttn.onclick = function (ev) {
                api.metadata(item);
            };
        };

        container.appendChild(button);
    });

    //To hide the button if there is no elements
    const containers = document.querySelectorAll('.container > div');
    containers.forEach((typeOfContainer) => {
        
        const container = document.querySelector(`.container`);
        const bttn = Array.from(container.children).filter((child) => {
            const index = Array.from(container.children).indexOf(typeOfContainer) - 1
            
            return child === Array.from(container.children)[index];
        })[0];
                
        if (typeOfContainer.children.length > 0) {
            typeOfContainer.style.opacity = 1;
            bttn.style.display = '';
        } else {            
            bttn.style.display = 'none';
        }
    });

    showItems();
};

function updateItem (itemId, json) {
    api.update(itemId, json);
};

function showItems() {
    const buttons = document.querySelectorAll('.container button');
    buttons.forEach((bttn) => {
        bttn.onclick = function (ev) {
            const container = document.querySelector('.container');
            const children = container.children;
            let index;
            for (let i = 0; i < children.length; i++) {
                if (children[i] === bttn) {
                    index = i + 1; // Gets nth + 1 child corresponding to the clicked button
                };
            };

            const correspContainer = children[index];
            const items = correspContainer.querySelectorAll('a');

            const currentStyle = correspContainer.style.display;

            if (currentStyle === 'grid' || currentStyle === '') {
                setTimeout(() => {
                    correspContainer.style.display = 'none';
                }, 500);
                items.forEach((figure) => {
                    figure.style.opacity = 0
                });
                rotateArrow(bttn, 'right');
            } else if (currentStyle === 'none') {
                correspContainer.style.display = 'grid';
                rotateArrow(bttn, 'down');
                setTimeout(() => {resizeAllMasonryItems();}, 50);
                setTimeout(() => {resizeAllMasonryItems();}, 150);
                items.forEach((figure) => {
                    setTimeout(() => {
                        figure.style.opacity = 1
                    }, 100);
                });
            };
        };
    });
};

function rotateArrow (button, direction) {
    const arrow = button.querySelector('div');

    if (direction === 'down') {
        arrow.style.transform = `rotate(90deg)`
    } else if (direction === 'right') {
        arrow.style.transform = `rotate(0deg)`
    }
};

function resizeMasonryItem (item) {
    /* Get the grid object, its row-gap, and the size of its implicit rows */

    let grids = document.querySelectorAll('.container > div');

    grids.forEach((grid) => {
        const gridItems = Array.from(grid.querySelectorAll('a'));
        
        if (grid.style.display !== 'none' && gridItems.includes(item)) {
            let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
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
        };
    });
};

function resizeAllMasonryItems () {
    // Get all item class objects in one list
    let allItems = document.querySelectorAll('.container div a');

    for(let i=0; i<allItems.length; i++){
        resizeMasonryItem(allItems[i]);
    };
};

function searchFigure (json) {
    let searchStr = new RegExp(document.querySelector('#search-bar').value, 'i');
    console.info(`A string procurada é ${searchStr}`);
    
    const figuresToHide = json.filter((figure) => {
        let count = 0;

        Object.keys(figure).forEach((key) => {
            if (searchStr.test(figure[key])) {
                count += 1;
            }
        });
        return count === 0;
    });

    const anchors = document.querySelectorAll('.pinterest-grid-item');

    anchors.forEach((anchor) => {
        anchor.style.display = 'block';

        if (figuresToHide.filter((figure) => figure.id === anchor.id).length > 0) {
            anchor.style.display = 'none';
        };
    });

    const buttons = document.querySelectorAll('.container > button');
    const grids = document.querySelectorAll('.container > div');
    grids.forEach((grid) => {grid.style.display = 'none'});
    buttons.forEach((button) => {
        button.click();
        if (document.querySelector('#search-bar').value === '') {
            button.click();
        };
    });
};

fetchJson();
window.addEventListener('resize', resizeAllMasonryItems);