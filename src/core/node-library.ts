import Node, { NodeCallback } from '../model/node/node';
import InputPin from '../model/pin/data-pin/input-pin';
import OutputPin from '../model/pin/data-pin/output-pin';
import InputExecutionPin from '../model/pin/execution-pin/input-execution-pin';
import OutputExecutionPin from '../model/pin/execution-pin/output-execution-pin';
import NodeService from '../service/node.service';
import { getDecorators } from './decorator-handling';
import { IDecorators } from './decorators/decorators';
import Service from './service';

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
