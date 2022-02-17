import Service from './core/service';

export default class CameraService extends Service {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
  }
}
