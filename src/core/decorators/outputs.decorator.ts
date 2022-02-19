import OutputPin from '../../model/pin/output-pin';
import { defineMetadata } from '../decorator-handling';

export default function outputsDecorator(...outputs: OutputPin[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('outputs', outputs, target, propertyKey);
  };
}
