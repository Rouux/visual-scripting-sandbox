import 'reflect-metadata';
import {
  inputsDecorator,
  inputMetadata,
  outputsDecorator,
  outputMetadata
} from '../../core/metadata-handling';
import Library from '../library';

export default class MathLibrary extends Library {
  @inputsDecorator(
    inputMetadata('arg0', 'number'),
    inputMetadata('arg1', 'number')
  )
  @outputsDecorator(outputMetadata('result', 'number', 0))
  static add = (arg0: number, arg1: number): number => arg0 + arg1;

  @inputsDecorator(
    inputMetadata('arg0', 'number'),
    inputMetadata('arg1', 'number')
  )
  @outputsDecorator(outputMetadata('result', 'number', 0))
  static sub = (arg0: number, arg1: number): number => arg0 - arg1;
}
