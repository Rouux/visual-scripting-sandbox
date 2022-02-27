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
import { DataInputPin } from '../pin/data-pin/input/data-input-pin';
import { DataOutputPin } from '../pin/data-pin/output/data-output-pin';
import { ExecutionInputPin } from '../pin/execution-pin/input/execution-input-pin';
import { ExecutionOutputPin } from '../pin/execution-pin/output/execution-output-pin';
import { Node, NodeCallback } from './node';

export class NodeBuilder {
  private _node: Node;
  private constructor(node: Node) {
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
    if (metadata?.needExecution) {
      node.addExecutionInput(new ExecutionInputPin());
      node.addExecutionOutput(new ExecutionOutputPin());
    }
    return new NodeBuilder(node);
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
        this._node.addExecutionInput(new ExecutionInputPin(name))
      );
    }
    return this;
  }

  public addExecutionOutputs(executionOutputs: ExecutionPinDecorator[]) {
    if (executionOutputs) {
      executionOutputs.forEach(({ name }) =>
        this._node.addExecutionOutput(new ExecutionOutputPin(name))
      );
    }
    return this;
  }

  public addDataInputs(dataInputs: DataPinDecorator[]) {
    if (dataInputs) {
      dataInputs.forEach(({ name, type, defaultValue }) =>
        this._node.addDataInput(new DataInputPin(name, type, defaultValue))
      );
    }
    return this;
  }

  public addDataOutputs(dataOutputs: DataPinDecorator[]) {
    if (dataOutputs) {
      dataOutputs.forEach(({ name, type, defaultValue }) =>
        this._node.addDataOutput(new DataOutputPin(name, type, defaultValue))
      );
    }
    return this;
  }

  public build(): Node {
    return this._node;
  }
}
