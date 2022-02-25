import Node, { NodeCallback } from '../model/node/node';
import DataInputPin from '../model/pin/data-pin/input/data-input-pin';
import DataOutputPin from '../model/pin/data-pin/output/data-output-pin';
import ExecutionInputPin from '../model/pin/execution-pin/input/execution-input-pin';
import ExecutionOutputPin from '../model/pin/execution-pin/output/execution-output-pin';
import NodeService from '../service/node.service';
import { getDecorators } from '../utils/decorator-utils';
import { IDecorators } from '../decorators/decorators';
import ExecutionResultBuilder, {
  IExecutionResult,
  isExecutionResult
} from './execution-result.builder';
import Service from '../service/service';

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

  static build(callback: NodeCallback, metadatas: IDecorators) {
    return (...args: unknown[]): IExecutionResult => {
      const callbackResult = callback(...args);
      if (isExecutionResult(callbackResult)) {
        if (callbackResult._metadata.execution?.length === 0) {
          callbackResult._metadata.execution = [
            ...metadatas.executionOutputs.map((output) => output.name)
          ];
        }
        return callbackResult;
      }

      const builder = ExecutionResultBuilder.builder().setExecutions(
        ...metadatas.executionOutputs.map((output) => output.name)
      );
      const results = Array.isArray(callbackResult)
        ? [...callbackResult]
        : [callbackResult];
      metadatas.outputs.forEach(({ name }, index) => {
        builder.setValue(name, results[index]);
      });
      return builder.build();
    };
  }

  private static buildNodeFromDecorators(
    property: string,
    callback: NodeCallback,
    metadatas: IDecorators
  ): Node {
    const { metadata } = metadatas;
    const nodeName = metadata ? metadata.nodeName : property;

    const node = new Node(nodeName, this.build(callback, metadatas));
    if (metadata?.needExecution) {
      node.addExecutionInput(new ExecutionInputPin());
      node.addExecutionOutput(new ExecutionOutputPin());
    }
    metadatas.executionInputs.forEach(({ name }) =>
      node.addExecutionInput(new ExecutionInputPin(name))
    );
    metadatas.executionOutputs.forEach(({ name }) =>
      node.addExecutionOutput(new ExecutionOutputPin(name))
    );
    metadatas.inputs.forEach(({ name, type, defaultValue }) =>
      node.addInput(new DataInputPin(name, type, defaultValue))
    );
    metadatas.outputs.forEach(({ name, type, defaultValue }) =>
      node.addOutput(new DataOutputPin(name, type, defaultValue))
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
