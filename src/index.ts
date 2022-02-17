import CameraService from './camera.service';
import Service from './core/service';
import { roundUp } from './core/utils';
import Node, { Input, Output } from './node';

const debugElement = <HTMLDivElement>document.getElementById('debug');
const canvas = <HTMLCanvasElement>document.getElementById('main-canvas');
const context = canvas.getContext('2d');
let bounds: DOMRect;

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

const camera = Service.provide(
  new CameraService(-window.innerWidth / 2, -window.innerHeight / 2)
);

let mouseHeld = false;
let oldMouseX = 0;
let oldMouseY = 0;

const nodes = [
  new Node('sysout')
    .addInput(new Input<string>('text', 'hello world'))
    .addInput(new Input<string>('text', 'hello world'))
    .addInput(new Input<string>('text', 'hello world'))
    .addOutput(new Output<string>('text'))
];

const debug = (...args: unknown[]) => {
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
  for (
    let startX = roundUp(camera.x);
    startX < bounds.width + roundUp(camera.x);
    startX += 100
  ) {
    context.fillRect(startX - camera.x, 0, 1, bounds.height);
  }
  for (
    let startY = roundUp(camera.y);
    startY < bounds.width + roundUp(camera.y);
    startY += 100
  ) {
    context.fillRect(0, startY - camera.y, bounds.width, 1);
  }

  context.fillStyle = 'rgba(200, 200, 200, 0.6)';
  context.fillRect(-camera.x, 0, 3, bounds.height);
  context.fillRect(0, -camera.y, bounds.width, 3);
}

let target: Node;

canvas.addEventListener('mousedown', (event) => {
  const x = event.offsetX + camera.x;
  const y = event.offsetY + camera.y;
  target = nodes.find((node) => node.inBounds(x, y));
  if (target) {
    target.interact(event, x, y);
  } else {
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
  } else {
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
  } else if (target) {
    target.move(event, oldMouseX - mouseX, oldMouseY - mouseY);
    requestAnimationFrame(draw);
  }
  oldMouseX = mouseX;
  oldMouseY = mouseY;
});

resize();
