/* eslint-disable no-console */
import 'reflect-metadata';
import inputsDecorator from '../core/decorators/inputs.decorator';
import { metadataDecorator } from '../core/decorators/metadata.decorator';
import outputsDecorator from '../core/decorators/outputs.decorator';
import InputPin from '../model/pin/data-pin/input-pin';
import OutputPin from '../model/pin/data-pin/output-pin';

export default class SystemLibrary {
  @metadataDecorator({ nodeName: 'Print' })
  @inputsDecorator(new InputPin('text', 'string', ''))
  @outputsDecorator(new OutputPin('text', 'string', ''))
  static print = (text: string): string => {
    console.info('[Print]: ', text);
    return text;
  };
}
