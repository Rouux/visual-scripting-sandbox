import 'reflect-metadata';
import inputsDecorator from '../decorators/input/inputs.decorator';
import outputsDecorator from '../decorators/output/outputs.decorator';

export default class MathLibrary {
  @inputsDecorator(
    { name: 'arg0', type: 'number', defaultValue: 0 },
    { name: 'arg1', type: 'number', defaultValue: 0 }
  )
  @outputsDecorator({ name: 'result', type: 'number', defaultValue: 0 })
  static add = (arg0: number, arg1: number): number => arg0 + arg1;

  @inputsDecorator(
    { name: 'arg0', type: 'number', defaultValue: 0 },
    { name: 'arg1', type: 'number', defaultValue: 0 }
  )
  @outputsDecorator({ name: 'result', type: 'number', defaultValue: 0 })
  static sub = (arg0: number, arg1: number): number => arg0 - arg1;
}
