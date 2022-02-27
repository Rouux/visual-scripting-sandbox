import { Pin } from '../../pin';
import { ExecutionPin } from '../execution-pin';
import { ExecutionInputPin } from '../input/execution-input-pin';
import { ExecutionOutputGraphPin } from './execution-output-graph-pin';

export class ExecutionOutputPin extends ExecutionPin {
  constructor(name = 'execution-output') {
    super(name);
    this._graphPin = new ExecutionOutputGraphPin(this);
  }

  public get graphPin(): ExecutionOutputGraphPin {
    return this._graphPin as ExecutionOutputGraphPin;
  }

  public get linkedPin(): ExecutionInputPin {
    return this._linkedPin as ExecutionInputPin;
  }

  public canLinkTo(target: Pin): boolean {
    return target !== undefined && target instanceof ExecutionInputPin;
  }

  public linkTo(target: Pin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPin = target as ExecutionInputPin;
    return true;
  }

  public executeNext() {
    if (!this.hasLinkedPin) return;
    this.linkedPin.executeNode();
  }
}
