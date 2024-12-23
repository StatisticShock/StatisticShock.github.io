// Open in new tab
document.querySelectorAll('.shortcut-item').forEach(element => {
    element.target = '_blank';
});

document.querySelectorAll('.gamecard').forEach(element => {
    element.firstElementChild.target = '_blank';
});

//To make aside the same height of Shortcut-Items
window.addEventListener('load', resizeAside);
window.addEventListener('resize', resizeAside);

function resizeAside () {
   const aside = document.querySelector('aside');
   const card = document.querySelector('.card');
   const shortcuts = document.querySelector('#shortcuts');

   aside.style.height = shortcuts.offsetHeight + 'px';
   card.style.height = shortcuts.offsetHeight + 'px';
}

// To make the gamecard occupy 50% of the screen on hover
document.querySelectorAll('.gamecard-container').forEach(gamecard_container => {
    var childCount = Math.max(gamecard_container.children.length, 2);

    gamecard_container.style.setProperty('--gamecard-count', childCount);
});

document.querySelectorAll('.gamecard-text > span p').forEach(element => {
    element.style.marginLeft = - (element.offsetWidth / 2 - 20) + 'px';
});

// To make the header have different backgrounds
window.addEventListener('load', setHeaderBackground);

function setHeaderBackground () {
    const bgs = [
        'grand_blue.jpg',
        'sam_integralista.jpg'
    ];
    var headerIndex = Math.floor(Math.random() * bgs.length);

    const header = document.getElementById('header');

    header.style.backgroundImage = 'url(headers/' + bgs[headerIndex] + ')';
}

// To make 2B sit on the navbar

window.addEventListener('load', twoB_Resize);
window.addEventListener('resize', twoB_Resize);

function twoB_Resize () {
    const twoB = document.getElementById('twoB');
    const twoB_Ass = Math.floor(parseFloat(getComputedStyle(twoB).height) * 493 / 920);
    const twoB_Pussy = Math.floor(parseFloat(getComputedStyle(twoB).width) * 182 / 356);
    const aside = document.querySelector('aside')

    twoB.style.top = (- twoB_Ass) + 'px';
    twoB.style.right = (aside.offsetWidth - twoB_Pussy) + 'px';
}

// To make Ai sit on top of the navbar
window.addEventListener('load', ohto_Resize);
window.addEventListener('resize', ohto_Resize);

function ohto_Resize () {
    const ohto = document.getElementById('ohto');
    const ohto_panties = getComputedStyle(ohto).height;
    const ohto_mouth = Math.floor(getComputedStyle(ohto).width / 2);
    
    ohto.style.top = '-' + ohto_panties;
    ohto.style.left = getComputedStyle(document.getElementById('twoB')).right;
}

//To add an internet speed tester
const imageAddr = "https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg"; 
const downloadSize = 5_245_329; //bytes
const textField = document.querySelector('#internet-speed');
const wholeTextField = document.querySelector('#internet-speed-text');

setInterval(initiateSpeedDetection, 15000);

function initiateSpeedDetection() { //Initiates the process
   window.setTimeout(measureConnectionSpeed, 1);
};    

if (window.addEventListener) {
    window.addEventListener('load', initiateSpeedDetection, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', initiateSpeedDetection);
}

function measureConnectionSpeed() {
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    }
    
    download.onerror = function (err, msg) {
      wholeTextField.textContent = "Inválida";
      window.reload;
    }
    
    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster; //I need to test if cached buster in needed
    
    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        textField.textContent = speedMbps + ' Mbps';
        rotateSpeedometer(speedMbps);
    }

    // To rotate the speedometer
    function rotateSpeedometer (speed) {
        var needle = document.getElementById('needle')

        needle.style.transform = 'rotate(' + (speed / 300 * 270 - 135) + 'deg)';
    }
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

    window.addEventListener('load', redirectToEdge);

//To make the popups appear on click
const popUpShortcuts = [
    ['reddit-google','reddit-search-pop-up']
];

for (i = 0; i < popUpShortcuts.length; i++) {
    var shortcut = document.getElementById(popUpShortcuts[i][0]);
    var popUp = document.getElementById(popUpShortcuts[i][1]);

    shortcut.onclick = () => {
        var display = popUp.style.display;
        
        if ((display == '') || (display == 'none')) {
            popUp.style.display = 'block';
        } else {
            popUp.style.display = 'none';
        };
    }
    
}

    //To make the Close Button work
    document.querySelectorAll('.close-button').forEach((button) => {
        var parent = button.parentElement.parentElement;
        button.onclick = () => {
            parent.style.display = 'none';
            setDefaults();
        };
    })

// To make the reddit search work
function redditSearch () {
    const keywords =    document.getElementById('keywords');
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

document.getElementById('reddit-search-ok').onclick = redditSearch;

window.addEventListener('load', setDefaults); // To make the defaults load within the window
function setDefaults () {
    document.getElementById('keywords').value = '';
    document.getElementById('subreddit').value = '';
    document.getElementById('to-date').valueAsDate = new Date();
    document.getElementById('from-date').valueAsDate = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())
}
