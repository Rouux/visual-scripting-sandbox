import ExecutionOutputPin from '../../model/pin/execution-pin/output/execution-output-pin';
import { defineMetadata } from '../../utils/decorator-utils';

export default function executionOutputsDecorator(
  ...outputs: ExecutionOutputPin[]
) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('executionOutputs', outputs, target, propertyKey);
  };
}
