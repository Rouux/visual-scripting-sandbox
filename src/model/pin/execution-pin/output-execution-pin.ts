import Pin from '../pin';
import ExecutionPin from './execution-pin';
import GraphOutputExecutionPin from './graph/graph-output-execution-pin';
import InputExecutionPin from './input-execution-pin';

export default class OutputExecutionPin extends ExecutionPin {
  constructor() {
    super();
    this._graphPin = new GraphOutputExecutionPin(this);
  }

  public get graphPin(): GraphOutputExecutionPin {
    return this._graphPin as GraphOutputExecutionPin;
  }

  public get linkedPin(): InputExecutionPin {
    return this._linkedPin as InputExecutionPin;
  }

  public canLinkTo(target: Pin): boolean {
    return target !== undefined && target instanceof InputExecutionPin;
  }

  public linkTo(target: Pin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPin = target as InputExecutionPin;
    return true;
  }

  public executeNext() {
    if (!this.hasLinkedPin) return;
    this.linkedPin.executeNode();
  }
}
