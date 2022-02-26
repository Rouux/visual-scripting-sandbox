import GraphCanvasElement from './graph-canvas-element';

export enum Layer {
  BACKGROUND,
  NODE,
  LINK,
  HUD
}

export type LayerKey = keyof typeof Layer;

export type ILayers = {
  [key in LayerKey]: GraphCanvasElement;
};

export default class Layers implements ILayers {
  private readonly _targetElement: HTMLElement;
  public readonly BACKGROUND: GraphCanvasElement;
  public readonly NODE: GraphCanvasElement;
  public readonly LINK: GraphCanvasElement;
  public readonly HUD: GraphCanvasElement;

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

  public clearAll(width: number, height: number) {
    this.loopOverAll().forEach((canvas) => {
      canvas.clearRect(0, 0, width, height);
    });
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
