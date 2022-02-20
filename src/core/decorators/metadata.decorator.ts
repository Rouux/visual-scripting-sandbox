import { defineMetadata } from '../decorator-handling';

export interface Metadata {
  nodeName: string;
  category?: string;
  executionLess?: boolean;
}

export function metadataDecorator(metadata: Metadata) {
  return function (target: unknown, propertyKey: string) {
    defineMetadata('metadata', metadata, target, propertyKey);
  };
}
