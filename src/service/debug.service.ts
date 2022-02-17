import Service from '../core/service';

export default class DebugService extends Service {
  private _debugElement: HTMLDivElement;

  debug = (...args: unknown[]) => {
    this.debugElement.innerText = args.join('');
  };

  public get debugElement() {
    if (!this._debugElement) {
      this._debugElement = <HTMLDivElement>document.getElementById('debug');
    }
    return this._debugElement;
  }
}
