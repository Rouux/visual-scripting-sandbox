import Service from '../core/service';
import Node from '../model/node/node';
import RenderService from './render.service';

export default class NodeService extends Service {
  private readonly _nodes: Node[] = [];
  public renderService: RenderService;

  public init() {
    this.renderService = Service.retrieve(RenderService);
  }

  public get nodes(): Node[] {
    return [...this._nodes];
  }

  public addNode(node: Node): Node {
    this._nodes.push(node);
    this.renderService.draw();
    return node;
  }

  public selectNode(selectedNode: Node) {
    const index = this._nodes.findIndex((node) => selectedNode === node);
    const selected = this._nodes.splice(index, 1)[0];
    this._nodes.push(selected);
    this.renderService.draw();
  }

  public getGraphNodeAt(x: number, y: number) {
    for (let index = this._nodes.length - 1; index >= 0; index--) {
      const node = this._nodes[index];
      if (node.graphNode.inBounds(x, y)) return node.graphNode;
    }
    return undefined;
  }
}
