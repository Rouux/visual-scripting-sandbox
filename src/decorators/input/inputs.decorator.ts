import { defineMetadata } from '../../utils/decorator-utils';
import { DataPinDecorator } from '../decorators';

export default function inputsDecorator(...inputs: DataPinDecorator[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('dataInputs', inputs, target, propertyKey);
  };
}
