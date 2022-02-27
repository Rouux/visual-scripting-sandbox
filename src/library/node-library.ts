import NodeService from '../core/service/node.service';
import Service from '../core/service/service';
import { IDecorators } from '../decorators/decorators';
import Node, { NodeCallback } from '../model/node/node';
import NodeBuilder from '../model/node/node.builder';
import { getDecorators } from '../utils/decorator-utils';

export default class NodeLibrary {
  private static LibraryMetadatas: [
    string,
    (...args: unknown[]) => unknown,
    IDecorators
  ][] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static loadLibrary(anchorDiv: HTMLDivElement, ...libraries: any[]) {
    const ul = document.createElement('ul');
    const nodes = libraries.flatMap((library) =>
      Object.keys(library).map((property) => {
        const decorators = getDecorators(library, property);
        const callback = library[property].bind(library);
        NodeLibrary.LibraryMetadatas.push([property, callback, decorators]);
        const node = this.buildNodeFromDecorators(
          property,
          callback,
          decorators
        );
        ul.appendChild(NodeLibrary.buildLiElement(node, decorators.hash()));
        return node;
      })
    );
    anchorDiv.innerHTML = '';
    anchorDiv.appendChild(ul);
    return nodes;
  }

  private static buildNodeFromDecorators(
    property: string,
    callback: NodeCallback,
    metadatas: IDecorators
  ): Node {
    return NodeBuilder.builder(property, callback, metadatas)
      .addExecutionInputs(metadatas.executionInputs)
      .addExecutionOutputs(metadatas.executionOutputs)
      .addDataInputs(metadatas.dataInputs)
      .addDataOutputs(metadatas.dataOutputs)
      .build();
  }

  private static buildLiElement(node: Node, hash: string) {
    const span = document.createElement('span');
    span.textContent = node.name;
    const li = document.createElement('li');
    li.appendChild(span);
    li.addEventListener('mousedown', () => {
      Service.retrieve(NodeService).addNode(this.getNodeDecorators(hash));
    });
    return li;
  }

  private static getNodeDecorators(hash: string): Node {
    const found = NodeLibrary.LibraryMetadatas.find(
      ([, , metadata]) => metadata.hash() === hash
    );
    return NodeLibrary.buildNodeFromDecorators(found[0], found[1], found[2]);
  }
}
