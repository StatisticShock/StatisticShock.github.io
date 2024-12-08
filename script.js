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

// To make 2B sit on the navbar

window.addEventListener('load', twoB_Resize);
window.addEventListener('resize', twoB_Resize);

function twoB_Resize () {
    const twoB = document.getElementById('twoB');
    const twoB_Ass = Math.floor(parseFloat(getComputedStyle(twoB).height) * 493 / 920);
    const twoB_Pussy = Math.floor(parseFloat(getComputedStyle(twoB).width) * 182 / 356);
    const header = document.getElementById('header');
    const aside = document.querySelector('aside')

    twoB.style.top = (- twoB_Ass) + 'px';
    twoB.style.right = (aside.offsetWidth / 2 - twoB_Pussy) + 'px';
}

// To make the gamecard occupy 50% of the screen on hover
document.querySelectorAll('.gamecard-container').forEach(gamecard_container => {
    var childCount = Math.max(gamecard_container.children.length, 2);

    gamecard_container.style.setProperty('--gamecard-count', childCount);
});

document.querySelectorAll('.gamecard-text > span p').forEach(element => {
    element.style.marginLeft = - (element.offsetWidth / 2 - 20) + 'px';
});

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