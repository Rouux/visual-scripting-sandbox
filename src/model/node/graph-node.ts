import { RenderEngine } from '../../core/engine/render/render.engine';
import { CameraService } from '../../core/service/camera.service';
import { GraphElement } from '../graph-element';
import { DataInputGraphPin } from '../pin/data-pin/input/data-input-graph-pin';
import { DataOutputGraphPin } from '../pin/data-pin/output/data-output-graph-pin';
import { ExecutionInputGraphPin } from '../pin/execution-pin/input/execution-input-graph-pin';
import { ExecutionOutputGraphPin } from '../pin/execution-pin/output/execution-output-graph-pin';
import { GraphPin, PIN_SIZE } from '../pin/graph-pin';
import { Node } from './node';

export const HEADER_MARGIN = 25;

export class GraphNode extends GraphElement {
  public node: Node;
  private readonly _executionInputs: ExecutionInputGraphPin[] = [];
  private readonly _executionOutputs: ExecutionOutputGraphPin[] = [];
  private readonly _dataInputs: DataInputGraphPin[] = [];
  private readonly _dataOutputs: DataOutputGraphPin[] = [];
  private _pins: GraphPin[] = [];
  private _canBeDragged: boolean;

  constructor(node: Node, x = 0, y = 0) {
    super(x, y, 125);
    this.node = node;
    this._canBeDragged = false;
    this.updateHeight();
  }

  public get pins(): GraphPin[] {
    return [
      ...this._executionInputs,
      ...this._executionOutputs,
      ...this._dataInputs,
      ...this._dataOutputs
    ];
  }

  public get executionInputs(): ExecutionInputGraphPin[] {
    return this._executionInputs;
  }

  public get executionOutputs(): ExecutionOutputGraphPin[] {
    return this._executionOutputs;
  }

  public get dataInputs(): DataInputGraphPin[] {
    return this._dataInputs;
  }

  public get dataOutputs(): DataOutputGraphPin[] {
    return this._dataOutputs;
  }

  public executeNode() {
    const result = this.node.executeCode(
      ...this._dataInputs.map((input) => input.value)
    );
    const outputs = result._metadata.execution;
    outputs
      .map((name) => this.executionOutputs.find((out) => out.name === name))
      .forEach((output) => output?.executeNext());
  }

  public addExecutionInput(input: ExecutionInputGraphPin): this {
    input.graphNode = this;
    this._executionInputs.push(input);
    this.updateHeight();
    return this;
  }

  public addExecutionOutput(input: ExecutionOutputGraphPin): this {
    input.graphNode = this;
    this._executionOutputs.push(input);
    this.updateHeight();
    return this;
  }

  public addDataInput(input: DataInputGraphPin): this {
    input.graphNode = this;
    this._dataInputs.push(input);
    this.updateHeight();
    return this;
  }

  public addDataOutput(output: DataOutputGraphPin): this {
    output.graphNode = this;
    this._dataOutputs.push(output);
    this.updateHeight();
    return this;
  }

  public updateHeight(): void {
    const executionPinsHeight =
      Math.max(this.executionInputs.length, this.executionOutputs.length) *
      (PIN_SIZE + 3);
    const dataPinsHeight =
      Math.max(this.dataInputs.length, this.dataOutputs.length) *
      (PIN_SIZE + 3);
    this.height = Math.max(
      HEADER_MARGIN + 5 + executionPinsHeight + dataPinsHeight + 5,
      60
    );
  }

  public mouseDown = (event: MouseEvent, x: number, y: number): void => {
    this._canBeDragged = false;
    if (this._inHeaderBounds(x, y)) {
      this._canBeDragged = true;
    } else if (this._inBodyBounds(x, y)) {
      event.preventDefault();
    }
  };

  public mouseUp = (event: MouseEvent, x: number, y: number) => {
    this._canBeDragged = false;
    if (this._inBodyBounds(x, y)) {
      event.preventDefault();
    }
  };

  public move(event: MouseEvent, deltaX: number, deltaY: number): boolean {
    if (!this._canBeDragged) return false;
    this.x += deltaX;
    this.y += deltaY;
    this.pins.forEach((pin) => pin.move(event, deltaX, deltaY));
    return deltaX !== 0 && deltaY !== 0;
  }

  public mouseHover = (event: MouseEvent, x: number, y: number) => {
    if (this._inHeaderBounds(x, y)) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'default';
    }
  };

  inBounds(x: number, y: number) {
    return this._inHeaderBounds(x, y) || this._inBodyBounds(x, y);
  }

  draw(renderEngine: RenderEngine, camera: CameraService): void {
    if (!renderEngine.layers.NODE.needRedraw) return;
    const nodeLayerContext = renderEngine.layers.NODE.context;
    const { x, y } = camera.toLocalPosition(this);
    this.drawHeader(nodeLayerContext, x, y);
    this.drawName(nodeLayerContext, x, y);
    this.drawBack(nodeLayerContext, x, y);
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
