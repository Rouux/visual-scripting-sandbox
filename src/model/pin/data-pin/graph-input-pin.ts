import { GraphDataPin, PIN_SIZE } from '../graph-pin';
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
    super.draw(context, localX, localY);
    if (this.pin.hasLinkedPin) {
      const { x, y } = this.pin.linkedPin.graphPin;
      const offset = PIN_SIZE / 2;
      context.lineWidth = 5;
      context.strokeStyle = 'black';
      context.beginPath();
      context.moveTo(this.x + offset, this.y + offset);
      context.lineTo(x + offset, y + offset);
      context.stroke();
    }
  }
}
