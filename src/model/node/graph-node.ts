import { RenderEngine } from '../../core/engine/render/render.engine';
import { CameraService } from '../../core/service/camera.service';
import { DataGraphPin } from '../pin/data-pin/data-graph-pin';
import { GraphPin, PIN_SIZE } from '../pin/graph-pin';
import { Node } from './node';

export const HEADER_MARGIN = 25;

export class GraphNode {
  public node: Node;
  public x: number;
  public y: number;
  protected _renderEngine: RenderEngine;
  private _canBeDragged: boolean;

  constructor(node: Node, x = 0, y = 0) {
    this._renderEngine = window._rvs.engine.renderEngine;
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
      Math.max(this.node.dataInputs.length, this.node.dataOutputs.length) *
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
      if (graphPin && graphPin instanceof DataGraphPin)
        graphPin.dblclick(event);
    }
  }

  public move(event: MouseEvent, deltaX: number, deltaY: number): boolean {
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
        graphPin instanceof DataGraphPin &&
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

  draw(renderEngine: RenderEngine, camera: CameraService): void {
    if (!renderEngine.layers.NODE.needRedraw) return;
    const nodeLayerContext = renderEngine.layers.NODE.context;
    const localX = this.x - camera.x;
    let localY = this.y - camera.y;
    this.drawHeader(nodeLayerContext, localX, localY);
    this.drawName(nodeLayerContext, localX, localY);
    this.drawBack(nodeLayerContext, localX, localY);

    localY += HEADER_MARGIN + 5;
    this.drawInputs(renderEngine, localX, localY);
    this.drawOutputs(renderEngine, localX, localY);
  }

  private drawInputs(
    renderEngine: RenderEngine,
    localX: number,
    localY: number
  ) {
    let index = 0;
    this.node.executionInputs.forEach((input) => {
      input.graphPin.draw(
        renderEngine,
        localX + 5,
        localY + index * (PIN_SIZE + 3)
      );
      index++;
    });
    this.node.dataInputs.forEach((input) => {
      input.graphPin.draw(
        renderEngine,
        localX + 5,
        localY + index * (PIN_SIZE + 3)
      );
      index++;
    });
  }

  private drawOutputs(
    renderEngine: RenderEngine,
    localX: number,
    localY: number
  ) {
    let index = 0;
    this.node.executionOutputs.forEach((output) => {
      output.graphPin.draw(
        renderEngine,
        localX + this.width - PIN_SIZE - 5,
        localY + index * (PIN_SIZE + 3)
      );
      index++;
    });
    this.node.dataOutputs.forEach((output) => {
      output.graphPin.draw(
        renderEngine,
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
