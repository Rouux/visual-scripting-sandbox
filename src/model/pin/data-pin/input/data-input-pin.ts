import Pin, { AvailableType } from '../../pin';
import DataPin from '../data-pin';
import DataOutputPin from '../output/data-output-pin';
import DataInputGraphPin from './data-input-graph-pin';

export default class DataInputPin<
  K extends keyof AvailableType = keyof AvailableType
> extends DataPin<K> {
  private _linkedPin: DataOutputPin;

  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    super(name, type, defaultValue);
    this._graphPin = new DataInputGraphPin(this);
  }

  public get graphPin(): DataInputGraphPin {
    return this._graphPin as DataInputGraphPin;
  }

  public get linkedPin(): DataOutputPin {
    return this._linkedPin as DataOutputPin;
  }

  public get hasLinkedPin(): boolean {
    return this._linkedPin !== undefined;
  }

  public get value(): AvailableType[K] {
    if (this.hasLinkedPin) {
      if (!this.linkedPin.node.hasExecutionPin) {
        this.linkedPin.node.executeCode();
      }
      return this.castedToRequiredType(this.linkedPin.value);
    }
    return this.castedToRequiredType(this.defaultValue);
  }

  public canLinkTo(target: Pin): boolean {
    return target !== undefined && target instanceof DataOutputPin;
  }

  public linkTo(target: Pin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPin = target as DataOutputPin;
    return true;
  }

  public unlink(_target: Pin, stop: boolean) {
    if (!stop && this._linkedPin) {
      this._linkedPin.unlink(this, true);
    }
    this._linkedPin = undefined;
  }

  public unlinkAll() {
    if (this._linkedPin) {
      this._linkedPin.unlink(this, true);
    }
    this._linkedPin = undefined;
  }
}
