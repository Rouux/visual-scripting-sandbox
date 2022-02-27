import { RenderEngine } from '../../../../core/engine/render/render.engine';
import { CameraService } from '../../../../core/service/camera.service';
import { GraphPin, PIN_SIZE } from '../../graph-pin';
import { DataGraphPin } from '../data-graph-pin';
import { DataOutputGraphPin } from '../output/data-output-graph-pin';

export class DataInputGraphPin extends DataGraphPin {
  private _linkedPin: DataOutputGraphPin;

  public get linkedPin(): DataOutputGraphPin {
    return this._linkedPin as DataOutputGraphPin;
  }

  public get hasLinkedPin(): boolean {
    return this._linkedPin !== undefined;
  }

  public canLinkTo(target: GraphPin): boolean {
    return target !== undefined && target instanceof DataOutputGraphPin;
  }

  public linkTo(target: GraphPin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPin = target as DataOutputGraphPin;
    return true;
  }

  public unlink(_target: GraphPin, stop: boolean) {
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
    super.draw(renderEngine, camera);
    if (this.hasLinkedPin) {
      const { context } = renderEngine.layers.LINK;
      const { x: localX, y: localY } = camera.toLocalPosition(this);
      const { x, y } = camera.toLocalPosition(this.linkedPin);
      const offset = PIN_SIZE / 2;
      context.lineWidth = 5;
      context.strokeStyle = this.color;
      context.beginPath();
      context.moveTo(localX + offset, localY + offset);
      context.lineTo(x + offset, y + offset);
      context.stroke();
    }
  }
}
