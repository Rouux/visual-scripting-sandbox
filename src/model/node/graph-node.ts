import Service from '../../core/service';
import CameraService from '../../service/camera.service';
import PinService from '../../service/pin.service';
import RenderService from '../../service/render.service';
import GraphDataPin from '../pin/data-pin/graph/graph-data-pin';
import GraphPin, { PIN_SIZE } from '../pin/graph-pin';
import Node from './node';

export const HEADER_MARGIN = 25;

export default class GraphNode {
  public renderService: RenderService;
  public pinService: PinService;

  public node: Node;
  public x: number;
  public y: number;

  private _canBeDragged: boolean;

  constructor(node: Node, x = 0, y = 0) {
    this.renderService = Service.retrieve(RenderService);
    this.pinService = Service.retrieve(PinService);
    this.node = node;
    this.x = x;
    this.y = y;
    this._canBeDragged = false;
  }

  public get width() {
    return 125;
  }

  public get height() {
    const executionPinsHeight =
      Math.max(
        this.node.executionInputs.length,
        this.node.executionOutputs.length
      ) *
      (PIN_SIZE + 3);
    const dataPinsHeight =
      Math.max(this.node.inputs.length, this.node.outputs.length) *
      (PIN_SIZE + 3);
    return Math.max(
      HEADER_MARGIN + 5 + executionPinsHeight + dataPinsHeight + 5,
      60
    );
  }

  mousedown(event: MouseEvent, x: number, y: number) {
    this._canBeDragged = false;
    if (this._inHeaderBounds(x, y)) {
      this._canBeDragged = true;
    } else if (this._inBodyBounds(x, y)) {
      event.preventDefault();
      const pin = this.getGraphPinAt(event.offsetX, event.offsetY);
      if (pin) pin.mousedown(event);
    }
  }

  mouseup(event: MouseEvent, x: number, y: number) {
    this._canBeDragged = false;
    if (this._inBodyBounds(x, y)) {
      event.preventDefault();
      const pin = this.getGraphPinAt(event.offsetX, event.offsetY);
      if (pin) pin.mouseup(event);
    }
  }

  dblclick(event: MouseEvent, x: number, y: number) {
    if (this._inBodyBounds(x, y)) {
      event.preventDefault();
      const graphPin = this.getGraphPinAt(event.offsetX, event.offsetY);
      if (graphPin && graphPin instanceof GraphDataPin)
        graphPin.dblclick(event);
    }
  }

  move(event: MouseEvent, deltaX: number, deltaY: number): boolean {
    if (!this._canBeDragged) return false;
    this.x += deltaX;
    this.y += deltaY;
    return deltaX !== 0 && deltaY !== 0;
  }

  mouseHover(event: MouseEvent, x: number, y: number) {
    if (this._inHeaderBounds(x, y)) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'default';
      const graphPin = this.getGraphPinAt(event.offsetX, event.offsetY);
      if (
        graphPin !== undefined &&
        graphPin instanceof GraphDataPin &&
        graphPin.pin.value !== undefined
      ) {
        graphPin.showDefaultValueInTooltip();
      }
    }
  }

  getGraphPinAt(x: number, y: number): GraphPin {
    return this.node.pins
      .map((pin) => pin.graphPin)
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
    let index = 0;
    this.node.executionInputs.forEach((input) => {
      input.graphPin.draw(context, localX + 5, localY + index * (PIN_SIZE + 3));
      index++;
    });
    this.node.inputs.forEach((input) => {
      input.graphPin.draw(context, localX + 5, localY + index * (PIN_SIZE + 3));
      index++;
    });
  }

  private drawOutputs(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    let index = 0;
    this.node.executionOutputs.forEach((output) => {
      output.graphPin.draw(
        context,
        localX + this.width - PIN_SIZE - 5,
        localY + index * (PIN_SIZE + 3)
      );
      index++;
    });
    this.node.outputs.forEach((output) => {
      output.graphPin.draw(
        context,
        localX + this.width - PIN_SIZE - 5,
        localY + index * (PIN_SIZE + 3)
      );
      index++;
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

  // @todo move to graph pin itself, has no need here it's all data of graph pin
  private showDefaultValueInTooltip(graphPin: GraphDataPin) {
    const span = document.createElement('span');
    span.textContent = graphPin.pin.value ?? '';
    const x = graphPin.x + PIN_SIZE + 2;
    const y = graphPin.y + PIN_SIZE + 2;
    span.style.backgroundColor = 'white';
    span.style.border = '1px solid black';
    span.style.padding = '0px 2px 0px 2px';
    span.style.position = 'absolute';
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    span.style.minWidth = '3rem';
    span.style.minHeight = '1.5rem';
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
