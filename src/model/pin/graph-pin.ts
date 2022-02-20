import Service from '../../core/service';
import RenderService from '../../service/render.service';
import { AvailableType, DataPin, ExecutionPin, Pin } from './pin';

export const PIN_SIZE = 20;

export const PIN_COLOR: Record<keyof AvailableType, string> = {
  number: '#22cc22',
  string: 'purple',
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

  public abstract get pin(): Pin;

  public mouseup(event: MouseEvent) {
    this.pin.mouseup(event);
  }

  public mousedown(event: MouseEvent) {
    this.pin.mousedown(event);
  }

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    this.updateBounds(localX, localY);
    const halfPinSize = PIN_SIZE / 2;
    const circleCenterX = this.x + halfPinSize;
    const circleCenterY = this.y + halfPinSize;
    context.beginPath();
    context.arc(circleCenterX, circleCenterY, halfPinSize - 3, 0, 2 * Math.PI);
    context.fill();
    context.arc(circleCenterX, circleCenterY, halfPinSize - 2, 0, 2 * Math.PI);
    context.lineWidth = 2;
    context.strokeStyle = '#333';
    context.stroke();
  }

  private updateBounds(localX: number, localY: number) {
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

export abstract class GraphDataPin extends GraphPin {
  public abstract get pin(): DataPin;

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = PIN_COLOR[this.pin.type];
    super.draw(context, localX, localY);
  }

  public dblclick(event: MouseEvent) {
    const inputHtml = document.createElement('input');
    inputHtml.value = this.pin.defaultValue ?? '';
    inputHtml.placeholder = 'Set a default value for this pin.';
    inputHtml.style.position = 'absolute';
    inputHtml.style.left = `${event.offsetX}px`;
    inputHtml.style.top = `${event.offsetY}px`;
    if (this.pin.defaultValue === undefined) {
      inputHtml.style.width = '12rem';
    }
    document.body.appendChild(inputHtml);
    event.preventDefault();
    inputHtml.focus();
    inputHtml.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        this.pin.defaultValue = inputHtml.value;
        inputHtml.remove();
      }
    });
    inputHtml.addEventListener('focusout', () => inputHtml.remove());
  }
}

export abstract class GraphExecutionPin extends GraphPin {
  public abstract get pin(): ExecutionPin;

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = 'white';
    super.draw(context, localX, localY);
  }
}
