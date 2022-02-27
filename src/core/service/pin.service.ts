import { GraphPin, PIN_SIZE } from '../../model/pin/graph-pin';
import { RenderEngine } from '../engine/render/render.engine';
import { CameraService } from './camera.service';
import { Service } from './service';

export class PinService extends Service {
  private _selectedPin: GraphPin;
  private _renderEngine: RenderEngine;

  public constructor() {
    super();
  }

  public init() {
    this._renderEngine = window._rvs.engine.renderEngine;
  }

  public get isCreatingLink(): boolean {
    return this._selectedPin !== undefined;
  }

  public set selectedPin(selectedPin: GraphPin) {
    this._selectedPin = selectedPin;
  }

  public get selectedPin() {
    return this._selectedPin;
  }

  public draw = (camera: CameraService, mouseX: number, mouseY: number) => {
    if (this.isCreatingLink && this._renderEngine.layers.LINK.needRedraw) {
      const { context } = this._renderEngine.layers.LINK;
      const { x, y } = camera.toLocalPosition(this.selectedPin);
      const offset = PIN_SIZE / 2;
      context.lineWidth = 5;
      context.strokeStyle = this.selectedPin.color;
      context.beginPath();
      context.moveTo(x + offset, y + offset);
      context.lineTo(mouseX, mouseY);
      context.stroke();
    }
  };
}
