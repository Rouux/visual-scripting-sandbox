import 'reflect-metadata';
import { metadataDecorator } from '../decorators/metadata.decorator';
import outputsDecorator from '../decorators/output/outputs.decorator';
import DataOutputPin from '../model/pin/data-pin/output/data-output-pin';

export default class VariableLibrary {
  @metadataDecorator({ nodeName: 'Variable' })
  @outputsDecorator(new DataOutputPin('value', 'any', undefined))
  static any = (value: unknown): unknown => value;
}
