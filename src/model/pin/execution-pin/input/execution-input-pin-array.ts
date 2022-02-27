import { ExecutionInputPin } from './execution-input-pin';

export class ExecutionInputPinArray extends Array<ExecutionInputPin> {
  public copy(): ExecutionInputPinArray {
    return new ExecutionInputPinArray(...this);
  }
}
