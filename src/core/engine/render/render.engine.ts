import { GraphElement } from '../../../model/graph-element';
import { GraphElementArray } from '../../../model/graph-element-array';
import { GraphNode } from '../../../model/node/graph-node';
import { Node } from '../../../model/node/node';
import { roundUp } from '../../../utils/utils';
import { CameraService } from '../../service/camera.service';
import { NodeService } from '../../service/node.service';
import { PinService } from '../../service/pin.service';
import { Service } from '../../service/service';
import { LogicEngine } from '../logic/logic.engine';
import { FpsCounter } from './fps-counter';
import { GraphCanvasElement } from './graph-canvas-element';
import { Layer, Layers } from './layers';

export class RenderEngine {
  public readonly targetElement: HTMLElement;
  public readonly layers: Layers;
  public bounds: DOMRect;
  public targetNode: GraphNode;
  public drawCalls: number;

  private readonly _graphElements: GraphElementArray;
  private _logicEngine: LogicEngine;
  private _camera: CameraService;
  private _nodeService: NodeService;
  private _pinService: PinService;
  private _debugElement: HTMLSpanElement;
  private _fpsCounter: FpsCounter;

  constructor(targetElement: HTMLElement) {
    this.targetElement = targetElement;
    this.layers = new Layers(targetElement);
    this.drawCalls = 0;
    this._graphElements = new GraphElementArray();
    this._fpsCounter = new FpsCounter();
  }

  addNode(graphNode: GraphNode) {
    this._graphElements.push(graphNode);
    this._graphElements.push(...graphNode.pins);
    return graphNode;
  }

  init() {
    this._logicEngine = window._rvs.engine.logicEngine;
    this._camera = Service.retrieve(CameraService);
    this._nodeService = Service.retrieve(NodeService);
    this._pinService = Service.retrieve(PinService);
    this.resize();
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

    if (this._pinService.isCreatingLink) {
      this.layers.invalidateLayers(Layer.LINK);
    }

    this.layers.clearAll(this.bounds.width, this.bounds.height);

    this.drawBackgroundGraph(this.layers.BACKGROUND);

    // console.log(this._graphElements);
    this._graphElements.forEach((ge) => ge.draw(this, this._camera));

    // this._nodeService.nodes.forEach((node) => {
    //   node.graphNode.draw(this, this._camera);
    // });

    this._pinService.draw(
      this._camera,
      this._camera.mouseX,
      this._camera.mouseY
    );

    this.layers.reset();

    requestAnimationFrame(this.draw);
  };

  public addGraphElement(graphElement: GraphElement): void {
    this._graphElements.push(graphElement);
  }

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

  public updateCursorStyleOnNodeHover = (event: MouseEvent) => {
    const x = event.offsetX + this._camera.x;
    const y = event.offsetY + this._camera.y;
    const graphElement = this.getGraphElementAt(x, y);
    if (graphElement) {
      graphElement.mouseHover(event, x, y);
    } else if (!this._logicEngine.mouseHeld) {
      document.body.style.cursor = 'default';
    }
  };

  public getGraphElementAt(x: number, y: number): GraphElement | undefined {
    for (let index = this._graphElements.length - 1; index >= 0; index--) {
      const graphElement = this._graphElements[index];
      if (graphElement.inBounds(x, y)) return graphElement;
    }
    return undefined;
  }

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