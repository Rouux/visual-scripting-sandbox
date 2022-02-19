import Service from '../../core/service';
import RenderService from '../../service/render.service';
import Rectangle from '../rectangle';
import { DataPin, Pin } from './pin';

export const PIN_SIZE = 20;

export default abstract class GraphPin {
  public renderService: RenderService;
  protected rectangle: Rectangle;
  protected _pin: Pin;

  constructor(pin: Pin) {
    this.renderService = Service.retrieve(RenderService);
    this._pin = pin;
  }

  public get x() {
    return this.rectangle?.x || 0;
  }

  public get y() {
    return this.rectangle?.y || 0;
  }

  public abstract get pin(): Pin;

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    this.rectangle = new Rectangle(localX, localY, PIN_SIZE, PIN_SIZE);
    this.rectangle.drawSelf(context);
  }

  public inBounds(x: number, y: number) {
    return this.rectangle?.inBounds(x, y);
  }
}

export abstract class GraphDataPin extends GraphPin {
  public abstract get pin(): DataPin;
}
