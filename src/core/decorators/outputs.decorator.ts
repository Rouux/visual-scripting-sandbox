import { Output } from '../../model/node';
import { defineMetadata } from '../decorator-handling';

export default function outputsDecorator(...outputs: Output[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('outputs', outputs, target, propertyKey);
  };
}
