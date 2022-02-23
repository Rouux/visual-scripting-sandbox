import Pin from '../pin';
import ExecutionPin from './execution-pin';
import GraphInputExecutionPin from './graph/graph-input-execution-pin';
import OutputExecutionPin from './output-execution-pin';

export default class InputExecutionPin extends ExecutionPin {
  constructor(name = 'execution-input') {
    super(name);
    this._graphPin = new GraphInputExecutionPin(this);
  }

  public get graphPin(): GraphInputExecutionPin {
    return this._graphPin as GraphInputExecutionPin;
  }

  public get linkedPin(): OutputExecutionPin {
    return this._linkedPin as OutputExecutionPin;
  }

  public canLinkTo(target: Pin): boolean {
    return target !== undefined && target instanceof OutputExecutionPin;
  }

  public linkTo(target: Pin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPin = target as OutputExecutionPin;
    return true;
  }

  public executeNode() {
    this.node.executeCode();
  }
}
