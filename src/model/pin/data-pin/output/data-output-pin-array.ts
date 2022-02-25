import DataOutputPin from './data-output-pin';

export default class DataOutputPinArray extends Array<DataOutputPin> {
  public assignValuesByOutputName(source: { [key: string]: unknown }): void {
    this.forEach((output) => (output.value = source[output.name]));
  }

  public copy(): DataOutputPinArray {
    return new DataOutputPinArray(...this);
  }
}
