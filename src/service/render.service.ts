import Service from '../core/service';
import { MouseButton, roundUp } from '../core/utils';
import GraphNode from '../model/node/graph-node';
import CameraService from './camera.service';
import DebugService from './debug.service';
import NodeService from './node.service';
import PinService from './pin.service';

export default class RenderService extends Service {
  camera: CameraService;
  debugService: DebugService;
  nodeService: NodeService;
  pinService: PinService;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  bounds: DOMRect;
  targetNode: GraphNode;
  mouseHeld: boolean;
  oldMouseX: number;
  oldMouseY: number;
  drawCalls: number;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.mouseHeld = false;
    this.oldMouseX = 0;
    this.oldMouseY = 0;
    this.drawCalls = 0;
  }

  init() {
    this.camera = Service.retrieve(CameraService);
    this.debugService = Service.retrieve(DebugService);
    this.nodeService = Service.retrieve(NodeService);
    this.pinService = Service.retrieve(PinService);
    this.initListeners();
    this.resize();
  }

  private initListeners() {
    window.addEventListener('load', this.resize);
    window.addEventListener('resize', this.resize);
    window.addEventListener('focusout', () => (this.mouseHeld = false));
    window.addEventListener('mousemove', (event) => {
      this.camera.mouseX = event.clientX - this.bounds.left;
      this.camera.mouseY = event.clientY - this.bounds.top;
      const mouseDeltaX = this.oldMouseX - this.camera.mouseX;
      const mouseDeltaY = this.oldMouseY - this.camera.mouseY;

      if (this.mouseHeld && event.buttons === 4) {
        this.camera.move(mouseDeltaX, mouseDeltaY);
        requestAnimationFrame(this.draw);
      } else if (this.targetNode) {
        this.targetNode.move(event, -mouseDeltaX, -mouseDeltaY);
        requestAnimationFrame(this.draw);
      }
      this.oldMouseX = this.camera.mouseX;
      this.oldMouseY = this.camera.mouseY;
    });
    window.addEventListener('mouseup', () => {
      this.mouseHeld = false;
      this.targetNode = undefined;
      this.pinService.selectedPin = undefined;
      requestAnimationFrame(this.draw);
    });
    this.canvas.addEventListener(
      'mousemove',
      this.updateCursorStyleOnNodeHover
    );
    this.canvas.addEventListener('mousedown', (event) => {
      const localX = event.offsetX + this.camera.x;
      const localY = event.offsetY + this.camera.y;
      this.targetNode = this.nodeService.getGraphNodeAt(localX, localY);
      if (this.targetNode) {
        this.nodeService.selectNode(this.targetNode.node);
        this.targetNode.mousedown(event, localX, localY);
      } else {
        this.mouseHeld = true;
        if (event.button === MouseButton.WHEEL) {
          document.body.style.cursor = 'crosshair';
        }
      }
    });
    this.canvas.addEventListener('dblclick', (event) => {
      const localX = event.offsetX + this.camera.x;
      const localY = event.offsetY + this.camera.y;
      const targetNode = this.nodeService.getGraphNodeAt(localX, localY);
      if (targetNode) {
        targetNode.dblclick(event, localX, localY);
      }
    });
    this.canvas.addEventListener('contextmenu', (event) =>
      event.preventDefault()
    );
    this.canvas.addEventListener('mouseup', (event) => {
      const localX = event.offsetX + this.camera.x;
      const localY = event.offsetY + this.camera.y;
      const targetNode = this.nodeService.getGraphNodeAt(localX, localY);
      if (targetNode) {
        targetNode.mouseup(event, localX, localY);
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
    this.debugService.debug(
      'x: ',
      this.camera.x,
      ', y: ',
      this.camera.y,
      ', draws : ',
      this.drawCalls++
    );
    this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);

    this.drawBackgroundGraph();

    this.context.fillStyle = '#FF0000';
    this.nodeService.nodes.forEach((node) => {
      node.graphNode.draw(this.context, this.camera);
    });

    this.pinService.draw(this.camera.mouseX, this.camera.mouseY);
  };

  private updateCursorStyleOnNodeHover = (event: MouseEvent) => {
    const x = event.offsetX + this.camera.x;
    const y = event.offsetY + this.camera.y;
    const targetNode = this.nodeService.getGraphNodeAt(x, y);
    if (targetNode) {
      targetNode.mouseHover(event, x, y);
    } else if (!this.mouseHeld) {
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
