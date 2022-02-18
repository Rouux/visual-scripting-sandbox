import { defineMetadata } from '../decorator-handling';

export interface InputMetadata {
  name: string;
  type: string;
}

export function inputMetadata(name: string, type: string): InputMetadata {
  return { name, type };
}

export function inputsDecorator(...inputs: InputMetadata[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('inputs', inputs, target, propertyKey);
  };
}
