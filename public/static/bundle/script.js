/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_1 = __importStar(__webpack_require__(/*! ./node */ "./src/node.ts"));
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
const nodes = [
    new node_1.default('sysout')
        .addInput(new node_1.Input('text', 'hello world'))
        .addInput(new node_1.Input('text', 'hello world'))
        .addInput(new node_1.Input('text', 'hello world'))
        .addOutput(new node_1.Output('text'))
];
const debug = (...args) => {
    debugElement.innerText = args.join('');
};
const draw = () => {
    debug('x: ', cameraX, ', y: ', cameraY);
    context.clearRect(0, 0, bounds.width, bounds.height);
    drawBackgroundGraph();
    context.fillStyle = '#FF0000';
    nodes.forEach((node) => {
        node.draw(context, { x: cameraX, y: cameraY });
    });
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
let target;
canvas.addEventListener('mousedown', (ev) => {
    const x = ev.offsetX + cameraX;
    const y = ev.offsetY + cameraY;
    target = nodes.find((node) => node.inHeaderBounds(x, y));
    if (!target)
        mouseHeld = !nodes.some((node) => node.inBodyBounds(x, y));
});
canvas.addEventListener('mouseup', () => {
    mouseHeld = false;
    target = undefined;
});
canvas.addEventListener('focusout', () => (mouseHeld = false));
window.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX - bounds.left;
    const mouseY = event.clientY - bounds.top;
    if (mouseHeld) {
        cameraX += oldMouseX - mouseX;
        cameraY += oldMouseY - mouseY;
        requestAnimationFrame(draw);
    }
    else if (target) {
        target.x -= oldMouseX - mouseX;
        target.y -= oldMouseY - mouseY;
        requestAnimationFrame(draw);
    }
    oldMouseX = mouseX;
    oldMouseY = mouseY;
});
requestAnimationFrame(draw);


/***/ }),

/***/ "./src/node.ts":
/*!*********************!*\
  !*** ./src/node.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Output = exports.Input = void 0;
const HEADER_MARGIN = 25;
class Node {
    constructor(name, x = 0, y = 0) {
        this._inputs = [];
        this._outputs = [];
        this.name = name;
        this.x = x;
        this.y = y;
    }
    addInput(input) {
        this._inputs.push(input);
        return this;
    }
    addOutput(output) {
        this._outputs.push(output);
        return this;
    }
    inHeaderBounds(x, y) {
        return (x > this.x &&
            x < this.x + this.width &&
            y > this.y &&
            y < this.y + HEADER_MARGIN);
    }
    inBodyBounds(x, y) {
        return (x > this.x &&
            x < this.x + this.width &&
            y > this.y + HEADER_MARGIN &&
            y < this.y + this.height);
    }
    draw(context, camera) {
        context.fillStyle = 'red';
        this.width = 100;
        this.height = Math.max(HEADER_MARGIN +
            10 +
            Math.max(this._inputs.length, this._outputs.length) * 20, 60);
        context.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        context.font = '18px arial';
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.fillText(this.name, this.x + 50 - camera.x, this.y + 15 - camera.y, this.width);
        this._inputs.forEach((input, index) => {
            context.fillStyle = 'purple';
            context.fillRect(this.x + 5 - camera.x, this.y + HEADER_MARGIN + index * 22 - camera.y, 20, 20);
        });
        this._outputs.forEach((output, index) => {
            context.fillStyle = 'cyan';
            context.fillRect(this.x + this.width - 20 - 5 - camera.x, this.y + HEADER_MARGIN + index * 10 - camera.y, 20, 20);
        });
    }
}
exports["default"] = Node;
class Input {
    constructor(name, defaultValue = undefined) {
        this.name = name;
        this.defaultValue = defaultValue;
    }
}
exports.Input = Input;
class Output {
    constructor(name) {
        this.name = name;
    }
}
exports.Output = Output;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=script.js.map