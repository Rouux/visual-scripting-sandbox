import InputPin from '../model/pin/data-pin/input-pin';
import OutputPin from '../model/pin/data-pin/output-pin';
import { Metadata } from './decorators/metadata.decorator';

export interface MetadataDecorators {
  inputs: InputPin[];
  outputs: OutputPin[];
  metadata: Metadata;
}

const METADATA_TO_IGNORE = ['design:type'];

export function getDecorators<T>(
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
    {
      inputs: [],
      outputs: [],
      metadata: undefined
    } as Partial<MetadataDecorators>
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
