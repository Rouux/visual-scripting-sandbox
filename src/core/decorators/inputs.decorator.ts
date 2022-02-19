import { Input } from '../../model/pin/pin';
import { defineMetadata } from '../decorator-handling';

export default function inputsDecorator(...inputs: Input[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('inputs', inputs, target, propertyKey);
  };
}
