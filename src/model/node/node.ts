import { IExecutionResult } from '../../library/execution-result.builder';
import Entity from '../entity';
import InputPin from '../pin/data-pin/input/input-pin';
import OutputPin from '../pin/data-pin/output/output-pin';
import InputExecutionPin from '../pin/execution-pin/input/input-execution-pin';
import OutputExecutionPin from '../pin/execution-pin/output/output-execution-pin';
import Pin from '../pin/pin';
import GraphNode from './graph-node';

export const HEADER_MARGIN = 25;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodeCallback = (...args: any[]) => any;

export default class Node extends Entity {
  public name: string;
  public graphNode: GraphNode;

  private _executionInputs: InputExecutionPin[] = [];
  private _executionOutputs: OutputExecutionPin[] = [];
  private _inputs: InputPin[] = [];
  private _outputs: OutputPin[] = [];
  private _callback: NodeCallback;

  constructor(name: string, callback?: NodeCallback) {
    super();
    this.name = name;
    this._callback = callback;
    this.graphNode = new GraphNode(this);
  }

  public get needsExecution(): boolean {
    return this.executionInputs.length > 0 || this.executionOutputs.length > 0;
  }

  public get pins(): Pin[] {
    return [
      ...this._executionInputs,
      ...this._executionOutputs,
      ...this.inputs,
      ...this.outputs
    ];
  }

  public get executionInputs(): InputExecutionPin[] {
    return [...this._executionInputs];
  }

  public get executionOutputs(): OutputExecutionPin[] {
    return [...this._executionOutputs];
  }

  public get inputs(): InputPin[] {
    return [...this._inputs];
  }

  public get outputs(): OutputPin[] {
    return [...this._outputs];
  }

  public executeCode() {
    if (!this._callback) {
      throw new Error(`No code implemented for ${this.name}`);
    }
    const result = this._callback(...this._inputs.map((input) => input.value));
    console.debug('executing code in ', this.name, ' resulting in ', result);
    const executionResult = result as IExecutionResult;
    this._outputs.forEach(
      (output) => (output.value = executionResult._values[output.name])
    );
    const outputs = executionResult._metadata.execution;
    if (outputs?.length > 0) {
      outputs
        .map((name) =>
          this._executionOutputs.find((output) => output.name === name)
        )
        .forEach((output) => output?.executeNext());
    } else {
      this._executionOutputs.forEach((output) => output.executeNext());
    }
  }

  public addExecutionInput(input: InputExecutionPin): this {
    input.node = this;
    this._executionInputs.push(input);
    return this;
  }

  public addExecutionOutput(input: OutputExecutionPin): this {
    input.node = this;
    this._executionOutputs.push(input);
    return this;
  }

  public addInput(input: InputPin): this {
    input.node = this;
    this._inputs.push(input);
    return this;
  }

  public addOutput(output: OutputPin): this {
    output.node = this;
    this._outputs.push(output);
    return this;
  }
}
