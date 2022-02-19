import Node from '../model/node/node';
import InputPin from '../model/pin/input-pin';
import OutputPin from '../model/pin/output-pin';
import { getDecorators, MetadataDecorators } from './decorator-handling';

export default class NodeLibrary {
  static loadLibrary(...libraries: any[]) {
    return libraries.flatMap((library) =>
      Object.keys(library).map((property) => {
        const metadatas = getDecorators(library, property);
        return this.buildNodeFromDecorators(property, metadatas);
      })
    );
  }

  static buildNodeFromDecorators(
    property: string,
    metadatas: MetadataDecorators
  ): Node {
    const { metadata } = metadatas;
    const nodeName = metadata ? metadata.nodeName : property;
    const node = new Node(nodeName);
    metadatas.inputs.forEach(({ name, type, defaultValue }) =>
      node.addInput(new InputPin(name, type, defaultValue))
    );
    metadatas.outputs.forEach(({ name, type, defaultValue }) =>
      node.addOutput(new OutputPin(name, type, defaultValue))
    );
    return node;
  }
}
