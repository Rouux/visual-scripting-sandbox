import { GraphPin } from '../../graph-pin';
import { ExecutionGraphPin } from '../execution-graph-pin';
import { ExecutionInputGraphPin } from '../input/execution-input-graph-pin';

export class ExecutionOutputGraphPin extends ExecutionGraphPin {
  public get linkedPin(): ExecutionInputGraphPin {
    return this._linkedPin as ExecutionInputGraphPin;
  }

  public canLinkTo(target: GraphPin): boolean {
    return target !== undefined && target instanceof ExecutionInputGraphPin;
  }

  public linkTo(target: GraphPin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPin = target as ExecutionInputGraphPin;
    return true;
  }

  public executeNext() {
    if (!this.hasLinkedPin) return;
    this.linkedPin.graphNode.executeNode();
  }
}
