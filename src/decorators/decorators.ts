import objectHash from 'object-hash';
import DataInputPin from '../model/pin/data-pin/input/data-input-pin';
import DataOutputPin from '../model/pin/data-pin/output/data-output-pin';
import ExecutionInputPin from '../model/pin/execution-pin/input/execution-input-pin';
import ExecutionOutputPin from '../model/pin/execution-pin/output/execution-output-pin';
import { Metadata } from './metadata.decorator';

export interface IDecorators {
  inputs: DataInputPin[];
  outputs: DataOutputPin[];
  executionOutputs: ExecutionOutputPin[];
  executionInputs: ExecutionInputPin[];
  metadata: Metadata;
  hash: () => string;
}

export default class Decorators implements IDecorators {
  public inputs: DataInputPin[];
  public outputs: DataOutputPin[];
  public executionOutputs: ExecutionOutputPin[];
  public executionInputs: ExecutionInputPin[];
  public metadata: Metadata;

  private _hash: string;

  public constructor() {
    this.inputs = [];
    this.outputs = [];
    this.executionOutputs = [];
    this.executionInputs = [];
    this.metadata = undefined;
  }

  public hash = (): string => {
    if (!this._hash) {
      this._hash = objectHash(this);
    }
    return this._hash;
  };
}
