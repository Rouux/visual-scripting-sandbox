import CameraService from './camera.service';
import Service from '../core/service';
import DebugService from './debug.service';
import Node, { Input, Output } from '../node';
import { roundUp } from '../core/utils';

export default class RenderService extends Service {
  camera: CameraService;
  debugService: DebugService;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  bounds: DOMRect;
  nodes: Node[];
  targetNode: Node;
  mouseHeld: boolean;
  oldMouseX: number;
  oldMouseY: number;

  constructor(
    camera: CameraService,
    debugService: DebugService,
    canvas: HTMLCanvasElement
  ) {
    super();
    this.camera = camera;
    this.debugService = debugService;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.mouseHeld = false;
    this.oldMouseX = 0;
    this.oldMouseY = 0;

    this.nodes = [
      new Node('sysout')
        .addInput(new Input<string>('text', 'hello world'))
        .addInput(new Input<string>('text', 'hello world'))
        .addInput(new Input<string>('text', 'hello world'))
        .addOutput(new Output<string>('text'))
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
      } else if (this.targetNode) {
        this.targetNode.move(event, -mouseDeltaX, -mouseDeltaY);
        requestAnimationFrame(this.draw);
      }
      this.oldMouseX = mouseX;
      this.oldMouseY = mouseY;
    });

    this.canvas.addEventListener('mousedown', (event) => {
      const localX = event.offsetX + this.camera.x;
      const localY = event.offsetY + this.camera.y;
      this.targetNode = this.nodes.find((node) =>
        node.inBounds(localX, localY)
      );
      if (this.targetNode) {
        this.targetNode.interact(event, localX, localY);
      } else {
        this.mouseHeld = true;
      }
    });
    this.canvas.addEventListener('focusout', () => (this.mouseHeld = false));
  }

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.bounds = this.canvas.getBoundingClientRect();
    this.camera.width = this.bounds.width;
    this.camera.height = this.bounds.height;
    requestAnimationFrame(this.draw);
  };

  draw = () => {
    this.debugService.debug('x: ', this.camera.x, ', y: ', this.camera.y);
    this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);

    this.drawBackgroundGraph();

    this.context.fillStyle = '#FF0000';
    this.nodes.forEach((node) => {
      node.draw(this.context, { x: this.camera.x, y: this.camera.y });
    });
  };

  private updateCursorStyleOnNodeHover = (event: MouseEvent) => {
    const x = event.offsetX + this.camera.x;
    const y = event.offsetY + this.camera.y;
    const targetNode = this.nodes.find((node) => node.inBounds(x, y));
    if (targetNode) {
      targetNode.mouseHover(event, x, y);
    } else {
      document.body.style.cursor = 'default';
    }
  };

  private drawBackgroundGraph() {
    this.context.fillStyle = 'rgba(220, 220, 220, 0.2)';
    for (
      let startX = roundUp(this.camera.x);
      startX < this.bounds.width + roundUp(this.camera.x);
      startX += 100
    ) {
      this.context.fillRect(startX - this.camera.x, 0, 1, this.bounds.height);
    }
    for (
      let startY = roundUp(this.camera.y);
      startY < this.bounds.width + roundUp(this.camera.y);
      startY += 100
    ) {
      this.context.fillRect(0, startY - this.camera.y, this.bounds.width, 1);
    }

    this.context.fillStyle = 'rgba(200, 200, 200, 0.6)';
    this.context.fillRect(-this.camera.x, 0, 3, this.bounds.height);
    this.context.fillRect(0, -this.camera.y, this.bounds.width, 3);
  }
}