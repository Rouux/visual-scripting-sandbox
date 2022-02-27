import { GraphNode } from '../../../model/node/graph-node';
import { MouseButton } from '../../../utils/utils';
import { CameraService } from '../../service/camera.service';
import { NodeService } from '../../service/node.service';
import { PinService } from '../../service/pin.service';
import { Service } from '../../service/service';
import { Layer } from '../render/layers';
import { RenderEngine } from '../render/render.engine';

export class LogicEngine {
  public targetNode: GraphNode;
  public mouseHeld: boolean;
  public oldMouseX: number;
  public oldMouseY: number;

  private _renderEngine: RenderEngine;
  private _camera: CameraService;
  private _nodeService: NodeService;
  private _pinService: PinService;

  constructor() {
    this.mouseHeld = false;
    this.oldMouseX = 0;
    this.oldMouseY = 0;
  }

  public init(): void {
    this._renderEngine = window._rvs.engine.renderEngine;
    this._camera = Service.retrieve(CameraService);
    this._nodeService = Service.retrieve(NodeService);
    this._pinService = Service.retrieve(PinService);
    this.initListeners();
  }

  private initListeners(): void {
    window.addEventListener('load', this._renderEngine.resize);
    window.addEventListener('resize', this._renderEngine.resize);
    window.addEventListener('focusout', () => (this.mouseHeld = false));
    window.addEventListener('mousemove', (event) => {
      this._camera.mouseX = event.clientX - this._renderEngine.bounds.left;
      this._camera.mouseY = event.clientY - this._renderEngine.bounds.top;
      const mouseDeltaX = this.oldMouseX - this._camera.mouseX;
      const mouseDeltaY = this.oldMouseY - this._camera.mouseY;

      if (this.mouseHeld && event.buttons === 4) {
        this._renderEngine.layers.invalidateAll();
        this._camera.move(mouseDeltaX, mouseDeltaY);
      } else if (this.targetNode) {
        this._renderEngine.layers.invalidateLayers(Layer.NODE, Layer.LINK);
        this.targetNode.move(event, -mouseDeltaX, -mouseDeltaY);
      }
      this.oldMouseX = this._camera.mouseX;
      this.oldMouseY = this._camera.mouseY;
    });
    window.addEventListener('mouseup', () => {
      this.mouseHeld = false;
      this.targetNode = undefined;
      this._pinService.selectedPin = undefined;
      this._renderEngine.layers.invalidateAll();
    });
    this._renderEngine.layers.HUD.nativeElement.addEventListener(
      'mousemove',
      this._renderEngine.updateCursorStyleOnNodeHover
    );
    this._renderEngine.layers.HUD.nativeElement.addEventListener(
      'mousedown',
      (event) => {
        const localX = event.offsetX + this._camera.x;
        const localY = event.offsetY + this._camera.y;
        const graphElement = this._renderEngine.getGraphElementAt(
          localX,
          localY
        );
        if (graphElement) {
          if (graphElement instanceof GraphNode) {
            this.targetNode = graphElement;
            this._nodeService.selectNode(this.targetNode.node);
          }
          graphElement.mouseDown(event, localX, localY);
        } else {
          this._renderEngine.layers.invalidateAll();
          this.mouseHeld = true;
          if (event.button === MouseButton.WHEEL) {
            document.body.style.cursor = 'crosshair';
          }
        }
      }
    );
    this._renderEngine.layers.HUD.nativeElement.addEventListener(
      'dblclick',
      (event) => {
        const localX = event.offsetX + this._camera.x;
        const localY = event.offsetY + this._camera.y;
        const graphElement = this._renderEngine.getGraphElementAt(
          localX,
          localY
        );
        if (graphElement) {
          graphElement.dblClick(event, localX, localY);
        }
      }
    );
    this._renderEngine.layers.HUD.nativeElement.addEventListener(
      'contextmenu',
      (event) => event.preventDefault()
    );
    this._renderEngine.layers.HUD.nativeElement.addEventListener(
      'mouseup',
      (event) => {
        const localX = event.offsetX + this._camera.x;
        const localY = event.offsetY + this._camera.y;
        const graphElement = this._renderEngine.getGraphElementAt(
          localX,
          localY
        );
        if (graphElement) {
          graphElement.mouseUp(event, localX, localY);
        }
      }
    );
    this._renderEngine.layers.HUD.nativeElement.addEventListener(
      'focusout',
      () => (this.mouseHeld = false)
    );
  }
}
