import 'reflect-metadata';
import inputsDecorator from '../decorators/input/inputs.decorator';
import outputsDecorator from '../decorators/output/outputs.decorator';
import DataInputPin from '../model/pin/data-pin/input/data-input-pin';
import DataOutputPin from '../model/pin/data-pin/output/data-output-pin';

export default class MathLibrary {
  @inputsDecorator(
    new DataInputPin('arg0', 'number', 0),
    new DataInputPin('arg1', 'number', 0)
  )
  @outputsDecorator(new DataOutputPin('result', 'number', 0))
  static add = (arg0: number, arg1: number): number => arg0 + arg1;

  @inputsDecorator(
    new DataInputPin('arg0', 'number', 0),
    new DataInputPin('arg1', 'number', 0)
  )
  @outputsDecorator(new DataOutputPin('result', 'number', 0))
  static sub = (arg0: number, arg1: number): number => arg0 - arg1;
}
