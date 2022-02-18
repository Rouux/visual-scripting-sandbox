import GraphNode from './graph-node';

export const HEADER_MARGIN = 25;
export const PIN_SIZE = 20;

export default class Node {
  public name: string;
  public graphNode: GraphNode;

  private _inputs: Input<unknown>[] = [];
  private _outputs: Output<unknown>[] = [];

  constructor(name: string) {
    this.name = name;
    this.graphNode = new GraphNode(this);
  }

  public get inputs(): Input<unknown>[] {
    return [...this._inputs];
  }

  public get outputs(): Output<unknown>[] {
    return [...this._outputs];
  }

  addInput(input: Input<unknown>): this {
    this._inputs.push(input);
    return this;
  }

  addOutput(output: Output<unknown>): this {
    this._outputs.push(output);
    return this;
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
