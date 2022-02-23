import OutputExecutionPin from '../../model/pin/execution-pin/output-execution-pin';
import { defineMetadata } from '../decorator-handling';

export default function executionOutputsDecorator(
  ...outputs: OutputExecutionPin[]
) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('executionOutputs', outputs, target, propertyKey);
  };
}
