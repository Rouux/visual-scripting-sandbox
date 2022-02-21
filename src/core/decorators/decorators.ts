import objectHash from 'object-hash';
import InputPin from '../../model/pin/data-pin/input-pin';
import OutputPin from '../../model/pin/data-pin/output-pin';
import { Metadata } from './metadata.decorator';

export interface IDecorators {
  inputs: InputPin[];
  outputs: OutputPin[];
  metadata: Metadata;
  hash: () => string;
}

export default class Decorators implements IDecorators {
  public inputs: InputPin[];
  public outputs: OutputPin[];
  public metadata: Metadata;

  private _hash: string;

  public constructor() {
    this.inputs = [];
    this.outputs = [];
    this.metadata = undefined;
  }

  public hash = (): string => {
    if (!this._hash) {
      this._hash = objectHash(this);
    }
    return this._hash;
  };
}
