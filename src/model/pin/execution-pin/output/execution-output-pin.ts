import { Pin } from '../../pin';
import { ExecutionPin } from '../execution-pin';
import { ExecutionInputPin } from '../input/execution-input-pin';

export class ExecutionOutputPin extends ExecutionPin {
  constructor(name = 'execution-output') {
    super(name);
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
