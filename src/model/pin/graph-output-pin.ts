import { GraphDataPin } from './graph-pin';
import OutputPin from './output-pin';

export default class GraphOutputPin extends GraphDataPin {
  public get pin(): OutputPin {
    return this._pin as OutputPin;
  }

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = 'cyan';
    super.draw(context, localX, localY);
  }
}
