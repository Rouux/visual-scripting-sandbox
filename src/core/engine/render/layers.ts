import { GraphCanvasElement } from './graph-canvas-element';

export enum Layer {
  BACKGROUND,
  NODE,
  LINK,
  HUD
}

export const ALL_LAYERS = [Layer.BACKGROUND, Layer.NODE, Layer.LINK, Layer.HUD];

export type LayerKey = keyof typeof Layer;

export type ILayers = {
  [key in LayerKey]: GraphCanvasElement;
};

export class Layers implements ILayers {
  public readonly BACKGROUND: GraphCanvasElement;
  public readonly NODE: GraphCanvasElement;
  public readonly LINK: GraphCanvasElement;
  public readonly HUD: GraphCanvasElement;

  private readonly _targetElement: HTMLElement;

  public constructor(targetElement: HTMLElement) {
    this._targetElement = targetElement;
    this.BACKGROUND = this.buildGraphCanvasElement(Layer.BACKGROUND);
    this.NODE = this.buildGraphCanvasElement(Layer.NODE);
    this.LINK = this.buildGraphCanvasElement(Layer.LINK);
    this.HUD = this.buildGraphCanvasElement(Layer.HUD);
  }

  public resizeAll(width: number, height: number) {
    this.loopOverAll().forEach((canvas) => {
      canvas.width = width;
      canvas.height = height;
    });
  }

  public invalidateLayers(...layers: Layer[]) {
    this.loopOverAll()
      .filter((canvas) => layers.includes(canvas.layer))
      .forEach((canvas) => (canvas.needRedraw = true));
  }

  public invalidateAll() {
    this.invalidateLayers(...ALL_LAYERS);
  }

  public isOneInvalidated(...layers: Layer[]) {
    return this.loopOverAll()
      .filter((canvas) => layers.includes(canvas.layer))
      .some((canvas) => canvas.needRedraw);
  }

  public reset() {
    this.loopOverAll().forEach((canvas) => (canvas.needRedraw = false));
  }

  public clearAll(width: number, height: number, force = false) {
    this.loopOverAll()
      .filter(({ needRedraw }) => needRedraw || force)
      .forEach((canvas) => canvas.clearRect(0, 0, width, height));
  }

  private loopOverAll() {
    return [this.BACKGROUND, this.NODE, this.LINK, this.HUD];
  }

  private buildGraphCanvasElement(key: Layer) {
    const graphCanvas = new GraphCanvasElement(key);
    this._targetElement.appendChild(graphCanvas.nativeElement);
    return graphCanvas;
  }
}
