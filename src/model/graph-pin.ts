import Service from '../core/service';
import RenderService from '../service/render.service';
import Pin, { Input, Output } from './pin';
import Rectangle from './rectangle';

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

export class GraphInput extends GraphPin {
  public get pin(): Input {
    return this._pin as Input;
  }

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = 'purple';
    super.draw(context, localX, localY);
  }
}

export class GraphOutput extends GraphPin {
  public get pin(): Output {
    return this._pin as Output;
  }

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = 'cyan';
    super.draw(context, localX, localY);
  }
}
