import Service from '../core/service';
import RenderService from './render.service';
import Node from '../node';

export default class NodeService extends Service {
  private readonly _nodes: Node[] = [];
  renderService: RenderService;

  addNode(node: Node): Node {
    this._nodes.push(node);
    this.renderService.draw();
    return node;
  }

  selectNode(selectedNode: Node) {
    const index = this.nodes.findIndex((node) => selectedNode === node);
    const selected = this.nodes.splice(index, 1);
    this.nodes.push(...selected);
    this.renderService.draw();
  }

  public get nodes(): Node[] {
    return this._nodes;
  }

  getNodeAt(x: number, y: number) {
    for (let index = this.nodes.length - 1; index >= 0; index--) {
      const node = this.nodes[index];
      if (node.inBounds(x, y)) return node;
    }
    return undefined;
  }
}
