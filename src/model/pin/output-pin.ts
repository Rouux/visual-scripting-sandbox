import { GraphOutput } from './graph-pin';
import { AvailableType, DataPin } from './pin';

export default class OutputPin<
  K extends keyof AvailableType = keyof AvailableType
> extends DataPin<K> {
  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    super(name, type, defaultValue);
    this._graphPin = new GraphOutput(this);
  }

  public get graphPin(): GraphOutput {
    return this._graphPin as GraphOutput;
  }
}
