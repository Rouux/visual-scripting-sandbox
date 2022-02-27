import { RenderEngine } from '../core/engine/render/render.engine';
import { CameraService } from '../core/service/camera.service';
import { Entity } from './entity';

export abstract class GraphElement extends Entity {
  public readonly bounds: DOMRect;
  protected readonly renderEngine: RenderEngine;
  public constructor(x = 0, y = 0, width = 0, height = 0) {
    super();
    this.bounds = new DOMRect(x, y, width, height);
    this.renderEngine = window._rvs.engine.renderEngine;
  }

  public get x() {
    return this.bounds.x;
  }

  protected set x(x: number) {
    this.bounds.x = x;
  }

  public get y() {
    return this.bounds.y;
  }

  protected set y(y: number) {
    this.bounds.y = y;
  }

  public get width() {
    return this.bounds.width;
  }

  protected set width(width: number) {
    this.bounds.width = width;
  }

  public get height() {
    return this.bounds.height;
  }

  protected set height(height: number) {
    this.bounds.height = height;
  }

  public abstract draw(renderEngine: RenderEngine, camera: CameraService): void;

  // eslint-disable-next-line no-unused-vars
  public mouseHover = (_event: MouseEvent, _x: number, _y: number) => {};
  // eslint-disable-next-line no-unused-vars
  public mouseDown = (_event: MouseEvent, _x: number, _y: number) => {};
  // eslint-disable-next-line no-unused-vars
  public mouseUp = (_event: MouseEvent, _x: number, _y: number) => {};
  // eslint-disable-next-line no-unused-vars
  public dblClick = (_event: MouseEvent, _x: number, _y: number) => {};

  public setPosition(x = this.x, y = this.y) {
    this.x = x;
    this.y = y;
  }

  public inBounds(x: number, y: number) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
    );
  }
}
