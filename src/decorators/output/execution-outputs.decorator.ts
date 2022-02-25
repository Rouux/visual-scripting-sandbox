import OutputExecutionPin from '../../model/pin/execution-pin/output/output-execution-pin';
import { defineMetadata } from '../../utils/decorator-utils';

export default function executionOutputsDecorator(
  ...outputs: OutputExecutionPin[]
) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('executionOutputs', outputs, target, propertyKey);
  };
}
