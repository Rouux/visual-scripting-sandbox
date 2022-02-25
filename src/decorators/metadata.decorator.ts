import { defineMetadata } from '../utils/decorator-utils';

export interface Metadata {
  nodeName: string;
  category?: string;
  needExecution?: boolean;
}

export function metadataDecorator(metadata: Metadata) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('metadata', metadata, target, propertyKey);
  };
}
