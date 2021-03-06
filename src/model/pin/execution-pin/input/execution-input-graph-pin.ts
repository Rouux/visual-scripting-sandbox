import { RenderEngine } from '../../../../core/engine/render/render.engine';
import { PIN_SIZE } from '../../graph-pin';
import { ExecutionGraphPin } from '../execution-graph-pin';
import { ExecutionOutputPin } from '../output/execution-output-pin';

export class ExecutionInputGraphPin extends ExecutionGraphPin {
  public get pin(): ExecutionOutputPin {
    return this._pin as ExecutionOutputPin;
  }

  public draw(renderEngine: RenderEngine, localX: number, localY: number) {
    super.draw(renderEngine, localX, localY);
    if (this.pin.hasLinkedPin) {
      const { context } = renderEngine.layers.LINK;
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
