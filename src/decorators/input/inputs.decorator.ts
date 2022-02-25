import DataInputPin from '../../model/pin/data-pin/input/data-input-pin';
import { defineMetadata } from '../../utils/decorator-utils';

export default function inputsDecorator(...inputs: DataInputPin[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('inputs', inputs, target, propertyKey);
  };
}
