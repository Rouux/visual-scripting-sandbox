import RenderService from '../../service/render/render.service';
import Service from '../../service/service';
import Pin, { AvailableType } from './pin';

export const PIN_SIZE = 20;

export const PIN_COLOR: Record<keyof AvailableType, string> = {
  number: '#22cc22',
  string: 'purple',
  boolean: 'red',
  any: 'white'
};

export default abstract class GraphPin {
  public renderService: RenderService;
  protected bounds: DOMRect;
  protected _pin: Pin;

  constructor(pin: Pin) {
    this.renderService = Service.retrieve(RenderService);
    this._pin = pin;
  }

  public abstract get pin(): Pin;

  public get x() {
    return this.bounds?.x || 0;
  }

  public get y() {
    return this.bounds?.y || 0;
  }

  public get width() {
    return this.bounds?.width || 0;
  }

  public get height() {
    return this.bounds?.height || 0;
  }

  public get color() {
    return 'white';
  }

  public mouseup(event: MouseEvent) {
    this.pin.mouseup(event);
  }

  public mousedown(event: MouseEvent) {
    this.pin.mousedown(event);
  }

  public abstract draw(
    renderService: RenderService,
    localX: number,
    localY: number
  ): void;

  protected updateBounds(localX: number, localY: number) {
    if (this.bounds === undefined) {
      this.bounds = DOMRect.fromRect({
        x: localX,
        y: localY,
        width: PIN_SIZE,
        height: PIN_SIZE
      });
    } else {
      this.bounds.x = localX;
      this.bounds.y = localY;
    }
  }

  public inBounds(x: number, y: number) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
    );
  }
}
