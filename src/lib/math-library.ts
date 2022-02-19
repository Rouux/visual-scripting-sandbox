import 'reflect-metadata';
import inputsDecorator from '../core/decorators/inputs.decorator';
import outputsDecorator from '../core/decorators/outputs.decorator';
import { Input, Output } from '../model/pin';

export default class MathLibrary {
  @inputsDecorator(
    new Input('arg0', 'number', 0),
    new Input('arg1', 'number', 0)
  )
  @outputsDecorator(new Output('result', 'number', 0))
  static add = (arg0: number, arg1: number): number => arg0 + arg1;

  @inputsDecorator(
    new Input('arg0', 'number', 0),
    new Input('arg1', 'number', 0)
  )
  @outputsDecorator(new Output('result', 'number', 0))
  static sub = (arg0: number, arg1: number): number => arg0 - arg1;
}
