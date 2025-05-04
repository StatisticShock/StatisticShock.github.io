api.send('A api esta funcionando.');

function fetchJson () {
    api.load();

    api.onReply((event, json) => {
        console.log(json);

        const paragraph = document.querySelector('.container p');
        paragraph.style.display = 'none'

        json.forEach((item) => {
            const container = document.querySelector('.container');
            const button = document.createElement('a');
            button.id = item.id;
            button.innerHTML = `<img src="${item.img}">`

            button.onclick = function (ev) {
                const popUp = document.querySelector('.pop-up.mfc')
                const img = popUp.querySelector('#pop-up-img img');
                const closeBttn = popUp.querySelector('.close-button');
                const updateBttn = popUp.querySelector('.update.button');
                const showBttn = popUp.querySelector('.show.button');

                popUp.style.display = 'block';
                img.src = item.img;
                closeBttn.onclick = function (ev) {popUp.style.display = 'none'}

                let originalName   = popUp.querySelector('#mfc-character-original-name');
                let originName     = popUp.querySelector('#mfc-character-origin');
                let classification = popUp.querySelector('#mfc-classification');

                originalName.innerHTML      = item.characterJap !== undefined ? item.characterJap : '';
                originName.innerHTML        = item.origin !== undefined ? item.origin : '';
                classification.innerHTML    = item.classification !== undefined ? item.classification : '';

                updateBttn.onclick = function (ev) {
                    updateItem(item.id, json);
                    console.log(json);
                };

                showBttn.onclick = function (ev) {
                    showItem(item.id, json);
                };

                function showItem (elementId, json) {
                    let oldItemData = json.filter((item) => {return item.id === elementId})[0];
                
                    alert(JSON.stringify(oldItemData, null, 2).replaceAll('"',''));
                };
            }

            container.appendChild(button);
        });

        setInterval(resizeAllMasonryItems,1000);
    });

    function resizeMasonryItem (item) {
        /* Get the grid object, its row-gap, and the size of its implicit rows */
        let grid = document.getElementsByClassName('container')[0],
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
    
    function resizeAllMasonryItems () {
        // Get all item class objects in one list
        let allItems = document.querySelectorAll('.container a');
    
        for(let i=0;i<allItems.length;i++){
          resizeMasonryItem(allItems[i]);
        };
    }
}

function updateItem (itemId, json) {
    api.update(itemId, json);
}

fetchJson();