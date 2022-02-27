import { RenderEngine } from '../../core/engine/render/render.engine';
import { PinService } from '../../core/service/pin.service';
import { Service } from '../../core/service/service';
import { MouseButton } from '../../utils/utils';
import { GraphElement } from '../graph-element';
import { GraphNode } from '../node/graph-node';
import { AvailableType } from './pin';

export const PIN_SIZE = 20;

export const PIN_COLOR: Record<keyof AvailableType, string> = {
  number: '#22cc22',
  string: 'purple',
  boolean: 'red',
  any: 'white'
};

export abstract class GraphPin extends GraphElement {
  public readonly name: string;
  public graphNode: GraphNode;
  protected _renderEngine: RenderEngine;
  protected _pinService: PinService;

  constructor(name: string, x = 0, y = 0) {
    super(x, y, PIN_SIZE, PIN_SIZE);
    this.name = name;
    this._renderEngine = window._rvs.engine.renderEngine;
    this._pinService = Service.retrieve(PinService);
  }

  public abstract get hasLinkedPin(): boolean;
  public abstract canLinkTo(target: GraphPin): boolean;
  public abstract linkTo(target: GraphPin): boolean;
  public abstract unlink(target: GraphPin, stop?: boolean): void;
  public abstract unlinkAll(): void;

  public move(event: MouseEvent, deltaX: number, deltaY: number): boolean {
    this.x += deltaX;
    this.y += deltaY;
    return deltaX !== 0 && deltaY !== 0;
  }

  public get color() {
    return 'white';
  }

  public get node() {
    return this.graphNode.node;
  }

  public mouseUp = (event: MouseEvent) => {
    if (
      event.button === MouseButton.LEFT &&
      this._pinService.selectedPin !== undefined &&
      this._pinService.selectedPin !== this &&
      this._pinService.selectedPin.node !== this.node
    ) {
      if (this.canLinkTo(this._pinService.selectedPin)) {
        this.unlink(this._pinService.selectedPin, false);
        this.linkTo(this._pinService.selectedPin);
      }
      if (this._pinService.selectedPin.canLinkTo(this)) {
        this._pinService.selectedPin.unlink(this, false);
        this._pinService.selectedPin.linkTo(this);
      }
    }
    // this.pin.mouseup(event);
  };

  public mouseDown = (event: MouseEvent) => {
    // this.pin.mousedown(event);
    if (event.button === MouseButton.LEFT) {
      this._pinService.selectedPin = this;
    } else if (this.hasLinkedPin && event.button === MouseButton.WHEEL) {
      this.unlinkAll();
    }
  };

  public inBounds(x: number, y: number) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
    );
  }
}
