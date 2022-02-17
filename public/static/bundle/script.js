/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
// eslint-disable-next-line import/prefer-default-export
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


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const camera_service_1 = __importDefault(__webpack_require__(/*! ./service/camera.service */ "./src/service/camera.service.ts"));
const service_1 = __importDefault(__webpack_require__(/*! ./core/service */ "./src/core/service.ts"));
const debug_service_1 = __importDefault(__webpack_require__(/*! ./service/debug.service */ "./src/service/debug.service.ts"));
const render_service_1 = __importDefault(__webpack_require__(/*! ./service/render.service */ "./src/service/render.service.ts"));
const debug = service_1.default.provide(new debug_service_1.default());
const camera = service_1.default.provide(new camera_service_1.default(-window.innerWidth / 2, -window.innerHeight / 2));
const canvas = document.getElementById('main-canvas');
const render = service_1.default.provide(new render_service_1.default(camera, debug, canvas));
render.draw();


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
        this._canBeDragged = false;
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
    move(event, deltaX, deltaY) {
        if (!this._canBeDragged)
            return;
        this.x += deltaX;
        this.y += deltaY;
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


/***/ }),

/***/ "./src/service/camera.service.ts":
/*!***************************************!*\
  !*** ./src/service/camera.service.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const service_1 = __importDefault(__webpack_require__(/*! ../core/service */ "./src/core/service.ts"));
class CameraService extends service_1.default {
    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
    }
    move(deltaX, deltaY) {
        this.x += deltaX;
        this.y += deltaY;
    }
}
exports["default"] = CameraService;


/***/ }),

/***/ "./src/service/debug.service.ts":
/*!**************************************!*\
  !*** ./src/service/debug.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const service_1 = __importDefault(__webpack_require__(/*! ../core/service */ "./src/core/service.ts"));
class DebugService extends service_1.default {
    constructor() {
        super(...arguments);
        this.debug = (...args) => {
            this.debugElement.innerText = args.join('');
        };
    }
    get debugElement() {
        if (!this._debugElement) {
            this._debugElement = document.getElementById('debug');
        }
        return this._debugElement;
    }
}
exports["default"] = DebugService;


/***/ }),

/***/ "./src/service/render.service.ts":
/*!***************************************!*\
  !*** ./src/service/render.service.ts ***!
  \***************************************/
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
const service_1 = __importDefault(__webpack_require__(/*! ../core/service */ "./src/core/service.ts"));
const node_1 = __importStar(__webpack_require__(/*! ../node */ "./src/node.ts"));
const utils_1 = __webpack_require__(/*! ../core/utils */ "./src/core/utils.ts");
class RenderService extends service_1.default {
    constructor(camera, debugService, canvas) {
        super();
        this.resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.bounds = this.canvas.getBoundingClientRect();
            this.camera.width = this.bounds.width;
            this.camera.height = this.bounds.height;
            requestAnimationFrame(this.draw);
        };
        this.draw = () => {
            this.debugService.debug('x: ', this.camera.x, ', y: ', this.camera.y);
            this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);
            this.drawBackgroundGraph();
            this.context.fillStyle = '#FF0000';
            this.nodes.forEach((node) => {
                node.draw(this.context, { x: this.camera.x, y: this.camera.y });
            });
        };
        this.updateCursorStyleOnNodeHover = (event) => {
            const x = event.offsetX + this.camera.x;
            const y = event.offsetY + this.camera.y;
            const targetNode = this.nodes.find((node) => node.inBounds(x, y));
            if (targetNode) {
                targetNode.mouseHover(event, x, y);
            }
            else {
                document.body.style.cursor = 'default';
            }
        };
        this.camera = camera;
        this.debugService = debugService;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.mouseHeld = false;
        this.oldMouseX = 0;
        this.oldMouseY = 0;
        this.nodes = [
            new node_1.default('sysout')
                .addInput(new node_1.Input('text', 'hello world'))
                .addInput(new node_1.Input('text', 'hello world'))
                .addInput(new node_1.Input('text', 'hello world'))
                .addOutput(new node_1.Output('text'))
        ];
        this.initListeners();
        this.resize();
    }
    initListeners() {
        window.addEventListener('load', this.resize);
        window.addEventListener('resize', this.resize);
        window.addEventListener('mouseup', () => {
            this.mouseHeld = false;
            this.targetNode = undefined;
        });
        window.addEventListener('focusout', () => (this.mouseHeld = false));
        window.addEventListener('mousemove', this.updateCursorStyleOnNodeHover);
        window.addEventListener('mousemove', (event) => {
            const mouseX = event.clientX - this.bounds.left;
            const mouseY = event.clientY - this.bounds.top;
            const mouseDeltaX = this.oldMouseX - mouseX;
            const mouseDeltaY = this.oldMouseY - mouseY;
            if (this.mouseHeld) {
                this.camera.move(mouseDeltaX, mouseDeltaY);
                requestAnimationFrame(this.draw);
            }
            else if (this.targetNode) {
                this.targetNode.move(event, -mouseDeltaX, -mouseDeltaY);
                requestAnimationFrame(this.draw);
            }
            this.oldMouseX = mouseX;
            this.oldMouseY = mouseY;
        });
        this.canvas.addEventListener('mousedown', (event) => {
            const localX = event.offsetX + this.camera.x;
            const localY = event.offsetY + this.camera.y;
            this.targetNode = this.nodes.find((node) => node.inBounds(localX, localY));
            if (this.targetNode) {
                this.targetNode.interact(event, localX, localY);
            }
            else {
                this.mouseHeld = true;
            }
        });
        this.canvas.addEventListener('focusout', () => (this.mouseHeld = false));
    }
    drawBackgroundGraph() {
        this.context.fillStyle = 'rgba(220, 220, 220, 0.2)';
        for (let startX = (0, utils_1.roundUp)(this.camera.x); startX < this.bounds.width + (0, utils_1.roundUp)(this.camera.x); startX += 100) {
            this.context.fillRect(startX - this.camera.x, 0, 1, this.bounds.height);
        }
        for (let startY = (0, utils_1.roundUp)(this.camera.y); startY < this.bounds.width + (0, utils_1.roundUp)(this.camera.y); startY += 100) {
            this.context.fillRect(0, startY - this.camera.y, this.bounds.width, 1);
        }
        this.context.fillStyle = 'rgba(200, 200, 200, 0.6)';
        this.context.fillRect(-this.camera.x, 0, 3, this.bounds.height);
        this.context.fillRect(0, -this.camera.y, this.bounds.width, 3);
    }
}
exports["default"] = RenderService;


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