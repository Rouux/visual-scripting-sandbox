import objectHash from 'object-hash';
import { IDataPin } from '../model/pin/data-pin/data-pin';
import { IExecutionPin } from '../model/pin/execution-pin/execution-pin';
import { PartialButOmit, RequireOnly } from '../utils/typings-utils';
import { IMetadata } from './metadata.decorator';

export type DataPinDecorator = RequireOnly<IDataPin, 'name' | 'type'> &
  PartialButOmit<IDataPin, 'value'>;

export type ExecutionPinDecorator = IExecutionPin;

export interface IDecorators {
  dataInputs: DataPinDecorator[];
  dataOutputs: DataPinDecorator[];
  executionOutputs: ExecutionPinDecorator[];
  executionInputs: ExecutionPinDecorator[];
  metadata: IMetadata;
  hash: () => string;
}

export default class Decorators implements IDecorators {
  public dataInputs: DataPinDecorator[];
  public dataOutputs: DataPinDecorator[];
  public executionOutputs: ExecutionPinDecorator[];
  public executionInputs: ExecutionPinDecorator[];
  public metadata: IMetadata;

  private _hash: string;

  public constructor() {
    this.dataInputs = [];
    this.dataOutputs = [];
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
