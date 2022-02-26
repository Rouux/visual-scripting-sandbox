import 'reflect-metadata';
import { metadataDecorator } from '../decorators/metadata.decorator';
import outputsDecorator from '../decorators/output/outputs.decorator';

export default class VariableLibrary {
  @metadataDecorator({ nodeName: 'Variable' })
  @outputsDecorator({ name: 'value', type: 'any', defaultValue: undefined })
  static any = (value: unknown): unknown => value;
}
