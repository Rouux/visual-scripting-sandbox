import GraphNode from './graph-node';

export const HEADER_MARGIN = 25;
export const PIN_SIZE = 20;

export default class Node {
  public name: string;
  public graphNode: GraphNode;

  private _inputs: Input[] = [];
  private _outputs: Output[] = [];

  constructor(name: string) {
    this.name = name;
    this.graphNode = new GraphNode(this);
  }

  public get inputs(): Input[] {
    return [...this._inputs];
  }

  public get outputs(): Output[] {
    return [...this._outputs];
  }

  addInput(input: Input): this {
    this._inputs.push(input);
    return this;
  }

  addOutput(output: Output): this {
    this._outputs.push(output);
    return this;
  }
}

export class Input {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export class Output {
  public name: string;
  public defaultValue: unknown;
  constructor(name: string, defaultValue?: unknown) {
    this.name = name;
    this.defaultValue = defaultValue;
  }
}
