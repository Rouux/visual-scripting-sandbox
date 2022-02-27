import { NodeService } from '../core/service/node.service';
import { Service } from '../core/service/service';
import { IDecorators } from '../decorators/decorators';
import { GraphNode } from '../model/node/graph-node';
import { Node, NodeCallback } from '../model/node/node';
import { NodeBuilder } from '../model/node/node.builder';
import { getDecorators } from '../utils/decorator-utils';

export class NodeLibrary {
  private static LibraryMetadatas: [
    string,
    (...args: unknown[]) => unknown,
    IDecorators
  ][] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static loadLibrary(anchorDiv: HTMLDivElement, ...libraries: any[]) {
    const ul = document.createElement('ul');
    libraries.forEach((library) =>
      Object.keys(library).forEach((property) => {
        const decorators = getDecorators(library, property);
        const callback = library[property].bind(library);
        NodeLibrary.LibraryMetadatas.push([property, callback, decorators]);
        ul.appendChild(NodeLibrary.buildLiElement(property, decorators.hash()));
      })
    );
    anchorDiv.innerHTML = '';
    anchorDiv.appendChild(ul);
  }

  private static buildNodeFromDecorators(
    property: string,
    callback: NodeCallback,
    metadatas: IDecorators
  ): GraphNode {
    return NodeBuilder.builder(property, callback, metadatas)
      .addExecutionInputs(metadatas.executionInputs)
      .addExecutionOutputs(metadatas.executionOutputs)
      .addDataInputs(metadatas.dataInputs)
      .addDataOutputs(metadatas.dataOutputs)
      .build();
  }

  private static buildLiElement(name: string, hash: string) {
    const span = document.createElement('span');
    span.textContent = name;
    const li = document.createElement('li');
    li.appendChild(span);
    li.addEventListener('mousedown', () => {
      const node = this.getNodeDecorators(hash);
      // Service.retrieve(NodeService).addNode(node);
      window._rvs.engine.renderEngine.addNode(node);
    });
    return li;
  }

  private static getNodeDecorators(hash: string): GraphNode {
    const found = NodeLibrary.LibraryMetadatas.find(
      ([, , metadata]) => metadata.hash() === hash
    );
    return NodeLibrary.buildNodeFromDecorators(found[0], found[1], found[2]);
  }
}
