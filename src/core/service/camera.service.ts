import { GraphElement } from '../../model/graph-element';
import { Service } from './service';

export class CameraService extends Service {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  public mouseX: number;
  public mouseY: number;

  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
  }

  public toLocalPosition(graphElement: GraphElement) {
    return { x: graphElement.x - this.x, y: graphElement.y - this.y };
  }

  public move(deltaX: number, deltaY: number): boolean {
    this.x += deltaX;
    this.y += deltaY;
    return deltaX !== 0 && deltaY !== 0;
  }
}
