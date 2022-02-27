import { GraphPin } from '../../graph-pin';
import { DataGraphPin } from '../data-graph-pin';
import { DataInputGraphPin } from '../input/data-input-graph-pin';

export class DataOutputGraphPin extends DataGraphPin {
  private _linkedPins: DataInputGraphPin[] = [];

  public get hasLinkedPin(): boolean {
    return this._linkedPins?.length > 0;
  }

  public get linkedPins(): DataInputGraphPin[] {
    return [...this._linkedPins];
  }

  public canLinkTo(target: GraphPin): boolean {
    return target !== undefined && target instanceof DataInputGraphPin;
  }

  public linkTo(target: GraphPin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPins.push(target as DataInputGraphPin);
    return true;
  }

  public unlink(target: DataInputGraphPin, stop: boolean) {
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
