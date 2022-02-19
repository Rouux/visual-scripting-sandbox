import { GraphInput } from './graph-pin';
import { AvailableType, DataPin } from './pin';

export default class InputPin<
  K extends keyof AvailableType = keyof AvailableType
> extends DataPin<K> {
  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    super(name, type, defaultValue);
    this._graphPin = new GraphInput(this);
  }

  public get graphPin(): GraphInput {
    return this._graphPin as GraphInput;
  }
}
