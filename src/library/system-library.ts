/* eslint-disable no-console */
import 'reflect-metadata';
import executionInputsDecorator from '../decorators/input/execution-inputs.decorator';
import executionOutputsDecorator from '../decorators/output/execution-outputs.decorator';
import inputsDecorator from '../decorators/input/inputs.decorator';
import { metadataDecorator } from '../decorators/metadata.decorator';
import outputsDecorator from '../decorators/output/outputs.decorator';
import ExecutionResultBuilder, {
  IExecutionResult
} from './execution-result.builder';
import InputPin from '../model/pin/data-pin/input/input-pin';
import OutputPin from '../model/pin/data-pin/output/output-pin';
import InputExecutionPin from '../model/pin/execution-pin/input/input-execution-pin';
import OutputExecutionPin from '../model/pin/execution-pin/output/output-execution-pin';

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
  static ifelse = (condition: boolean): IExecutionResult => {
    const execute = condition ? 'true' : 'false';
    return ExecutionResultBuilder.builder().addExecution(execute).build();
  };
}
