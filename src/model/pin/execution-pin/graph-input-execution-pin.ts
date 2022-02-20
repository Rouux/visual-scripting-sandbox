import { GraphExecutionPin } from '../graph-pin';
import OutputExecutionPin from './output-execution-pin';

export default class GraphInputExecutionPin extends GraphExecutionPin {
  public get pin(): OutputExecutionPin {
    return this._pin as OutputExecutionPin;
  }
}
