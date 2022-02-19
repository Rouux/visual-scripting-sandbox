import { Input } from '../../model/node';
import { defineMetadata } from '../decorator-handling';

export default function inputsDecorator(...inputs: Input[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('inputs', inputs, target, propertyKey);
  };
}
