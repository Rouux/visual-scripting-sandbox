import Pin, { IPin } from '../pin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IExecutionPin extends IPin {}

export default abstract class ExecutionPin extends Pin {
  protected _linkedPin: ExecutionPin;

  public constructor(name: string) {
    super(name);
  }

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
