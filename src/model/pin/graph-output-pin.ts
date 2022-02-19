import { GraphDataPin } from './graph-pin';
import OutputPin from './output-pin';

export default class GraphOutputPin extends GraphDataPin {
  public get pin(): OutputPin {
    return this._pin as OutputPin;
  }
}
