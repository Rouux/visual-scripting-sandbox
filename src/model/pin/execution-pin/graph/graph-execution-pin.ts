import GraphPin, { PIN_SIZE } from '../../graph-pin';
import ExecutionPin from '../execution-pin';

export default abstract class GraphExecutionPin extends GraphPin {
  public abstract get pin(): ExecutionPin;

  public draw(
    context: CanvasRenderingContext2D,
    localX: number,
    localY: number
  ) {
    context.fillStyle = 'white';
    super.updateBounds(localX, localY);
    const halfPinSize = PIN_SIZE / 2;
    const quarterPinSize = PIN_SIZE / 4;
    const circleCenterX = this.x + halfPinSize;
    const circleCenterY = this.y + halfPinSize;
    context.beginPath();
    context.moveTo(
      circleCenterX - halfPinSize + 1,
      circleCenterY - halfPinSize + 1
    );
    context.lineTo(
      circleCenterX + quarterPinSize + 1,
      circleCenterY - halfPinSize + 1
    );
    context.lineTo(circleCenterX + halfPinSize + 1, circleCenterY);
    context.lineTo(
      circleCenterX + quarterPinSize + 1,
      circleCenterY + halfPinSize - 1
    );
    context.lineTo(
      circleCenterX - halfPinSize + 1,
      circleCenterY + halfPinSize - 1
    );
    context.closePath();
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
  }
}
