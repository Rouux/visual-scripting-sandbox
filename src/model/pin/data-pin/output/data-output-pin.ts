import { AvailableType, Pin } from '../../pin';
import { DataPin } from '../data-pin';
import { DataInputPin } from '../input/data-input-pin';

export class DataOutputPin<
  K extends keyof AvailableType = keyof AvailableType
> extends DataPin<K> {
  private _linkedPins: DataInputPin[] = [];

  public get hasLinkedPin(): boolean {
    return this._linkedPins?.length > 0;
  }

  public get linkedPins(): DataInputPin[] {
    return [...this._linkedPins];
  }

  public canLinkTo(target: Pin): boolean {
    return target !== undefined && target instanceof DataInputPin;
  }

  public linkTo(target: Pin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPins.push(target as DataInputPin);
    return true;
  }

  public unlink(target: DataInputPin, stop: boolean) {
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
