import objectHash from 'object-hash';
import InputPin from '../model/pin/data-pin/input/input-pin';
import OutputPin from '../model/pin/data-pin/output/output-pin';
import InputExecutionPin from '../model/pin/execution-pin/input/input-execution-pin';
import OutputExecutionPin from '../model/pin/execution-pin/output/output-execution-pin';
import { Metadata } from './metadata.decorator';

export interface IDecorators {
  inputs: InputPin[];
  outputs: OutputPin[];
  executionOutputs: OutputExecutionPin[];
  executionInputs: InputExecutionPin[];
  metadata: Metadata;
  hash: () => string;
}

export default class Decorators implements IDecorators {
  public inputs: InputPin[];
  public outputs: OutputPin[];
  public executionOutputs: OutputExecutionPin[];
  public executionInputs: InputExecutionPin[];
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
