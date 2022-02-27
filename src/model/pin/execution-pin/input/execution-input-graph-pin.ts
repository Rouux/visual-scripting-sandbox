import { RenderEngine } from '../../../../core/engine/render/render.engine';
import { CameraService } from '../../../../core/service/camera.service';
import { GraphPin, PIN_SIZE } from '../../graph-pin';
import { ExecutionGraphPin } from '../execution-graph-pin';
import { ExecutionOutputGraphPin } from '../output/execution-output-graph-pin';

export class ExecutionInputGraphPin extends ExecutionGraphPin {
  public constructor(name: string, x = 0, y = 0) {
    super(name, x, y);
  }

  public get linkedPin(): ExecutionOutputGraphPin {
    return this._linkedPin as ExecutionOutputGraphPin;
  }

  public canLinkTo(target: GraphPin): boolean {
    return target !== undefined && target instanceof ExecutionOutputGraphPin;
  }

  public linkTo(target: GraphPin): boolean {
    if (!this.canLinkTo(target)) return false;
    this._linkedPin = target as ExecutionOutputGraphPin;
    return true;
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
      context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(localX + offset, localY + offset);
      context.lineTo(x + offset, y + offset);
      context.stroke();
    }
  }
}
