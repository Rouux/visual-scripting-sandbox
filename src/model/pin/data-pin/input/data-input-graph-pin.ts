import RenderService from '../../../../service/render/render.service';
import { PIN_SIZE } from '../../graph-pin';
import DataGraphPin from '../data-graph-pin';
import DataInputPin from './data-input-pin';

export default class DataInputGraphPin extends DataGraphPin {
  public get pin(): DataInputPin {
    return this._pin as DataInputPin;
  }

  public draw(renderService: RenderService, localX: number, localY: number) {
    super.draw(renderService, localX, localY);
    if (this.pin.hasLinkedPin) {
      const { context } = renderService.layers.LINK;
      const { x, y } = this.pin.linkedPin.graphPin;
      const offset = PIN_SIZE / 2;
      context.lineWidth = 5;
      context.strokeStyle = this.color;
      context.beginPath();
      context.moveTo(this.x + offset, this.y + offset);
      context.lineTo(x + offset, y + offset);
      context.stroke();
    }
  }
}
