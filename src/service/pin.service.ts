import Service from '../core/service';
import { PIN_SIZE } from '../model/pin/graph-pin';
import Pin from '../model/pin/pin';
import ExecutionPin from '../model/pin/execution-pin/execution-pin';
import RenderService from './render.service';

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

  draw = (mouseX: number, mouseY: number) => {
    if (this.isCreatingLink) {
      const { context } = this.renderService;
      const offset = PIN_SIZE / 2;
      context.lineWidth = 5;
      if (this.selectedPin instanceof ExecutionPin) {
        context.strokeStyle = 'white';
      } else {
        context.strokeStyle = 'black';
      }
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
