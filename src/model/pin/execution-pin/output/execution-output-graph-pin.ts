import ExecutionGraphPin from '../execution-graph-pin';
import ExecutionOutputPin from './execution-output-pin';

export default class ExecutionOutputGraphPin extends ExecutionGraphPin {
  public get pin(): ExecutionOutputPin {
    return this._pin as ExecutionOutputPin;
  }
}
