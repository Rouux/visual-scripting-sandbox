import 'reflect-metadata';
import { metadataDecorator } from '../core/decorators/metadata.decorator';
import {
  outputMetadata,
  outputsDecorator
} from '../core/decorators/outputs.decorator';

export default class VariableLibrary {
  @metadataDecorator({ nodeName: 'Variable' })
  @outputsDecorator(outputMetadata('value', 'unknown', undefined))
  static unknown = (value: unknown): unknown => value;
}
