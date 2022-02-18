import CameraService from './service/camera.service';

export const HEADER_MARGIN = 25;
export const PIN_SIZE = 20;

export default class Node {
  public name: string;
  public x: number;
  public y: number;

  private _inputs: Input<unknown>[] = [];
  private _outputs: Output<unknown>[] = [];
  private _canBeDragged: boolean;

  constructor(name: string, x = 0, y = 0) {
    this.name = name;
    this.x = x;
    this.y = y;
    this._canBeDragged = false;
  }

  public get width() {
    return 100;
  }

  public get height() {
    return Math.max(
      HEADER_MARGIN +
        5 +
        Math.max(this._inputs.length, this._outputs.length) * 22 +
        5,
      60
    );
  }

  addInput(input: Input<unknown>): this {
    this._inputs.push(input);
    return this;
  }

  addOutput(output: Output<unknown>): this {
    this._outputs.push(output);
    return this;
  }

  interact(event: MouseEvent, x: number, y: number) {
    this._canBeDragged = false;
    if (this._inHeaderBounds(x, y)) {
      this._canBeDragged = true;
    } else if (this._inBodyBounds(x, y)) {
      // Nothing so far ...
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
    }
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

  private drawOutputs(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    this._outputs.forEach((output, index) => {
      context.fillStyle = 'cyan';
      context.fillRect(
        localX + this.width - PIN_SIZE - 5,
        localY + index * (PIN_SIZE + 2),
        PIN_SIZE,
        PIN_SIZE
      );
    });
  }

  private drawInputs(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    this._inputs.forEach((input, index) => {
      context.fillStyle = 'purple';
      context.fillRect(
        localX + 5,
        localY + index * (PIN_SIZE + 2),
        PIN_SIZE,
        PIN_SIZE
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
    context.fillText(this.name, localX + 50, localY + 17, this.width);
  }

  inBounds(x: number, y: number) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
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

export class Input<T> {
  public name: string;
  public defaultValue: T;
  constructor(name: string, defaultValue: T = undefined) {
    this.name = name;
    this.defaultValue = defaultValue;
  }
}

export class Output<T> {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}
