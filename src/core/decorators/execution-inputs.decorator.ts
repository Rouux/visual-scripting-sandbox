import InputExecutionPin from '../../model/pin/execution-pin/input-execution-pin';
import { defineMetadata } from '../decorator-handling';

export default function executionInputsDecorator(
  ...inputs: InputExecutionPin[]
) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('executionInputs', inputs, target, propertyKey);
  };
}
