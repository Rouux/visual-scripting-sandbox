import 'reflect-metadata';
import { metadataDecorator } from '../core/decorators/metadata.decorator';
import outputsDecorator from '../core/decorators/outputs.decorator';
import { Output } from '../model/pin';

export default class VariableLibrary {
  @metadataDecorator({ nodeName: 'Variable' })
  @outputsDecorator(new Output('value', 'any', undefined))
  static any = (value: unknown): unknown => value;
}
