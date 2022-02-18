import { defineMetadata } from '../decorator-handling';

export interface OutputMetadata {
  name: string;
  type: string;
  defaultValue?: unknown;
}

export function outputMetadata(
  name: string,
  type: string,
  defaultValue?: unknown
): OutputMetadata {
  const result = { name, type } as OutputMetadata;
  if (defaultValue !== undefined) result.defaultValue = defaultValue;
  return result;
}

export function outputsDecorator(...outputs: OutputMetadata[]) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('outputs', outputs, target, propertyKey);
  };
}
