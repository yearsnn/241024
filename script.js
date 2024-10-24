var fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell", "Didot"];
let size = 800;

var index;
let offscreen, mask;
let stringInput;
let rowsSlider;
let colsSlider;
let backgroundColor;
let textColor;
let fontGrid;
let h;
const nametagText = document.getElementById('nametag-text');
const nametag = document.querySelector('.nametag');

function setup() {
    createCanvas(windowWidth, windowHeight);
    offscreen = createGraphics(windowWidth, windowHeight);
    mask = createGraphics(windowWidth, windowHeight);
    offscreen.textAlign(CENTER, CENTER);
    
    stringInput = createInput('Here is your text');
    stringInput.style('width', `${windowWidth * 0.25}px`);
    stringInput.style('height', '30px');
    stringInput.position(windowWidth * 0.72, windowHeight * 0.72);
    stringInput.input(scramble);
    stringInput.mousePressed(() => {
        if (stringInput.value() === 'Here is your text') {
            stringInput.value('');
        }
        drawGraphic();
    });
    
    rowsSlider = createSlider(1, 10, 4, 1);
    rowsSlider.style('width', `${windowWidth * 0.25}px`);
    rowsSlider.position(windowWidth * 0.72, windowHeight * 0.79);
    rowsSlider.input(scramble);
    
    colsSlider = createSlider(1, 30, 10, 1);
    colsSlider.style('width', `${windowWidth * 0.25}px`);
    colsSlider.position(windowWidth * 0.72, windowHeight * 0.84);
    colsSlider.input(scramble);
    
    backgroundColor = createColorPicker('#f0f0f0');
    backgroundColor.position(windowWidth * 0.72, windowHeight * 0.89);
    backgroundColor.style('width', `${windowWidth * 0.12}px`);
    backgroundColor.input(drawGraphic);
    
    textColor = createColorPicker('#ff0000');
    textColor.position(windowWidth * 0.85, windowHeight * 0.89);
    textColor.style('width', `${windowWidth * 0.12}px`);
    textColor.input(drawGraphic);
    
    scramble();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    stringInput.style('width', `${windowWidth * 0.25}px`);
    stringInput.position(windowWidth * 0.72, windowHeight * 0.72);
    
    rowsSlider.style('width', `${windowWidth * 0.25}px`);
    rowsSlider.position(windowWidth * 0.72, windowHeight * 0.79);
    
    colsSlider.style('width', `${windowWidth * 0.25}px`);
    colsSlider.position(windowWidth * 0.72, windowHeight * 0.84);
    
    backgroundColor.style('width', `${windowWidth * 0.12}px`);
    backgroundColor.position(windowWidth * 0.72, windowHeight * 0.89);

    textColor.style('width', `${windowWidth * 0.12}px`);
    textColor.position(windowWidth * 0.85, windowHeight * 0.89);
    
    scramble();
}

function scramble() {
    fontGrid = new Array();
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    for (var j = 0; j < rows; j++) {
        fontGrid[j] = new Array();
        for (var i = 0; i < cols; i++) {
            fontGrid[j].push(fonts[floor(random(0, fonts.length))]);
        }
    }
    getHeight();
    drawGraphic();
}

function getHeight() {
    var x = 0;
    for (var i = 0; i < fonts.length; i++) {
        offscreen.textFont(fonts[i]);
        offscreen.textSize(windowWidth);
        offscreen.textSize(windowWidth * windowWidth / offscreen.textWidth(stringInput.value()));
        x = Math.max(x, offscreen.textAscent());
    }
    h = x;
}

function mouseClicked() {
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    var col = floor(mouseX / (windowWidth / cols));
    var row = floor((mouseY - (windowHeight * 0.3 - h / 2)) / (h / rows)); 

    if (row < rows && col < cols) {
        var font = fontGrid[row][col];
        do {
            var newFont = fonts[floor(random(0, fonts.length))];
        } while (fontGrid[row][col] === newFont);

        fontGrid[row][col] = newFont;
        drawGraphic();
    }
}

function getSector(row, col) {
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    var gridWidth = windowWidth * 0.8; 
    var gridHeight = h * 0.8;          
    var out = createGraphics(floor(gridWidth / cols), floor(gridHeight / rows));
    out.fill(color(textColor.value()));
    out.textFont(fontGrid[row][col]);
    out.textSize(gridWidth);
    out.textAlign(CENTER, CENTER);

    out.textSize(gridWidth * gridWidth / out.textWidth(stringInput.value()));
    out.text(stringInput.value(), gridWidth / 2 - col * gridWidth / cols, gridHeight / 2 - row * gridHeight / rows);
    return out.get();
}

function drawGraphic() {
    clear();
    background(color(backgroundColor.value()));

    nametagText.innerText = stringInput.value();
    nametagText.style.color = textColor.value();
    nametag.style.backgroundColor = backgroundColor.value();

    const rows = rowsSlider.value();
    const cols = colsSlider.value();

    let gridWidth = windowWidth * 0.8;  
    let gridHeight = h * 0.8;           
    let gridXOffset = (windowWidth - gridWidth) / 2;  

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            fill(255, 0);
            stroke(0);
            strokeWeight(0);
            rect(gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + row * gridHeight / rows, gridWidth / cols, gridHeight / rows);
            image(getSector(row, col), gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + row * gridHeight / rows, gridWidth / cols, gridHeight / rows);
        }
    }
}

function handleMouseMove(event) {
    const x = (window.innerWidth / 2 - event.pageX) / 30;
    const y = (window.innerHeight / 2 - event.pageY) / 30;
    nametag.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`; 
}

document.addEventListener('mousemove', handleMouseMove);

const popup = document.getElementById('popup');
const popupButton = document.getElementById('popup-button');
const closeButton = document.querySelector('.close-button');
const popupNametagText = document.getElementById('popup-nametag-text');
const popupNametag = document.querySelector('.popup-nametag');

popupButton.addEventListener('click', () => {
    popup.style.display = 'flex';
    popupNametagText.innerText = stringInput.value();
    popupNametagText.style.color = textColor.value(); 
    popupNametag.style.backgroundColor = backgroundColor.value(); 
});

closeButton.addEventListener('click', () => {
    popup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

const backgroundButton = document.getElementById('background-button');
const saveButton = document.getElementById('save-button');
const popupContent = document.querySelector('.popup-content');

const backgrounds = [
    'url(111.jpg)',
    'url(222.jpg)',
    'url(333.jpg)',
    'url(444.jpg)',
    'url(555.jpg)',
    'url(666.jpg)',
    'url(777.jpg)',
    'url(888.jpg)',
    'url(999.jpg)',
    'url(101010.jpg)'
];

function changeBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    const selectedBackground = backgrounds[randomIndex];
    popupContent.style.backgroundImage = selectedBackground;
    popupContent.style.backgroundSize = 'cover';
}

backgroundButton.addEventListener('click', changeBackground);

saveButton.addEventListener('click', () => {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    tempCanvas.width = popupContent.offsetWidth;
    tempCanvas.height = popupContent.offsetHeight;

    const bgImage = new Image();
    bgImage.src = popupContent.style.backgroundImage.slice(5, -2);
    bgImage.onload = () => {
        ctx.drawImage(bgImage, 0, 0, tempCanvas.width, tempCanvas.height);
        
        html2canvas(popupContent, { backgroundColor: null }).then((canvas) => {
            ctx.drawImage(canvas, 0, 0);
            const link = document.createElement('a');
            link.download = 'popup_nametag_image.png';
            link.href = tempCanvas.toDataURL();
            link.click();
        });
    };
});
