import {
  DataPinDecorator,
  ExecutionPinDecorator,
  IDecorators
} from '../../decorators/decorators';
import {
  ExecutionResultBuilder,
  IExecutionResult,
  isExecutionResult
} from '../../library/execution-result.builder';
import { toArrayIfNeeded } from '../../utils/utils';
import { DataInputGraphPin } from '../pin/data-pin/input/data-input-graph-pin';
import { DataOutputGraphPin } from '../pin/data-pin/output/data-output-graph-pin';
import { ExecutionInputGraphPin } from '../pin/execution-pin/input/execution-input-graph-pin';
import { ExecutionOutputGraphPin } from '../pin/execution-pin/output/execution-output-graph-pin';
import { PIN_SIZE } from '../pin/graph-pin';
import { GraphNode } from './graph-node';
import { Node, NodeCallback } from './node';

export class NodeBuilder {
  private _node: GraphNode;
  private constructor(node: GraphNode) {
    this._node = node;
  }

  public static builder(
    name: string,
    callback: NodeCallback,
    metadatas: IDecorators
  ): NodeBuilder {
    const { metadata } = metadatas;
    const nodeName = metadata?.nodeName ?? name;
    const node = new Node(nodeName, this.build(callback, metadatas));
    const graphNode = new GraphNode(node);
    if (metadata?.needExecution) {
      graphNode.addExecutionInput(new ExecutionInputGraphPin(undefined));
      graphNode.addExecutionOutput(new ExecutionOutputGraphPin(undefined));
    }
    return new NodeBuilder(graphNode);
  }

  private static build(callback: NodeCallback, metadatas: IDecorators) {
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
      const results = toArrayIfNeeded(callbackResult);
      metadatas.dataOutputs.forEach(({ name }, index) => {
        builder.setValue(name, results[index]);
      });
      return builder.build();
    };
  }

  public addExecutionInputs(executionInputs: ExecutionPinDecorator[]) {
    if (executionInputs) {
      executionInputs.forEach(({ name }) =>
        this._node.addExecutionInput(new ExecutionInputGraphPin(name))
      );
    }
    return this;
  }

  public addExecutionOutputs(executionOutputs: ExecutionPinDecorator[]) {
    if (executionOutputs) {
      executionOutputs.forEach(({ name }) =>
        this._node.addExecutionOutput(new ExecutionOutputGraphPin(name))
      );
    }
    return this;
  }

  public addDataInputs(dataInputs: DataPinDecorator[]) {
    if (dataInputs) {
      dataInputs.forEach(({ name, type, defaultValue }) =>
        this._node.addDataInput(new DataInputGraphPin(name, type, defaultValue))
      );
    }
    return this;
  }

  public addDataOutputs(dataOutputs: DataPinDecorator[]) {
    if (dataOutputs) {
      dataOutputs.forEach(({ name, type, defaultValue }) =>
        this._node.addDataOutput(
          new DataOutputGraphPin(name, type, defaultValue)
        )
      );
    }
    return this;
  }

  public build(): GraphNode {
    const localX = 0;
    const localY = 30;
    let index = 0;
    this._node.executionInputs.forEach((input) => {
      input.setPosition(localX + 5, localY + index * (PIN_SIZE + 3));
      index++;
    });
    this._node.dataInputs.forEach((input) => {
      input.setPosition(localX + 5, localY + index * (PIN_SIZE + 3));
      index++;
    });

    index = 0;
    this._node.executionOutputs.forEach((output) => {
      output.setPosition(
        localX + this._node.width - PIN_SIZE - 5,
        localY + index * (PIN_SIZE + 3)
      );
      index++;
    });
    this._node.dataOutputs.forEach((output) => {
      output.setPosition(
        localX + this._node.width - PIN_SIZE - 5,
        localY + index * (PIN_SIZE + 3)
      );
      index++;
    });
    console.log(this._node);
    return this._node;
  }
}
