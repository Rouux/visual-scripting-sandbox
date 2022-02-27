import { defineMetadata } from '../../utils/decorator-utils';
import { ExecutionPinDecorator } from '../decorators';

export function executionOutputsDecorator(...outputs: ExecutionPinDecorator[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('executionOutputs', outputs, target, propertyKey);
  };
}
