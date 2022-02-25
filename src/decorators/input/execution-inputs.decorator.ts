import InputExecutionPin from '../../model/pin/execution-pin/input/input-execution-pin';
import { defineMetadata } from '../../utils/decorator-utils';

export default function executionInputsDecorator(
  ...inputs: InputExecutionPin[]
) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('executionInputs', inputs, target, propertyKey);
  };
}
