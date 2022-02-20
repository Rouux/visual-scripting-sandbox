import InputPin from '../pin/data-pin/input-pin';
import OutputPin from '../pin/data-pin/output-pin';
import InputExecutionPin from '../pin/execution-pin/input-execution-pin';
import OutputExecutionPin from '../pin/execution-pin/output-execution-pin';
import Pin from '../pin/pin';
import GraphNode from './graph-node';

export const HEADER_MARGIN = 25;

export type NodeCallback = (...args: unknown[]) => unknown;

export default class Node {
  public name: string;
  public graphNode: GraphNode;

  private _executionInputs: InputExecutionPin[] = [];
  private _executionOutputs: OutputExecutionPin[] = [];
  private _inputs: InputPin[] = [];
  private _outputs: OutputPin[] = [];
  private _callback: NodeCallback;

  constructor(name: string, callback?: NodeCallback) {
    this.name = name;
    this._callback = callback;
    this.graphNode = new GraphNode(this);
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
    const results = this.getCallbackResults();
    console.debug('executing code in ', this.name, ' resulting in ', results);
    results.forEach((result, index) => {
      if (this._outputs[index]) {
        this._outputs[index].value = result;
      }
    });

    this._executionOutputs.forEach((output) => output.executeNext());
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

  private getCallbackResults() {
    let results = this._callback(
      ...this._inputs.map((input) => input.value)
    ) as unknown[];
    if (!Array.isArray(results)) results = [results];
    return results;
  }
}
