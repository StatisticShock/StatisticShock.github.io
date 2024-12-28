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

async function getCSVData(url) {
    try {
        const response = await fetch(url).then((res) => res.text());
        const responseWithNoQuotation = response.replaceAll('"','',true);
        const data = responseWithNoQuotation.split(/\r\n/); //Puts each line of the csv in a single line
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
        "tracking":array[17]
    }
    return object;
}

async function addImages () {
    var data = await getCSVData('myFigureCollection.csv');
    data = data.map(arrayToObject);
    data = shuffle(data);
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

    document.querySelector('#ordered').style.display = 'none'
    
    function createElement (item, cardName) {
        var div = document.createElement('div');
        var img = document.createElement('img');

        div.setAttribute('alt', item.title);
        div.setAttribute('class', 'pinterest-grid-item')
        img.setAttribute('src', 'https://static.myfigurecollection.net/upload/items/2/' + item.id + '-' + item.tracking + '.jpg');
        
        if (item.category == 'Prepainted') {
            img.setAttribute('style', 'border: 2px solid green;');
            div.style.color = 'green';
        } else if (item.category == 'Action/Dolls') {
            img.setAttribute('style', 'border: 2px solid blue;');
            div.style.color = 'blue';
        }

        div.append(img);
        const card = $('#' + cardName);
        card.append(div);
        div.append(item.title);
    }

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

    resizeAllMasonryItems();
};

addImages();