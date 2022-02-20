import Service from '../../../core/service';
import NotificationService from '../../../service/notification.service';
import Pin, { AvailableType } from '../pin';

export default abstract class DataPin<
  K extends keyof AvailableType = keyof AvailableType
> extends Pin {
  public name: string;
  public type: K;
  private _value: AvailableType[K];
  private _defaultValue: AvailableType[K];

  constructor(name: string, type: K, defaultValue?: AvailableType[K]) {
    super();
    this.name = name;
    this.type = type;
    this._defaultValue = defaultValue;
    this._value = defaultValue;
  }

  public get defaultValue(): AvailableType[K] {
    return this.castedToRequiredType(this._defaultValue);
  }

  public set defaultValue(value: AvailableType[K]) {
    this._defaultValue = value;
    this._value = value;
  }

  public get value(): AvailableType[K] {
    return this.castedToRequiredType(this._value);
  }

  public set value(value: AvailableType[K]) {
    this._value = value;
  }

  protected castedToRequiredType(value: AvailableType[K]): AvailableType[K] {
    switch (this.type) {
      case 'number':
        if (Number.isNaN(Number(value))) {
          Service.retrieve(NotificationService).error(
            `The input '${this.name}' in the node '${this.node.name}' should be a number !`,
            `data-pin-casting-${this.node.id}${this.id}`
          );
        }
        return Number(value) as AvailableType[K];
      case 'string':
        return String(value) as AvailableType[K];
      case 'any':
      default:
        break;
    }
    return value;
  }
}
