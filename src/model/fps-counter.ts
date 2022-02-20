export default class FpsCounter {
  private _frames: number;
  private _lastFpsUpdateTime: number;
  private _fps: number;

  public constructor() {
    this._frames = 0;
    this._lastFpsUpdateTime = 0;
    this._fps = 0;
  }

  public get fps() {
    return this._fps;
  }

  public fixedFps(fractionDigits = 2) {
    return this.fps.toFixed(fractionDigits);
  }

  public frameUpdate() {
    this._frames++;
    const now = performance.now();
    const delta = (now - this._lastFpsUpdateTime) / 1000;
    if (delta >= 1) {
      this._fps = this._frames / delta;
      this._lastFpsUpdateTime = now;
      this._frames = 0;
    }
  }
}
