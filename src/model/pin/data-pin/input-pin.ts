import { AvailableType, DataPin, Pin } from '../pin';
import GraphInputPin from './graph-input-pin';
import OutputPin from './output-pin';

export default class InputPin<
  K extends keyof AvailableType = keyof AvailableType
> extends DataPin<K> {
  private _linkedPin: OutputPin;

  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    super(name, type, defaultValue);
    this._graphPin = new GraphInputPin(this);
  }

  public get graphPin(): GraphInputPin {
    return this._graphPin as GraphInputPin;
  }

  public get linkedPin(): Pin {
    return this._linkedPin as OutputPin;
  }

  public get hasLinkedPin(): boolean {
    return this._linkedPin !== undefined;
  }

  public canLinkTo(target: Pin): boolean {
    return target !== undefined && target instanceof OutputPin;
  }

  public linkTo(target: Pin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPin = target as OutputPin;
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
