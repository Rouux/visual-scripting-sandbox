import 'reflect-metadata';
import { metadataDecorator } from '../core/decorators/metadata.decorator';
import outputsDecorator from '../core/decorators/outputs.decorator';
import OutputPin from '../model/pin/data-pin/output-pin';

export default class VariableLibrary {
  @metadataDecorator({ nodeName: 'Variable' })
  @outputsDecorator(new OutputPin('value', 'any', undefined))
  static any = (value: unknown): unknown => value;
}
