import Service from '../core/service';

export default class DebugService extends Service {
  private _debugElement: HTMLDivElement;
  private _warningElement: HTMLDivElement;
  private _errorElement: HTMLDivElement;

  debug = (...args: unknown[]) => {
    this.debugElement.innerText = args.join('');
  };

  warning = (...args: unknown[]) => {
    this.warningElement.innerText = args.join('');
  };

  error = (...args: unknown[]) => {
    this.errorElement.innerText = args.join('');
  };

  private get debugElement() {
    if (!this._debugElement) {
      this._debugElement = <HTMLDivElement>document.getElementById('debug');
    }
    return this._debugElement;
  }

  private get warningElement() {
    if (!this._warningElement) {
      this._warningElement = <HTMLDivElement>document.getElementById('warning');
    }
    return this._warningElement;
  }

  private get errorElement() {
    if (!this._errorElement) {
      this._errorElement = <HTMLDivElement>document.getElementById('error');
    }
    return this._errorElement;
  }
}
