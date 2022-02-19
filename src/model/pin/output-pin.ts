import GraphOutputPin from './graph-output-pin';
import { AvailableType, DataPin } from './pin';

export default class OutputPin<
  K extends keyof AvailableType = keyof AvailableType
> extends DataPin<K> {
  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    super(name, type, defaultValue);
    this._graphPin = new GraphOutputPin(this);
  }

  public get graphPin(): GraphOutputPin {
    return this._graphPin as GraphOutputPin;
  }
}
