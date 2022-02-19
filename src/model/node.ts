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

export type AvailableType = {
  number: number;
  string: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any: any;
};

export class Input<K extends keyof AvailableType = keyof AvailableType> {
  public name: string;
  public type: K;
  public defaultValue: AvailableType[K];
  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
  }
}

export class Output<K extends keyof AvailableType = keyof AvailableType> {
  public name: string;
  public type: K;
  public defaultValue: AvailableType[K];
  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
  }
}
