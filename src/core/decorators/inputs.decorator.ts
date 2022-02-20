import InputPin from '../../model/pin/data-pin/input-pin';
import { defineMetadata } from '../decorator-handling';

export default function inputsDecorator(...inputs: InputPin[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('inputs', inputs, target, propertyKey);
  };
}
