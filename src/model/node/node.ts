import InputPin from '../pin/input-pin';
import OutputPin from '../pin/data-pin/output-pin';
import GraphNode from './graph-node';

export const HEADER_MARGIN = 25;

export default class Node {
  public name: string;
  public graphNode: GraphNode;

  private _inputs: InputPin[] = [];
  private _outputs: OutputPin[] = [];

  constructor(name: string) {
    this.name = name;
    this.graphNode = new GraphNode(this);
  }

  public get inputs(): InputPin[] {
    return [...this._inputs];
  }

  public get outputs(): OutputPin[] {
    return [...this._outputs];
  }

  addInput(input: InputPin): this {
    input.node = this;
    this._inputs.push(input);
    return this;
  }

  addOutput(output: OutputPin): this {
    output.node = this;
    this._outputs.push(output);
    return this;
  }
}
