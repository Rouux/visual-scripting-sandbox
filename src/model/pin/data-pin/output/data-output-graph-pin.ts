import DataGraphPin from '../data-graph-pin';
import DataOutputPin from './data-output-pin';

export default class DataOutputGraphPin extends DataGraphPin {
  public get pin(): DataOutputPin {
    return this._pin as DataOutputPin;
  }
}
