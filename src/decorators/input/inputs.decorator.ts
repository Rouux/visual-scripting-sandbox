import InputPin from '../../model/pin/data-pin/input/input-pin';
import { defineMetadata } from '../../utils/decorator-utils';

export default function inputsDecorator(...inputs: InputPin[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('inputs', inputs, target, propertyKey);
  };
}
