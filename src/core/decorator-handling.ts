import Decorators, { IDecorators } from './decorators/decorators';

export function getDecorators<T>(library: T, property: keyof T): IDecorators {
  const decorators = new Decorators();
  const keys = Reflect.getMetadataKeys(
    library,
    property as string
  ) as (keyof Decorators)[];
  keys.forEach((key) => {
    const meta = Reflect.getMetadata(key, library, property as string);
    if (meta && key in decorators) decorators[key] = meta;
  });
  return decorators;
}

export function defineMetadata(
  key: keyof IDecorators,
  value: unknown,
  target: unknown,
  propertyKey: string | symbol
) {
  Reflect.defineMetadata(key, value, target, propertyKey);
}
