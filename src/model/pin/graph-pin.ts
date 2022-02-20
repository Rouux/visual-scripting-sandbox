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

  public abstract draw(
    context: CanvasRenderingContext2D,
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

export abstract class GraphDataPin extends GraphPin {
  private _isEditing: boolean;
  public destroyTooltip: (event?: MouseEvent) => void;

  public constructor(pin: DataPin) {
    super(pin);
    this._isEditing = false;
  }

  public abstract get pin(): DataPin;

  public get isTooltipShowing() {
    return this.destroyTooltip !== undefined;
  }

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = PIN_COLOR[this.pin.type];
    super.updateBounds(localX, localY);
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

  public dblclick(event: MouseEvent) {
    const inputHtml = this.buildEditingInputElement(
      event.offsetX + PIN_SIZE,
      event.offsetY - PIN_SIZE
    );
    document.getElementById('board').appendChild(inputHtml);
    event.preventDefault();
    inputHtml.focus();
    const destroyEditingInput = () => {
      inputHtml.remove();
      this._isEditing = false;
    };
    inputHtml.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        this.pin.defaultValue = inputHtml.value;
        destroyEditingInput();
      }
    });
    inputHtml.addEventListener('focusout', destroyEditingInput);
    if (this.isTooltipShowing) this.destroyTooltip();
    this._isEditing = true;
  }

  public showDefaultValueInTooltip() {
    if (this._isEditing) return;
    if (this.isTooltipShowing) return;
    const spanElement = this.buildTooltipElement(
      this.x + PIN_SIZE + 2,
      this.y - 2
    );
    document.getElementById('board').appendChild(spanElement);
    const { canvas } = this.renderService;
    const destroyTooltip = (event?: MouseEvent) => {
      if (event && this.inBounds(event.offsetX, event.offsetY)) return;
      canvas.removeEventListener('mousemove', destroyTooltip);
      this.destroyTooltip = undefined;
      spanElement.remove();
    };
    canvas.addEventListener('mousemove', destroyTooltip);
    this.destroyTooltip = destroyTooltip;
  }

  private buildEditingInputElement(x: number, y: number) {
    const inputHtml = document.createElement('input');
    inputHtml.value = this.pin.value ?? '';
    inputHtml.placeholder = 'Set a default value for this pin.';
    inputHtml.style.position = 'absolute';
    inputHtml.style.left = `${x}px`;
    inputHtml.style.top = `${y}px`;
    if (this.pin.defaultValue === undefined) {
      inputHtml.style.width = '12rem';
    }
    return inputHtml;
  }

  private buildTooltipElement(x: number, y: number) {
    const spanElement = document.createElement('span');
    spanElement.textContent = this.pin.value ?? '';
    spanElement.style.backgroundColor = 'white';
    spanElement.style.border = '1px solid black';
    spanElement.style.padding = '0px 2px 0px 2px';
    spanElement.style.position = 'absolute';
    spanElement.style.left = `${x}px`;
    spanElement.style.top = `${y}px`;
    spanElement.style.minWidth = '3rem';
    spanElement.style.minHeight = '1.5rem';
    return spanElement;
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
    super.updateBounds(localX, localY);
    const halfPinSize = PIN_SIZE / 2;
    const quarterPinSize = PIN_SIZE / 4;
    const circleCenterX = this.x + halfPinSize;
    const circleCenterY = this.y + halfPinSize;
    context.beginPath();
    context.moveTo(
      circleCenterX - halfPinSize + 1,
      circleCenterY - halfPinSize + 1
    );
    context.lineTo(
      circleCenterX + quarterPinSize + 1,
      circleCenterY - halfPinSize + 1
    );
    context.lineTo(circleCenterX + halfPinSize + 1, circleCenterY);
    context.lineTo(
      circleCenterX + quarterPinSize + 1,
      circleCenterY + halfPinSize - 1
    );
    context.lineTo(
      circleCenterX - halfPinSize + 1,
      circleCenterY + halfPinSize - 1
    );
    context.closePath();
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
  }
}
