import GraphPin, { GraphInput, GraphOutput } from './graph-pin';
import Node from '../node/node';

export type AvailableType = {
  number: number;
  string: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any: any;
};

export default abstract class Pin {
  public node: Node;
  protected _graphPin: GraphPin;
  public abstract get graphPin(): GraphPin;
}

export class Input<
  K extends keyof AvailableType = keyof AvailableType
> extends Pin {
  public name: string;
  public type: K;
  public defaultValue: AvailableType[K];

  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    super();
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
    this._graphPin = new GraphInput(this);
  }

  public get graphPin(): GraphInput {
    return this._graphPin as GraphInput;
  }
}

export class Output<
  K extends keyof AvailableType = keyof AvailableType
> extends Pin {
  public name: string;
  public type: K;
  public defaultValue: AvailableType[K];
  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    super();
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
    this._graphPin = new GraphOutput(this);
  }

  public get graphPin(): GraphOutput {
    return this._graphPin as GraphOutput;
  }
}
