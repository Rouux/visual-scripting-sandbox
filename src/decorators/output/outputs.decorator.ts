import DataOutputPin from '../../model/pin/data-pin/output/data-output-pin';
import { defineMetadata } from '../../utils/decorator-utils';

export default function outputsDecorator(...outputs: DataOutputPin[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('outputs', outputs, target, propertyKey);
  };
}
