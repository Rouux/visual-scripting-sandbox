import Node from '../node/node';
import GraphPin from './graph-pin';

export type AvailableType = {
  number: number;
  string: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any: any;
};

export abstract class Pin {
  public node: Node;
  protected _graphPin: GraphPin;
  public abstract get graphPin(): GraphPin;
}

export abstract class DataPin<
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
  }
}
