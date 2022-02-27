import PinService from '../../core/service/pin.service';
import Service from '../../core/service/service';
import { MouseButton } from '../../utils/utils';
import Entity from '../entity';
import Node from '../node/node';
import GraphPin from './graph-pin';

export type AvailableType = {
  number: number;
  string: string;
  boolean: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any: any;
};

export interface IPin {
  readonly name: string;
}

export default abstract class Pin extends Entity implements IPin {
  public readonly name: string;
  public node: Node;

  protected pinService: PinService;
  protected _graphPin: GraphPin;

  public constructor(name: string) {
    super();
    this.name = name;
    this.pinService = Service.retrieve(PinService);
  }

  public abstract get graphPin(): GraphPin;
  public abstract get hasLinkedPin(): boolean;
  public abstract canLinkTo(target: Pin): boolean;
  public abstract linkTo(target: Pin): boolean;
  public abstract unlink(target: Pin, stop?: boolean): void;
  public abstract unlinkAll(): void;

  public mouseup(event: MouseEvent): void {
    if (
      event.button === MouseButton.LEFT &&
      this.pinService.selectedPin !== undefined &&
      this.pinService.selectedPin !== this &&
      this.pinService.selectedPin.node !== this.node
    ) {
      if (this.canLinkTo(this.pinService.selectedPin)) {
        this.unlink(this.pinService.selectedPin, false);
        this.linkTo(this.pinService.selectedPin);
      }
      if (this.pinService.selectedPin.canLinkTo(this)) {
        this.pinService.selectedPin.unlink(this, false);
        this.pinService.selectedPin.linkTo(this);
      }
    }
  }

  public mousedown(event: MouseEvent): void {
    if (this.hasLinkedPin && event.button === MouseButton.WHEEL) {
      this.unlinkAll();
    }
    if (event.button === MouseButton.LEFT) {
      this.pinService.selectedPin = this;
    }
  }
}
