/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/camera.service.ts":
/*!*******************************!*\
  !*** ./src/camera.service.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const service_1 = __importDefault(__webpack_require__(/*! ./core/service */ "./src/core/service.ts"));
class CameraService extends service_1.default {
    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
    }
}
exports["default"] = CameraService;


/***/ }),

/***/ "./src/core/service.ts":
/*!*****************************!*\
  !*** ./src/core/service.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Service {
    static provide(instance) {
        Service.services.set(instance.constructor.name, instance);
        return instance;
    }
    static retrieve(clazz) {
        return Service.services.get(clazz.name);
    }
}
exports["default"] = Service;
Service.services = new Map();


/***/ }),

/***/ "./src/core/utils.ts":
/*!***************************!*\
  !*** ./src/core/utils.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.roundUp = void 0;
const roundUp = (x, threshold = 100) => {
    if (x >= 0) {
        return x % threshold === 0 ? x : x + threshold - (x % threshold);
    }
    return x % threshold === 0 ? x : x - (x % threshold);
};
exports.roundUp = roundUp;


/***/ }),

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const camera_service_1 = __importDefault(__webpack_require__(/*! ./camera.service */ "./src/camera.service.ts"));
const service_1 = __importDefault(__webpack_require__(/*! ./core/service */ "./src/core/service.ts"));
const utils_1 = __webpack_require__(/*! ./core/utils */ "./src/core/utils.ts");
const node_1 = __importStar(__webpack_require__(/*! ./node */ "./src/node.ts"));
const debugElement = document.getElementById('debug');
const canvas = document.getElementById('main-canvas');
const context = canvas.getContext('2d');
let bounds;
const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bounds = canvas.getBoundingClientRect();
    camera.width = bounds.width;
    camera.height = bounds.height;
    requestAnimationFrame(draw);
};
window.addEventListener('load', resize);
window.addEventListener('resize', resize);
const camera = service_1.default.provide(new camera_service_1.default(-window.innerWidth / 2, -window.innerHeight / 2));
let mouseHeld = false;
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
    debug('x: ', camera.x, ', y: ', camera.y);
    context.clearRect(0, 0, bounds.width, bounds.height);
    drawBackgroundGraph();
    context.fillStyle = '#FF0000';
    nodes.forEach((node) => {
        node.draw(context, { x: camera.x, y: camera.y });
    });
};
function drawBackgroundGraph() {
    context.fillStyle = 'rgba(220, 220, 220, 0.2)';
    for (let startX = (0, utils_1.roundUp)(camera.x); startX < bounds.width + (0, utils_1.roundUp)(camera.x); startX += 100) {
        context.fillRect(startX - camera.x, 0, 1, bounds.height);
    }
    for (let startY = (0, utils_1.roundUp)(camera.y); startY < bounds.width + (0, utils_1.roundUp)(camera.y); startY += 100) {
        context.fillRect(0, startY - camera.y, bounds.width, 1);
    }
    context.fillStyle = 'rgba(200, 200, 200, 0.6)';
    context.fillRect(-camera.x, 0, 3, bounds.height);
    context.fillRect(0, -camera.y, bounds.width, 3);
}
let target;
canvas.addEventListener('mousedown', (event) => {
    const x = event.offsetX + camera.x;
    const y = event.offsetY + camera.y;
    target = nodes.find((node) => node.inBounds(x, y));
    if (target) {
        target.interact(event, x, y);
    }
    else {
        mouseHeld = true;
    }
});
canvas.addEventListener('focusout', () => (mouseHeld = false));
window.addEventListener('mouseup', () => {
    mouseHeld = false;
    target = undefined;
});
window.addEventListener('focusout', () => (mouseHeld = false));
window.addEventListener('mousemove', (event) => {
    const x = event.offsetX + camera.x;
    const y = event.offsetY + camera.y;
    const targetNode = nodes.find((node) => node.inBounds(x, y));
    if (targetNode) {
        targetNode.mouseHover(event, x, y);
    }
    else {
        document.body.style.cursor = 'default';
    }
});
window.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX - bounds.left;
    const mouseY = event.clientY - bounds.top;
    if (mouseHeld) {
        camera.x += oldMouseX - mouseX;
        camera.y += oldMouseY - mouseY;
        requestAnimationFrame(draw);
    }
    else if (target) {
        target.move(event, oldMouseX - mouseX, oldMouseY - mouseY);
        requestAnimationFrame(draw);
    }
    oldMouseX = mouseX;
    oldMouseY = mouseY;
});
resize();


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
        this._canBeDragged = false;
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
    interact(event, x, y) {
        this._canBeDragged = false;
        if (this._inHeaderBounds(x, y)) {
            this._canBeDragged = true;
        }
        else if (this._inBodyBounds(x, y)) {
            // Nothing so far ...
        }
    }
    move(event, x, y) {
        if (!this._canBeDragged)
            return;
        this.x -= x;
        this.y -= y;
    }
    mouseHover(event, x, y) {
        if (this._inHeaderBounds(x, y)) {
            document.body.style.cursor = 'grab';
        }
        else {
            document.body.style.cursor = 'default';
        }
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
    inBounds(x, y) {
        return (x > this.x &&
            x < this.x + this.width &&
            y > this.y &&
            y < this.y + this.height);
    }
    _inHeaderBounds(x, y) {
        return (x > this.x &&
            x < this.x + this.width &&
            y > this.y &&
            y < this.y + HEADER_MARGIN);
    }
    _inBodyBounds(x, y) {
        return (x > this.x &&
            x < this.x + this.width &&
            y > this.y + HEADER_MARGIN &&
            y < this.y + this.height);
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