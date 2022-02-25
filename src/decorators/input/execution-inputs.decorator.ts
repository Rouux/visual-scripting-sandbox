import ExecutionInputPin from '../../model/pin/execution-pin/input/execution-input-pin';
import { defineMetadata } from '../../utils/decorator-utils';

export default function executionInputsDecorator(
  ...inputs: ExecutionInputPin[]
) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('executionInputs', inputs, target, propertyKey);
  };
}
