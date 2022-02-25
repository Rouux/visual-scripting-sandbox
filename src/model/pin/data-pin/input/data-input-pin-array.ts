import DataInputPin from './data-input-pin';

export default class DataInputPinArray extends Array<DataInputPin> {
  public getValues(): unknown[] {
    return this.map((input) => input.value);
  }

  public copy(): DataInputPinArray {
    return new DataInputPinArray(...this);
  }
}
