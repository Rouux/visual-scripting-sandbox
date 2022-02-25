import 'reflect-metadata';
import { metadataDecorator } from '../decorators/metadata.decorator';
import outputsDecorator from '../decorators/output/outputs.decorator';
import OutputPin from '../model/pin/data-pin/output/output-pin';

export default class VariableLibrary {
  @metadataDecorator({ nodeName: 'Variable' })
  @outputsDecorator(new OutputPin('value', 'any', undefined))
  static any = (value: unknown): unknown => value;
}
