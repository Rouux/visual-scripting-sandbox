import { defineMetadata } from '../../utils/decorator-utils';
import { DataPinDecorator } from '../decorators';

export function outputsDecorator(...outputs: DataPinDecorator[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('dataOutputs', outputs, target, propertyKey);
  };
}
