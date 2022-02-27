import { RenderEngine } from '../../../core/engine/render/render.engine';
import { CameraService } from '../../../core/service/camera.service';
import { GraphPin, PIN_COLOR, PIN_SIZE } from '../graph-pin';
import { AvailableType } from '../pin';
import { IDataPin } from './data-pin';

export abstract class DataGraphPin<
    K extends keyof AvailableType = keyof AvailableType
  >
  extends GraphPin
  implements IDataPin<K>
{
  public type: K;
  private _value: AvailableType[K];
  private _defaultValue: AvailableType[K];
  private _isEditing: boolean;
  public destroyTooltip: (event?: MouseEvent) => void;

  public constructor(
    name: string,
    type: K,
    defaultValue?: AvailableType[K],
    x = 0,
    y = 0
  ) {
    super(name, x, y);
    this.type = type;
    this._defaultValue = defaultValue;
    this._value = defaultValue;
    this._isEditing = false;
  }

  public get color(): string {
    return PIN_COLOR[this.type];
  }

  public get isTooltipShowing() {
    return this.destroyTooltip !== undefined;
  }

  public get defaultValue(): AvailableType[K] {
    return this._defaultValue;
  }

  public set defaultValue(value: AvailableType[K]) {
    this._defaultValue = value;
    this._value = value;
  }

  public get value(): AvailableType[K] {
    return this._value;
  }

  public set value(value: AvailableType[K]) {
    this._value = value;
  }

  public mouseHover = (event: MouseEvent): void => {
    this.showDefaultValueInTooltip(event.offsetX, event.offsetY);
  };

  public draw(renderEngine: RenderEngine, camera: CameraService) {
    if (!renderEngine.layers.NODE.needRedraw) return;
    const { x, y } = camera.toLocalPosition(this);
    const { context } = renderEngine.layers.NODE;
    context.fillStyle = PIN_COLOR[this.type];
    const halfPinSize = PIN_SIZE / 2;
    const circleCenterX = x + halfPinSize;
    const circleCenterY = y + halfPinSize;
    context.beginPath();
    context.arc(circleCenterX, circleCenterY, halfPinSize - 3, 0, 2 * Math.PI);
    context.fill();
    context.arc(circleCenterX, circleCenterY, halfPinSize - 2, 0, 2 * Math.PI);
    context.lineWidth = 2;
    context.strokeStyle = '#333';
    context.stroke();
  }

  public dblClick = (event: MouseEvent): void => {
    const inputHtml = this.buildEditingInputElement(
      event.offsetX + PIN_SIZE,
      event.offsetY - PIN_SIZE
    );
    window._rvs.target.appendChild(inputHtml);
    event.preventDefault();
    inputHtml.focus();
    const destroyEditingInput = () => {
      inputHtml.remove();
      this._isEditing = false;
    };
    inputHtml.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        this.defaultValue = <any>inputHtml.value;
        destroyEditingInput();
      }
    });
    inputHtml.addEventListener('focusout', destroyEditingInput);
    if (this.isTooltipShowing) this.destroyTooltip();
    this._isEditing = true;
  };

  public showDefaultValueInTooltip(x: number, y: number) {
    if (this._isEditing) return;
    if (this.isTooltipShowing) return;
    const spanElement = this.buildTooltipElement(x + PIN_SIZE + 2, y - 2);
    window._rvs.target.appendChild(spanElement);
    const canvas = this._renderEngine.layers.HUD.nativeElement;
    const destroyTooltip = (event: MouseEvent) => {
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
    inputHtml.value = this.value ?? '';
    inputHtml.placeholder = 'Set a default value for this pin.';
    inputHtml.style.position = 'absolute';
    inputHtml.style.zIndex = '10';
    inputHtml.style.left = `${x}px`;
    inputHtml.style.top = `${y}px`;
    if (this.defaultValue === undefined) {
      inputHtml.style.width = '12rem';
    }
    return inputHtml;
  }

  private buildTooltipElement(x: number, y: number) {
    const spanElement = document.createElement('span');
    spanElement.textContent = this.value ?? '';
    spanElement.style.backgroundColor = 'white';
    spanElement.style.border = '1px solid black';
    spanElement.style.padding = '0px 2px 0px 2px';
    spanElement.style.position = 'absolute';
    spanElement.style.zIndex = '10';
    spanElement.style.left = `${x}px`;
    spanElement.style.top = `${y}px`;
    spanElement.style.minWidth = '3rem';
    spanElement.style.minHeight = '1.5rem';
    return spanElement;
  }
}
