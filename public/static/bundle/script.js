/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

const debugElement = document.getElementById('debug');
const canvas = document.getElementById('main-canvas');
const context = canvas.getContext('2d');
let bounds = canvas.getBoundingClientRect();
const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bounds = canvas.getBoundingClientRect();
    requestAnimationFrame(draw);
};
window.addEventListener('load', resize);
window.addEventListener('resize', resize);
let mouseHeld = false;
let cameraX = -window.innerWidth / 2;
let cameraY = -window.innerHeight / 2;
let oldMouseX = 0;
let oldMouseY = 0;
const rects = [
    {
        x: 0,
        y: 0,
        width: 50,
        height: 50
    }
];
const debug = (...text) => {
    debugElement.innerText = text.join('');
};
const draw = () => {
    debug('x: ', cameraX, ', y: ', cameraY);
    context.clearRect(0, 0, bounds.width, bounds.height);
    drawBackgroundGraph();
    context.fillStyle = '#FF0000';
    rects.forEach((rect) => context.fillRect(rect.x - cameraX, rect.y - cameraY, rect.width, rect.height));
};
function drawBackgroundGraph() {
    context.fillStyle = 'rgba(220, 220, 220, 0.2)';
    for (let startX = roundUp(cameraX); startX < bounds.width + roundUp(cameraX); startX += 100) {
        context.fillRect(startX - cameraX, 0, 1, bounds.height);
    }
    for (let startY = roundUp(cameraY); startY < bounds.width + roundUp(cameraY); startY += 100) {
        context.fillRect(0, startY - cameraY, bounds.width, 1);
    }
    context.fillStyle = 'rgba(200, 200, 200, 0.6)';
    context.fillRect(-cameraX, 0, 3, bounds.height);
    context.fillRect(0, -cameraY, bounds.width, 3);
}
const roundUp = (x, threshold = 100) => {
    if (x >= 0) {
        return x % threshold === 0 ? x : x + threshold - (x % threshold);
    }
    return x % threshold === 0 ? x : x - (x % threshold);
};
canvas.addEventListener('mousedown', () => (mouseHeld = true));
canvas.addEventListener('mouseup', () => (mouseHeld = false));
canvas.addEventListener('focusout', () => (mouseHeld = false));
window.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX - bounds.left;
    const mouseY = event.clientY - bounds.top;
    if (mouseHeld) {
        cameraX += oldMouseX - mouseX;
        cameraY += oldMouseY - mouseY;
        requestAnimationFrame(draw);
    }
    oldMouseX = mouseX;
    oldMouseY = mouseY;
});
requestAnimationFrame(draw);

/******/ })()
;
//# sourceMappingURL=script.js.map