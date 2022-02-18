import { InputMetadata } from './decorators/inputs.decorator';
import { OutputMetadata } from './decorators/outputs.decorator';

export interface MetadataDecorators {
  inputs: InputMetadata[];
  outputs: OutputMetadata[];
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

export function defineMetadata(
  key: keyof MetadataDecorators,
  value: unknown,
  target: unknown,
  propertyKey: string | symbol
) {
  Reflect.defineMetadata(key, value, target, propertyKey);
}
