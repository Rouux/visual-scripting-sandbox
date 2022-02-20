import Node, { NodeCallback } from '../model/node/node';
import InputPin from '../model/pin/data-pin/input-pin';
import OutputPin from '../model/pin/data-pin/output-pin';
import InputExecutionPin from '../model/pin/execution-pin/input-execution-pin';
import OutputExecutionPin from '../model/pin/execution-pin/output-execution-pin';
import { getDecorators, MetadataDecorators } from './decorator-handling';

export default class NodeLibrary {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static loadLibrary(...libraries: any[]) {
    return libraries.flatMap((library) =>
      Object.keys(library).map((property) => {
        const metadatas = getDecorators(library, property);
        return this.buildNodeFromDecorators(
          property,
          library[property].bind(library),
          metadatas
        );
      })
    );
  }

  static buildNodeFromDecorators(
    property: string,
    callback: NodeCallback,
    metadatas: MetadataDecorators
  ): Node {
    const { metadata } = metadatas;
    const nodeName = metadata ? metadata.nodeName : property;
    const node = new Node(nodeName, callback);
    if (!metadata?.executionLess) {
      node.addExecutionInput(new InputExecutionPin());
      node.addExecutionOutput(new OutputExecutionPin());
    }
    metadatas.inputs.forEach(({ name, type, defaultValue }) =>
      node.addInput(new InputPin(name, type, defaultValue))
    );
    metadatas.outputs.forEach(({ name, type, defaultValue }) =>
      node.addOutput(new OutputPin(name, type, defaultValue))
    );
    return node;
  }
}
