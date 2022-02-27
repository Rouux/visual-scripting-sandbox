import { IExecutionResult } from '../../library/execution-result.builder';
import { Entity } from '../entity';
import { DataInputPin } from '../pin/data-pin/input/data-input-pin';
import { DataInputPinArray } from '../pin/data-pin/input/data-input-pin-array';
import { DataOutputPin } from '../pin/data-pin/output/data-output-pin';
import { DataOutputPinArray } from '../pin/data-pin/output/data-output-pin-array';
import { ExecutionInputPin } from '../pin/execution-pin/input/execution-input-pin';
import { ExecutionInputPinArray } from '../pin/execution-pin/input/execution-input-pin-array';
import { ExecutionOutputPin } from '../pin/execution-pin/output/execution-output-pin';
import { ExecutionOutputPinArray } from '../pin/execution-pin/output/execution-output-pin-array';
import { Pin } from '../pin/pin';
import { GraphNode } from './graph-node';

export const HEADER_MARGIN = 25;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodeCallback = (...args: any[]) => any;

export class Node extends Entity {
  public name: string;
  public graphNode: GraphNode;

  private readonly _executionInputs = new ExecutionInputPinArray();
  private readonly _executionOutputs = new ExecutionOutputPinArray();
  private readonly _dataInputs = new DataInputPinArray();
  private readonly _dataOutputs = new DataOutputPinArray();
  private readonly _callback: NodeCallback;

  constructor(name: string, callback?: NodeCallback) {
    super();
    this.name = name;
    this._callback = callback;
    this.graphNode = new GraphNode(this);
  }

  public get hasExecutionPin(): boolean {
    return this.executionInputs.length > 0 || this.executionOutputs.length > 0;
  }

  public get pins(): Pin[] {
    return [
      ...this._executionInputs,
      ...this._executionOutputs,
      ...this._dataInputs,
      ...this._dataOutputs
    ];
  }

  public get executionInputs(): ExecutionInputPinArray {
    return this._executionInputs.copy();
  }

  public get executionOutputs(): ExecutionOutputPinArray {
    return this._executionOutputs.copy();
  }

  public get dataInputs(): DataInputPinArray {
    return this._dataInputs.copy();
  }

  public get dataOutputs(): DataOutputPinArray {
    return this._dataOutputs.copy();
  }

  public executeCode() {
    if (!this._callback) {
      throw new Error(`No code implemented for ${this.name}`);
    }
    const result = this._callback(...this._dataInputs.getValues());
    console.debug('executing code in ', this.name, ' resulting in ', result);
    const executionResult = result as IExecutionResult;
    this._dataOutputs.assignValuesByOutputName(executionResult._values);
    const outputs = executionResult._metadata.execution;
    if (outputs?.length > 0) {
      outputs
        .map((name) => this._executionOutputs.findByName(name))
        .forEach((output) => output?.executeNext());
    } else {
      this._executionOutputs.executeAll();
    }
  }

  public addExecutionInput(input: ExecutionInputPin): this {
    input.node = this;
    this._executionInputs.push(input);
    return this;
  }

  public addExecutionOutput(input: ExecutionOutputPin): this {
    input.node = this;
    this._executionOutputs.push(input);
    return this;
  }

  public addDataInput(input: DataInputPin): this {
    input.node = this;
    this._dataInputs.push(input);
    return this;
  }

  public addDataOutput(output: DataOutputPin): this {
    output.node = this;
    this._dataOutputs.push(output);
    return this;
  }
}
