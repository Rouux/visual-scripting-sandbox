import 'reflect-metadata';
import inputsDecorator from '../core/decorators/inputs.decorator';
import outputsDecorator from '../core/decorators/outputs.decorator';
import InputPin from '../model/pin/data-pin/input-pin';
import OutputPin from '../model/pin/data-pin/output-pin';

export default class MathLibrary {
  @inputsDecorator(
    new InputPin('arg0', 'number', 0),
    new InputPin('arg1', 'number', 0)
  )
  @outputsDecorator(new OutputPin('result', 'number', 0))
  static add = (arg0: number, arg1: number): number => arg0 + arg1;

  @inputsDecorator(
    new InputPin('arg0', 'number', 0),
    new InputPin('arg1', 'number', 0)
  )
  @outputsDecorator(new OutputPin('result', 'number', 0))
  static sub = (arg0: number, arg1: number): number => arg0 - arg1;
}
