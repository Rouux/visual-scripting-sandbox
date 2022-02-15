import Node, { Input, Output } from './node';

const debugElement = <HTMLDivElement>document.getElementById('debug');
const canvas = <HTMLCanvasElement>document.getElementById('main-canvas');
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
  for (
    let startX = roundUp(cameraX);
    startX < bounds.width + roundUp(cameraX);
    startX += 100
  ) {
    context.fillRect(startX - cameraX, 0, 1, bounds.height);
  }
  for (
    let startY = roundUp(cameraY);
    startY < bounds.width + roundUp(cameraY);
    startY += 100
  ) {
    context.fillRect(0, startY - cameraY, bounds.width, 1);
  }

  context.fillStyle = 'rgba(200, 200, 200, 0.6)';
  context.fillRect(-cameraX, 0, 3, bounds.height);
  context.fillRect(0, -cameraY, bounds.width, 3);
}

const roundUp = (x: number, threshold = 100) => {
  if (x >= 0) {
    return x % threshold === 0 ? x : x + threshold - (x % threshold);
  }
  return x % threshold === 0 ? x : x - (x % threshold);
};

let target: Node;

canvas.addEventListener('mousedown', (ev) => {
  const x = ev.offsetX + cameraX;
  const y = ev.offsetY + cameraY;
  target = nodes.find((node) => node.inHeaderBounds(x, y));
  if (!target) mouseHeld = !nodes.some((node) => node.inBodyBounds(x, y));
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
  } else if (target) {
    target.x -= oldMouseX - mouseX;
    target.y -= oldMouseY - mouseY;
    requestAnimationFrame(draw);
  }
  oldMouseX = mouseX;
  oldMouseY = mouseY;
});

requestAnimationFrame(draw);
