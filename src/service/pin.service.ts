import { PIN_SIZE } from '../model/pin/graph-pin';
import Pin from '../model/pin/pin';
import { Layer } from './render/layers';
import RenderService from './render/render.service';
import Service from './service';

export default class PinService extends Service {
  private _selectedPin: Pin;
  public renderService: RenderService;

  public constructor() {
    super();
  }

  public init() {
    this.renderService = Service.retrieve(RenderService);
  }

  public get isCreatingLink(): boolean {
    return this._selectedPin !== undefined;
  }

  public set selectedPin(selectedPin: Pin) {
    this._selectedPin = selectedPin;
  }

  public get selectedPin() {
    return this._selectedPin;
  }

  public draw = (mouseX: number, mouseY: number) => {
    if (this.isCreatingLink && this.renderService.layers.LINK.needRedraw) {
      const { context } = this.renderService.layers.LINK;
      const offset = PIN_SIZE / 2;
      context.lineWidth = 5;
      context.strokeStyle = this.selectedPin.graphPin.color;
      context.beginPath();
      context.moveTo(
        this.selectedPin.graphPin.x + offset,
        this.selectedPin.graphPin.y + offset
      );
      context.lineTo(mouseX, mouseY);
      context.stroke();
    }
  };
}
