import OutputPin from '../../model/pin/data-pin/output/output-pin';
import { defineMetadata } from '../../utils/decorator-utils';

export default function outputsDecorator(...outputs: OutputPin[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('outputs', outputs, target, propertyKey);
  };
}
