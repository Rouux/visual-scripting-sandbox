import Pin from '../../pin';
import ExecutionPin from '../execution-pin';
import ExecutionInputGraphPin from './execution-input-graph-pin';
import ExecutionOutputPin from '../output/execution-output-pin';

export default class ExecutionInputPin extends ExecutionPin {
  constructor(name = 'execution-input') {
    super(name);
    this._graphPin = new ExecutionInputGraphPin(this);
  }

  public get graphPin(): ExecutionInputGraphPin {
    return this._graphPin as ExecutionInputGraphPin;
  }

  public get linkedPin(): ExecutionOutputPin {
    return this._linkedPin as ExecutionOutputPin;
  }

  public canLinkTo(target: Pin): boolean {
    return target !== undefined && target instanceof ExecutionOutputPin;
  }

  public linkTo(target: Pin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPin = target as ExecutionOutputPin;
    return true;
  }

  public executeNode() {
    this.node.executeCode();
  }
}
