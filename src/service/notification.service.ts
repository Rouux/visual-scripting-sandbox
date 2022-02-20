import Service from '../core/service';

export default class NotificationService extends Service {
  private _warningElement: HTMLDivElement;
  private _errorElement: HTMLDivElement;

  warning = (...args: unknown[]) => {
    this.warningElement.innerText = args.join('');
  };

  error = (...args: unknown[]) => {
    this.errorElement.innerText = args.join('');
  };

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
