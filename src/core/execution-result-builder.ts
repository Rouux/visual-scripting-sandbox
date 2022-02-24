export interface IExecutionResult {
  _metadata: { execution: string[] };
  _values: { [key: string]: unknown };
}

export function isExecutionResult(object: unknown): object is IExecutionResult {
  return (
    Object.prototype.hasOwnProperty.call(object, '_metadata') &&
    Object.prototype.hasOwnProperty.call(object, '_values')
  );
}

export default class ExecutionResultBuilder {
  private _executionResult: IExecutionResult;

  private constructor() {
    this._executionResult = new ExecutionResult();
  }

  public static builder(): ExecutionResultBuilder {
    return new ExecutionResultBuilder();
  }

  public addExecution(executionPin: string) {
    this._executionResult._metadata.execution.push(executionPin);
    return this;
  }

  public setExecutions(...executionPins: string[]) {
    this._executionResult._metadata.execution = [...executionPins];
    return this;
  }

  public setValue(name: string, value: unknown) {
    this._executionResult._values[name] = value;
    return this;
  }

  public build() {
    return this._executionResult;
  }
}

class ExecutionResult implements IExecutionResult {
  public _metadata: {
    execution: string[];
  };
  public _values: { [key: string]: unknown };

  public constructor() {
    this._metadata = {
      execution: []
    };
    this._values = {};
  }
}
