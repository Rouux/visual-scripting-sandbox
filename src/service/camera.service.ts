import Service from './service';

export default class CameraService extends Service {
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

  move(deltaX: number, deltaY: number): boolean {
    this.x += deltaX;
    this.y += deltaY;
    return deltaX !== 0 && deltaY !== 0;
  }
}
