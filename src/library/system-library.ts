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
import DataInputPin from '../model/pin/data-pin/input/data-input-pin';
import DataOutputPin from '../model/pin/data-pin/output/data-output-pin';
import ExecutionInputPin from '../model/pin/execution-pin/input/execution-input-pin';
import ExecutionOutputPin from '../model/pin/execution-pin/output/execution-output-pin';

export default class SystemLibrary {
  @metadataDecorator({ nodeName: 'Print', needExecution: true })
  @inputsDecorator(new DataInputPin('text', 'string', ''))
  @outputsDecorator(new DataOutputPin('text', 'string', ''))
  static print = (text: string): string => {
    console.info('[Print]: ', text);
    return text;
  };

  @metadataDecorator({ nodeName: 'If / Else' })
  @inputsDecorator(new DataInputPin('condition', 'boolean', true))
  @executionInputsDecorator(new ExecutionInputPin())
  @executionOutputsDecorator(
    new ExecutionOutputPin('true'),
    new ExecutionOutputPin('false')
  )
  static ifelse = (condition: boolean): IExecutionResult => {
    const execute = condition ? 'true' : 'false';
    return ExecutionResultBuilder.builder().addExecution(execute).build();
  };
}
