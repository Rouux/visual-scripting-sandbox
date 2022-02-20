import GraphExecutionPin from './graph-execution-pin';
import OutputExecutionPin from '../output-execution-pin';

export default class GraphOutputExecutionPin extends GraphExecutionPin {
  public get pin(): OutputExecutionPin {
    return this._pin as OutputExecutionPin;
  }
}
