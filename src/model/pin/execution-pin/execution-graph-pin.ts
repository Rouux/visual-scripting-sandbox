import { RenderEngine } from '../../../core/engine/render/render.engine';
import { CameraService } from '../../../core/service/camera.service';
import { GraphPin, PIN_SIZE } from '../graph-pin';

export abstract class ExecutionGraphPin extends GraphPin {
  protected _linkedPin: ExecutionGraphPin;

  public abstract get linkedPin(): ExecutionGraphPin;

  public get hasLinkedPin(): boolean {
    return this._linkedPin !== undefined;
  }

  public unlink(_target: ExecutionGraphPin, stop: boolean) {
    if (!stop && this._linkedPin) {
      this._linkedPin.unlink(this, true);
    }
    this._linkedPin = undefined;
  }

  public unlinkAll() {
    if (this._linkedPin) {
      this._linkedPin.unlink(this, true);
    }
    this._linkedPin = undefined;
  }

  public draw(renderEngine: RenderEngine, camera: CameraService) {
    if (!renderEngine.layers.NODE.needRedraw) return;
    const { x, y } = camera.toLocalPosition(this);
    const { context } = renderEngine.layers.NODE;
    context.fillStyle = 'white';
    const halfPinSize = PIN_SIZE / 2;
    const quarterPinSize = PIN_SIZE / 4;
    const circleCenterX = x + halfPinSize;
    const circleCenterY = y + halfPinSize;
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
