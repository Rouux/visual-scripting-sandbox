import { GraphDataPin } from './graph-pin';
import InputPin from './input-pin';

export default class GraphInputPin extends GraphDataPin {
  public get pin(): InputPin {
    return this._pin as InputPin;
  }
}
