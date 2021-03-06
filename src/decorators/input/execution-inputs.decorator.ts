import { defineMetadata } from '../../utils/decorator-utils';
import { ExecutionPinDecorator } from '../decorators';

export function executionInputsDecorator(...inputs: ExecutionPinDecorator[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('executionInputs', inputs, target, propertyKey);
  };
}
