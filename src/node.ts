const HEADER_MARGIN = 25;

export default class Node {
  public name: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  private _inputs: Input<unknown>[] = [];
  private _outputs: Output<unknown>[] = [];

  constructor(name: string, x = 0, y = 0) {
    this.name = name;
    this.x = x;
    this.y = y;
  }

  addInput(input: Input<unknown>): this {
    this._inputs.push(input);
    return this;
  }

  addOutput(output: Output<unknown>): this {
    this._outputs.push(output);
    return this;
  }

  inHeaderBounds(x: number, y: number) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + HEADER_MARGIN
    );
  }

  inBodyBounds(x: number, y: number) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y + HEADER_MARGIN &&
      y < this.y + this.height
    );
  }

  draw(context: CanvasRenderingContext2D, camera: any): void {
    context.fillStyle = 'red';
    this.width = 100;
    this.height = Math.max(
      HEADER_MARGIN +
        10 +
        Math.max(this._inputs.length, this._outputs.length) * 20,
      60
    );
    context.fillRect(
      this.x - camera.x,
      this.y - camera.y,
      this.width,
      this.height
    );
    context.font = '18px arial';
    context.textAlign = 'center';
    context.fillStyle = 'white';
    context.fillText(
      this.name,
      this.x + 50 - camera.x,
      this.y + 15 - camera.y,
      this.width
    );
    this._inputs.forEach((input, index) => {
      context.fillStyle = 'purple';
      context.fillRect(
        this.x + 5 - camera.x,
        this.y + HEADER_MARGIN + index * 22 - camera.y,
        20,
        20
      );
    });
    this._outputs.forEach((output, index) => {
      context.fillStyle = 'cyan';
      context.fillRect(
        this.x + this.width - 20 - 5 - camera.x,
        this.y + HEADER_MARGIN + index * 10 - camera.y,
        20,
        20
      );
    });
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
