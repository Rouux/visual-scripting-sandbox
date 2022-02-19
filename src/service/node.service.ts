import Service from '../core/service';
import Node from '../model/node/node';
import RenderService from './render.service';

export default class NodeService extends Service {
  private readonly _nodes: Node[] = [];
  public renderService: RenderService;

  addNode(node: Node): Node {
    this._nodes.push(node);
    this.renderService.draw();
    return node;
  }

  selectNode(selectedNode: Node) {
    const index = this.nodes.findIndex((node) => selectedNode === node);
    const selected = this.nodes.splice(index, 1)[0];
    this.nodes.push(selected);
    this.renderService.draw();
  }

  public get nodes(): Node[] {
    return this._nodes;
  }

  getGraphNodeAt(x: number, y: number) {
    for (let index = this.nodes.length - 1; index >= 0; index--) {
      const node = this.nodes[index];
      if (node.graphNode.inBounds(x, y)) return node.graphNode;
    }
    return undefined;
  }
}
