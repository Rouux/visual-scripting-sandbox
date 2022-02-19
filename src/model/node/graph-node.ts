import Service from '../../core/service';
import CameraService from '../../service/camera.service';
import RenderService from '../../service/render.service';
import { GraphDataPin } from '../pin/graph-pin';
import Node, { PIN_SIZE } from './node';

export const HEADER_MARGIN = 25;

export default class GraphNode {
  public renderService: RenderService;
  public node: Node;
  public x: number;
  public y: number;

  private _canBeDragged: boolean;

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
      const graphPin = this.getPinAt(event.offsetX, event.offsetY);
      if (graphPin?.pin?.defaultValue !== undefined) {
        this.showDefaultValueInTooltip(graphPin);
      }
    }
  }

  getPinAt(x: number, y: number): GraphDataPin {
    const node = this.node.inputs
      .map((inputPin) => inputPin.graphPin)
      .find((element) => element.inBounds(x, y));
    if (node) return node;
    return this.node.outputs
      .map((outputPin) => outputPin.graphPin)
      .find((element) => element.inBounds(x, y));
  }

  inBounds(x: number, y: number) {
    return this._inHeaderBounds(x, y) || this._inBodyBounds(x, y);
  }

  draw(context: CanvasRenderingContext2D, camera: CameraService): void {
    const localX = this.x - camera.x;
    let localY = this.y - camera.y;
    this.drawHeader(context, localX, localY);
    this.drawName(context, localX, localY);
    this.drawBack(context, localX, localY);

    localY += HEADER_MARGIN + 5;
    this.drawInputs(context, localX, localY);
    this.drawOutputs(context, localX, localY);
  }

  private drawInputs(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    this.node.inputs.forEach((input, index) => {
      input.graphPin.draw(context, localX + 5, localY + index * (PIN_SIZE + 3));
    });
  }

  private drawOutputs(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    this.node.outputs.forEach((output, index) => {
      output.graphPin.draw(
        context,
        localX + this.width - PIN_SIZE - 5,
        localY + index * (PIN_SIZE + 3)
      );
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
    context.fillText(
      this.node.name,
      localX + this.width / 2,
      localY + 17,
      this.width
    );
  }

  private showUserInputToSetDefaultValue(
    { pin }: GraphDataPin,
    event: MouseEvent
  ) {
    const inputHtml = document.createElement('input');
    inputHtml.value = pin.defaultValue ?? '';
    inputHtml.placeholder = 'Set a default value for this pin.';
    inputHtml.style.position = 'absolute';
    inputHtml.style.left = `${event.offsetX}px`;
    inputHtml.style.top = `${event.offsetY}px`;
    inputHtml.style.width = '12rem';
    document.body.appendChild(inputHtml);
    inputHtml.focus();
    inputHtml.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        pin.defaultValue = inputHtml.value;
        inputHtml.remove();
      }
    });
    inputHtml.addEventListener('focusout', () => inputHtml.remove());
  }

  private showDefaultValueInTooltip(graphPin: GraphDataPin) {
    const span = document.createElement('span');
    span.textContent = graphPin.pin.defaultValue ?? '';
    const x = graphPin.x + PIN_SIZE + 2;
    const y = graphPin.y + PIN_SIZE + 2;
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
