import GraphNode from '../../model/node/graph-node';
import { MouseButton, roundUp } from '../../utils/utils';
import CameraService from '../camera.service';
import NodeService from '../node.service';
import PinService from '../pin.service';
import Service from '../service';
import FpsCounter from './fps-counter';
import GraphCanvasElement from './graph-canvas-element';
import Layers, { Layer } from './layers';

export default class RenderService extends Service {
  public readonly targetElement: HTMLElement;
  public readonly layers: Layers;
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
  private _fpsCounter: FpsCounter;

  constructor(targetElement: HTMLElement) {
    super();
    this.targetElement = targetElement;
    this.layers = new Layers(targetElement);
    this.mouseHeld = false;
    this.oldMouseX = 0;
    this.oldMouseY = 0;
    this.drawCalls = 0;
    this._fpsCounter = new FpsCounter();
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
        this.layers.invalidateAll();
        this._camera.move(mouseDeltaX, mouseDeltaY);
      } else if (this.targetNode) {
        this.layers.invalidateLayers(Layer.NODE, Layer.LINK);
        this.targetNode.move(event, -mouseDeltaX, -mouseDeltaY);
      }
      this.oldMouseX = this._camera.mouseX;
      this.oldMouseY = this._camera.mouseY;
    });
    window.addEventListener('mouseup', () => {
      this.mouseHeld = false;
      this.targetNode = undefined;
      this._pinService.selectedPin = undefined;
      this.layers.invalidateAll();
    });
    this.layers.HUD.nativeElement.addEventListener(
      'mousemove',
      this.updateCursorStyleOnNodeHover
    );
    this.layers.HUD.nativeElement.addEventListener('mousedown', (event) => {
      const localX = event.offsetX + this._camera.x;
      const localY = event.offsetY + this._camera.y;
      this.targetNode = this._nodeService.getGraphNodeAt(localX, localY);
      if (this.targetNode) {
        this._nodeService.selectNode(this.targetNode.node);
        this.targetNode.mousedown(event, localX, localY);
      } else {
        this.layers.invalidateAll();
        this.mouseHeld = true;
        if (event.button === MouseButton.WHEEL) {
          document.body.style.cursor = 'crosshair';
        }
      }
    });
    this.layers.HUD.nativeElement.addEventListener('dblclick', (event) => {
      const localX = event.offsetX + this._camera.x;
      const localY = event.offsetY + this._camera.y;
      const targetNode = this._nodeService.getGraphNodeAt(localX, localY);
      if (targetNode) {
        targetNode.dblclick(event, localX, localY);
      }
    });
    this.layers.HUD.nativeElement.addEventListener('contextmenu', (event) =>
      event.preventDefault()
    );
    this.layers.HUD.nativeElement.addEventListener('mouseup', (event) => {
      const localX = event.offsetX + this._camera.x;
      const localY = event.offsetY + this._camera.y;
      const targetNode = this._nodeService.getGraphNodeAt(localX, localY);
      if (targetNode) {
        targetNode.mouseup(event, localX, localY);
      }
    });
    this.layers.HUD.nativeElement.addEventListener(
      'focusout',
      () => (this.mouseHeld = false)
    );
  }

  resize = () => {
    this.layers.invalidateAll();
    this.layers.resizeAll(window.innerWidth, window.innerHeight);
    this.bounds = this.layers.HUD.getBoundingClientRect();
    this._camera.width = this.bounds.width;
    this._camera.height = this.bounds.height;
  };

  draw = () => {
    this._fpsCounter.frameUpdate();
    this.debug(
      `x: ${this._camera.x}, y: ${
        this._camera.y
      }, fps : ${this._fpsCounter.fixedFps()}`
    );

    this.layers.clearAll(this.bounds.width, this.bounds.height);

    if (this._pinService.isCreatingLink) {
      this.layers.invalidateLayers(Layer.LINK);
    }
    this.drawBackgroundGraph(this.layers.BACKGROUND);

    this._nodeService.nodes.forEach((node) => {
      node.graphNode.draw(this, this._camera);
    });

    this._pinService.draw(this._camera.mouseX, this._camera.mouseY);

    this.layers.reset();

    requestAnimationFrame(this.draw);
  };

  private debug = (...args: unknown[]) => {
    const text = args.join('');
    if (this.debugElement.textContent !== text) {
      this.debugElement.textContent = text;
    }
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

  private drawBackgroundGraph(graphCanvas: GraphCanvasElement): void {
    if (!graphCanvas.needRedraw) return;
    const { context } = graphCanvas;
    context.canvas.style.background = 'rgb(48, 48, 48)';

    context.fillStyle = 'rgba(220, 220, 220, 0.2)';
    for (
      let startX = roundUp(this._camera.x);
      startX < this.bounds.width + roundUp(this._camera.x);
      startX += 100
    ) {
      context.fillRect(startX - this._camera.x, 0, 1, this.bounds.height);
    }
    for (
      let startY = roundUp(this._camera.y);
      startY < this.bounds.width + roundUp(this._camera.y);
      startY += 100
    ) {
      context.fillRect(0, startY - this._camera.y, this.bounds.width, 1);
    }

    context.fillStyle = 'rgba(200, 200, 200, 0.8)';
    context.fillRect(-this._camera.x, 0, 3, this.bounds.height);
    context.fillRect(0, -this._camera.y, this.bounds.width, 3);
  }
}
