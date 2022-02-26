import { Layer } from './layers';

export default class GraphCanvasElement {
  public readonly layer: Layer;
  private readonly _context: CanvasRenderingContext2D;
  private readonly _canvas: HTMLCanvasElement;

  public constructor(layer: Layer) {
    this.layer = layer;
    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    this._canvas.id = `visual-scripting-${Layer[layer].toLowerCase()}-layer`;
    this._canvas.classList.add('visual-scripting-layer-canvas');
    this._canvas.style.zIndex = String(layer);
  }

  public get nativeElement() {
    return this._canvas;
  }

  public get context() {
    return this._context;
  }

  public get width() {
    return this._canvas.width;
  }

  public set width(width: number) {
    this._canvas.width = width;
  }

  public get height() {
    return this._canvas.height;
  }

  public set height(height: number) {
    this._canvas.height = height;
  }

  public getBoundingClientRect(): DOMRect {
    return this._canvas.getBoundingClientRect();
  }

  public clearRect(x: number, y: number, width: number, height: number): void {
    this._context.clearRect(x, y, width, height);
  }
}
