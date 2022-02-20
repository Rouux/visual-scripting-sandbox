import { GraphExecutionPin, PIN_SIZE } from '../graph-pin';
import OutputExecutionPin from './output-execution-pin';

export default class GraphInputExecutionPin extends GraphExecutionPin {
  public get pin(): OutputExecutionPin {
    return this._pin as OutputExecutionPin;
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
      context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(this.x + offset, this.y + offset);
      context.lineTo(x + offset, y + offset);
      context.stroke();
    }
  }
}
