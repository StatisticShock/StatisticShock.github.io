let yesButton = document.querySelector('#yes');
let noButton = document.querySelector('#no');
let card     = document.querySelector('.card');
let count    = 0; //To count the amount of times teh NoButton has been clicked

function moveNoButtonToRandomSpot () {
    
    if (count >= 10) {
        noButton.innerHTML = yesButton.textContent;
        noButton.addEventListener('click', redirectToYesPage);
        return;
    } else if (count > 7) {
        noButton.style.right   = '10%';
        noButton.style.top     = '70%';
        noButton.style.opacity = 0.5;
        noButton.style.cursor  = 'default';
        document.querySelector('.container p').style.display = 'block'
        count++;
        return
    };
    
    let rect = card.getBoundingClientRect();
    let x = rect.width + 1; //To make the while loop run at least once
    let y = rect.height + 1;

    while (x > rect.width - noButton.offsetWidth || y > rect.height - noButton.offsetHeight) {
        x = Math.floor(Math.random() * rect.width);
        y = Math.floor(Math.random() * rect.height);
    };

    noButton.style.right = x + 'px';
    noButton.style.top   = y + 'px';

    count++ //adds the count
    console.log(count)
};

function makeBackgroundMove () {
    let container = document.querySelector('body');
    let currentStyle = parseFloat(container.style.getPropertyValue('--desloc')) || 0;

    if (currentStyle > 0) {
        container.style.setProperty('--desloc', -50 + 'px');
    } else {
        container.style.setProperty('--desloc', 50 + 'px');
    };    
};

function redirectToYesPage () {
    window.location.href = 'yes'
};

function fitTextNoButton () {
    let fontSize = parseFloat(getComputedStyle(noButton).fontSize);

    while (noButton.scrollWidth > yesButton.scrollWidth) {
        fontSize -= 1;
        noButton.style.fontSize = fontSize + "px";
    };
};



yesButton.addEventListener('click', redirectToYesPage);

noButton.addEventListener('click', moveNoButtonToRandomSpot);

document.addEventListener('DOMContentLoaded', loadFunctions); function loadFunctions () {
    makeBackgroundMove();
    setInterval(makeBackgroundMove, 4000)
    // fitTextNoButton();
};