/* eslint-disable no-console */
import 'reflect-metadata';
import executionInputsDecorator from '../core/decorators/execution-inputs.decorator';
import executionOutputsDecorator from '../core/decorators/execution-outputs.decorator';
import inputsDecorator from '../core/decorators/inputs.decorator';
import { metadataDecorator } from '../core/decorators/metadata.decorator';
import outputsDecorator from '../core/decorators/outputs.decorator';
import InputPin from '../model/pin/data-pin/input-pin';
import OutputPin from '../model/pin/data-pin/output-pin';
import InputExecutionPin from '../model/pin/execution-pin/input-execution-pin';
import OutputExecutionPin from '../model/pin/execution-pin/output-execution-pin';

export default class SystemLibrary {
  @metadataDecorator({ nodeName: 'Print', needExecution: true })
  @inputsDecorator(new InputPin('text', 'string', ''))
  @outputsDecorator(new OutputPin('text', 'string', ''))
  static print = (text: string): string => {
    console.info('[Print]: ', text);
    return text;
  };

  @metadataDecorator({ nodeName: 'If / Else' })
  @inputsDecorator(new InputPin('condition', 'boolean', true))
  @executionInputsDecorator(new InputExecutionPin())
  @executionOutputsDecorator(
    new OutputExecutionPin('true'),
    new OutputExecutionPin('false')
  )
  static ifelse = (condition: boolean): unknown => {
    const execute = condition ? 'true' : 'false';
    return {
      _metadata: {
        execution: [execute]
      }
    };
  };
}
