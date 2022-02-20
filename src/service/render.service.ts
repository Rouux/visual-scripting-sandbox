import Service from '../core/service';
import { MouseButton, roundUp } from '../core/utils';
import GraphNode from '../model/node/graph-node';
import CameraService from './camera.service';
import NodeService from './node.service';
import PinService from './pin.service';

export default class RenderService extends Service {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public bounds: DOMRect;
  public targetNode: GraphNode;
  public mouseHeld: boolean;
  public oldMouseX: number;
  public oldMouseY: number;
  public drawCalls: number;

  private _camera: CameraService;
  private _nodeService: NodeService;
  private _pinService: PinService;
  private _debugElement: HTMLSpanElement;

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
    this._camera = Service.retrieve(CameraService);
    this._nodeService = Service.retrieve(NodeService);
    this._pinService = Service.retrieve(PinService);
    this.initListeners();
    this.resize();
  }

  private initListeners() {
    window.addEventListener('load', this.resize);
    window.addEventListener('resize', this.resize);
    window.addEventListener('focusout', () => (this.mouseHeld = false));
    window.addEventListener('mousemove', (event) => {
      this._camera.mouseX = event.clientX - this.bounds.left;
      this._camera.mouseY = event.clientY - this.bounds.top;
      const mouseDeltaX = this.oldMouseX - this._camera.mouseX;
      const mouseDeltaY = this.oldMouseY - this._camera.mouseY;

      if (this.mouseHeld && event.buttons === 4) {
        this._camera.move(mouseDeltaX, mouseDeltaY);
        requestAnimationFrame(this.draw);
      } else if (this.targetNode) {
        this.targetNode.move(event, -mouseDeltaX, -mouseDeltaY);
        requestAnimationFrame(this.draw);
      }
      this.oldMouseX = this._camera.mouseX;
      this.oldMouseY = this._camera.mouseY;
    });
    window.addEventListener('mouseup', () => {
      this.mouseHeld = false;
      this.targetNode = undefined;
      this._pinService.selectedPin = undefined;
      requestAnimationFrame(this.draw);
    });
    this.canvas.addEventListener(
      'mousemove',
      this.updateCursorStyleOnNodeHover
    );
    this.canvas.addEventListener('mousedown', (event) => {
      const localX = event.offsetX + this._camera.x;
      const localY = event.offsetY + this._camera.y;
      this.targetNode = this._nodeService.getGraphNodeAt(localX, localY);
      if (this.targetNode) {
        this._nodeService.selectNode(this.targetNode.node);
        this.targetNode.mousedown(event, localX, localY);
      } else {
        this.mouseHeld = true;
        if (event.button === MouseButton.WHEEL) {
          document.body.style.cursor = 'crosshair';
        }
      }
    });
    this.canvas.addEventListener('dblclick', (event) => {
      const localX = event.offsetX + this._camera.x;
      const localY = event.offsetY + this._camera.y;
      const targetNode = this._nodeService.getGraphNodeAt(localX, localY);
      if (targetNode) {
        targetNode.dblclick(event, localX, localY);
      }
    });
    this.canvas.addEventListener('contextmenu', (event) =>
      event.preventDefault()
    );
    this.canvas.addEventListener('mouseup', (event) => {
      const localX = event.offsetX + this._camera.x;
      const localY = event.offsetY + this._camera.y;
      const targetNode = this._nodeService.getGraphNodeAt(localX, localY);
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
    this._camera.width = this.bounds.width;
    this._camera.height = this.bounds.height;
    requestAnimationFrame(this.draw);
  };

  draw = () => {
    this.debug(
      `x: ${this._camera.x}, y: ${this._camera.y}, draws : ${this.drawCalls++}`
    );
    this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);

    this.drawBackgroundGraph();

    this.context.fillStyle = '#FF0000';
    this._nodeService.nodes.forEach((node) => {
      node.graphNode.draw(this.context, this._camera);
    });

    this._pinService.draw(this._camera.mouseX, this._camera.mouseY);
  };

  private debug = (...args: unknown[]) => {
    this.debugElement.textContent = args.join('');
  };

  private get debugElement() {
    if (!this._debugElement) {
      this._debugElement = <HTMLSpanElement>document.getElementById('debug');
    }
    return this._debugElement;
  }

  private updateCursorStyleOnNodeHover = (event: MouseEvent) => {
    const x = event.offsetX + this._camera.x;
    const y = event.offsetY + this._camera.y;
    const targetNode = this._nodeService.getGraphNodeAt(x, y);
    if (targetNode) {
      targetNode.mouseHover(event, x, y);
    } else if (!this.mouseHeld) {
      document.body.style.cursor = 'default';
    }
  };

  private drawBackgroundGraph() {
    this.context.fillStyle = 'rgba(220, 220, 220, 0.2)';
    for (
      let startX = roundUp(this._camera.x);
      startX < this.bounds.width + roundUp(this._camera.x);
      startX += 100
    ) {
      this.context.fillRect(startX - this._camera.x, 0, 1, this.bounds.height);
    }
    for (
      let startY = roundUp(this._camera.y);
      startY < this.bounds.width + roundUp(this._camera.y);
      startY += 100
    ) {
      this.context.fillRect(0, startY - this._camera.y, this.bounds.width, 1);
    }

    this.context.fillStyle = 'rgba(200, 200, 200, 0.6)';
    this.context.fillRect(-this._camera.x, 0, 3, this.bounds.height);
    this.context.fillRect(0, -this._camera.y, this.bounds.width, 3);
  }
}
