import { AvailableType, DataPin, Pin } from '../pin';
import GraphOutputPin from './graph-output-pin';
import InputPin from './input-pin';

export default class OutputPin<
  K extends keyof AvailableType = keyof AvailableType
> extends DataPin<K> {
  private _linkedPins: InputPin[] = [];

  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    super(name, type, defaultValue);
    this._graphPin = new GraphOutputPin(this);
  }

  public get graphPin(): GraphOutputPin {
    return this._graphPin as GraphOutputPin;
  }

  public get hasLinkedPin(): boolean {
    return this._linkedPins?.length > 0;
  }

  public get linkedPins(): InputPin[] {
    return [...this._linkedPins];
  }

  public canLinkTo(target: Pin): boolean {
    return target !== undefined && target instanceof InputPin;
  }

  public linkTo(target: Pin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPins.push(target as InputPin);
    return true;
  }

  public unlink(target: InputPin, stop: boolean) {
    if (!stop) {
      this._linkedPins
        .filter((linkedPin) => linkedPin === target)
        .forEach((linkedPin) => linkedPin.unlink(this, true));
    }

    const index = this._linkedPins.findIndex(
      (linkedPin) => linkedPin === target
    );
    if (index >= 0) {
      this._linkedPins.splice(index, 1);
    }
  }

  public unlinkAll() {
    this._linkedPins.forEach((linkedPin) => linkedPin.unlink(this, true));
    this._linkedPins = [];
  }
}
