import Pin from '../pin';

export default abstract class ExecutionPin extends Pin {
  protected _linkedPin: ExecutionPin;

  public abstract get linkedPin(): ExecutionPin;

  public get hasLinkedPin(): boolean {
    return this._linkedPin !== undefined;
  }

  public unlink(_target: Pin, stop: boolean) {
    if (!stop && this._linkedPin) {
      this._linkedPin.unlink(this, true);
    }
    this._linkedPin = undefined;
  }

  public unlinkAll() {
    if (this._linkedPin) {
      this._linkedPin.unlink(this, true);
    }
    this._linkedPin = undefined;
  }
}
