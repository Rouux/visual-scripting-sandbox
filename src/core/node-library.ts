import Node, { Input, Output } from '../model/node';
import { getMetadata, MetadataDecorators } from './metadata-handling';

export default class NodeLibrary {
  static loadLibrary(...libraries: any[]) {
    return libraries.flatMap((library) =>
      Object.keys(library).map((property) => {
        const metadatas = getMetadata(library, property);
        return this.buildNodeFromDecorators(property, metadatas);
      })
    );
  }

  static buildNodeFromDecorators(
    property: string,
    metadatas: MetadataDecorators
  ): Node {
    const node = new Node(property);
    metadatas?.inputs.forEach(({ name }) => node.addInput(new Input(name)));
    metadatas?.outputs.forEach(({ name }) => node.addOutput(new Output(name)));
    return node;
  }
}
