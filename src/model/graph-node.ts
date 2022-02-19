import Service from '../core/service';
import CameraService from '../service/camera.service';
import RenderService from '../service/render.service';
import Node from './node';
import Rectangle from './rectangle';

export const HEADER_MARGIN = 25;
export const PIN_SIZE = 20;

export type GraphElement = [Rectangle, any];

export default class GraphNode {
  public renderService: RenderService;
  public node: Node;
  public x: number;
  public y: number;

  private _canBeDragged: boolean;
  private _elements: GraphElement[] = [];

  constructor(node: Node, x = 0, y = 0) {
    this.renderService = Service.retrieve(RenderService);
    this.node = node;
    this.x = x;
    this.y = y;
    this._canBeDragged = false;
  }

  public get width() {
    return 125;
  }

  public get height() {
    return Math.max(
      HEADER_MARGIN +
        5 +
        Math.max(this.node.inputs.length, this.node.outputs.length) *
          (PIN_SIZE + 3) +
        5,
      60
    );
  }

  interact(event: MouseEvent, x: number, y: number) {
    this._canBeDragged = false;
    if (this._inHeaderBounds(x, y)) {
      this._canBeDragged = true;
    } else if (this._inBodyBounds(x, y)) {
      event.preventDefault();
      const pin = this.getPinAt(event.offsetX, event.offsetY);
      if (pin) this.showUserInputToSetDefaultValue(pin, event);
    }
  }

  move(event: MouseEvent, deltaX: number, deltaY: number) {
    if (!this._canBeDragged) return;
    this.x += deltaX;
    this.y += deltaY;
  }

  mouseHover(event: MouseEvent, x: number, y: number) {
    if (this._inHeaderBounds(x, y)) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'default';
      const pin = this.getPinAt(event.offsetX, event.offsetY);
      if (pin && pin[1].defaultValue !== undefined) {
        this.showDefaultValueInTooltip(pin);
      }
    }
  }

  getPinAt(x: number, y: number) {
    return this._elements.find((element) => element[0].inBounds(x, y));
  }

  inBounds(x: number, y: number) {
    return this._inHeaderBounds(x, y) || this._inBodyBounds(x, y);
  }

  draw(context: CanvasRenderingContext2D, camera: CameraService): void {
    this._elements = [];
    const localX = this.x - camera.x;
    let localY = this.y - camera.y;
    this.drawHeader(context, localX, localY);
    this.drawName(context, localX, localY);
    this.drawBack(context, localX, localY);

    localY += HEADER_MARGIN + 5;
    this.drawInputs(context, localX, localY);
    this.drawOutputs(context, localX, localY);
  }

  private drawOutputs(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    this.node.outputs.forEach((output, index) => {
      context.fillStyle = 'cyan';
      const rect = new Rectangle(
        localX + this.width - PIN_SIZE - 5,
        localY + index * (PIN_SIZE + 3),
        PIN_SIZE,
        PIN_SIZE
      );
      this._elements.push([rect, output]);
      rect.drawSelf(context);
    });
  }

  private drawInputs(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    this.node.inputs.forEach((input, index) => {
      context.fillStyle = 'purple';
      const rect = new Rectangle(
        localX + 5,
        localY + index * (PIN_SIZE + 3),
        PIN_SIZE,
        PIN_SIZE
      );
      this._elements.push([rect, input]);
      rect.drawSelf(context);
    });
  }

  private drawHeader(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = 'darkred';
    context.fillRect(localX, localY, this.width, HEADER_MARGIN);
  }

  private drawBack(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = 'red';
    context.fillRect(
      localX,
      localY + HEADER_MARGIN,
      this.width,
      this.height - HEADER_MARGIN
    );
  }

  private drawName(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.font = '16px arial';
    context.textAlign = 'center';
    context.fillStyle = 'white';
    context.fillText(this.node.name, localX + 50, localY + 17, this.width);
  }

  private showUserInputToSetDefaultValue(pin: GraphElement, event: MouseEvent) {
    const inputHtml = document.createElement('input');
    inputHtml.value = pin[1].defaultValue ?? '';
    inputHtml.placeholder = 'Set a default value for this pin.';
    inputHtml.style.position = 'absolute';
    inputHtml.style.left = `${event.offsetX}px`;
    inputHtml.style.top = `${event.offsetY}px`;
    inputHtml.style.width = '12rem';
    document.body.appendChild(inputHtml);
    inputHtml.focus();
    inputHtml.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        pin[1].defaultValue = inputHtml.value;
        inputHtml.remove();
      }
    });
    inputHtml.addEventListener('focusout', () => inputHtml.remove());
  }

  private showDefaultValueInTooltip(pin: GraphElement) {
    const span = document.createElement('span');
    span.textContent = pin[1].defaultValue ?? '';
    const x = pin[0].x + pin[0].width + 2;
    const y = pin[0].y + pin[0].height + 2;
    span.style.backgroundColor = 'white';
    span.style.border = '1px solid black';
    span.style.padding = '0px 2px 0px 2px';
    span.style.position = 'absolute';
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    span.style.minWidth = '3rem';
    document.body.appendChild(span);
    const destroySpan = () => {
      span.remove();
      this.renderService.canvas.removeEventListener('mousemove', destroySpan);
    };
    this.renderService.canvas.addEventListener('mousemove', destroySpan);
  }

  private _inHeaderBounds(x: number, y: number) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + HEADER_MARGIN
    );
  }

  private _inBodyBounds(x: number, y: number) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y + HEADER_MARGIN &&
      y < this.y + this.height
    );
  }
}
