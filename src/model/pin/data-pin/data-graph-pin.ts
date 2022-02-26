import GraphPin, { PIN_COLOR, PIN_SIZE } from '../graph-pin';
import DataPin from './data-pin';

export default abstract class DataGraphPin extends GraphPin {
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
    const canvas = this.renderService.layers.HUD.nativeElement;
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
