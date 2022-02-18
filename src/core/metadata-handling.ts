export interface MetadataDecorators {
  inputs: InputMetadata[];
  outputs: OutputMetadata[];
}

export interface OutputMetadata {
  name: string;
  type: string;
  defaultValue?: unknown;
}

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

const METADATA_TO_IGNORE = ['design:type'];

export function getMetadata<T>(
  library: T,
  property: keyof T
): MetadataDecorators {
  const keys = Reflect.getMetadataKeys(library, property as string).filter(
    (key) => !METADATA_TO_IGNORE.includes(key)
  );
  return keys.reduce(
    (result, key) => ({
      ...result,
      [key]: Reflect.getMetadata(key, library, property as string)
    }),
    {}
  );
}

function defineMetadata(
  key: keyof MetadataDecorators,
  value: unknown,
  target: unknown,
  propertyKey: string | symbol
) {
  Reflect.defineMetadata(key, value, target, propertyKey);
}
