import { defineMetadata } from '../utils/decorator-utils';

export interface IMetadata {
  nodeName: string;
  category?: string;
  needExecution?: boolean;
}

export function metadataDecorator(metadata: IMetadata) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('metadata', metadata, target, propertyKey);
  };
}
