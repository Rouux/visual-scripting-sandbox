import { GraphDataPin } from './graph-pin';
import InputPin from './input-pin';

export default class GraphInputPin extends GraphDataPin {
  public get pin(): InputPin {
    return this._pin as InputPin;
  }

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = 'purple';
    super.draw(context, localX, localY);
  }
}
