import ExecutionOutputPin from './execution-output-pin';

export default class ExecutionOutputPinArray extends Array<ExecutionOutputPin> {
  public findByName(name: string): ExecutionOutputPin | undefined {
    return this.find((output) => output.name === name);
  }

  public executeAll(): void {
    this.forEach((output) => output.executeNext());
  }

  public copy(): ExecutionOutputPinArray {
    return new ExecutionOutputPinArray(...this);
  }
}
