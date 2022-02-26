/* eslint-disable no-console */
import 'reflect-metadata';
import executionInputsDecorator from '../decorators/input/execution-inputs.decorator';
import inputsDecorator from '../decorators/input/inputs.decorator';
import { metadataDecorator } from '../decorators/metadata.decorator';
import executionOutputsDecorator from '../decorators/output/execution-outputs.decorator';
import outputsDecorator from '../decorators/output/outputs.decorator';
import ExecutionResultBuilder, {
  IExecutionResult
} from './execution-result.builder';

export default class SystemLibrary {
  @metadataDecorator({ nodeName: 'Print', needExecution: true })
  @inputsDecorator({ name: 'text', type: 'string', defaultValue: '' })
  @outputsDecorator({ name: 'text', type: 'string', defaultValue: '' })
  static print = (text: string): string => {
    console.info('[Print]: ', text);
    return text;
  };

  @metadataDecorator({ nodeName: 'If / Else' })
  @inputsDecorator({ name: 'condition', type: 'boolean', defaultValue: true })
  @executionInputsDecorator({ name: 'input' })
  @executionOutputsDecorator({ name: 'true' }, { name: 'false' })
  static ifelse = (condition: boolean): IExecutionResult => {
    const execute = condition ? 'true' : 'false';
    return ExecutionResultBuilder.builder().addExecution(execute).build();
  };
}
