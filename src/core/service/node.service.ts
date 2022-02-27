import { Node } from '../../model/node/node';
import { Service } from './service';

export class NodeService extends Service {
  private readonly _nodes: Node[] = [];

  public get nodes(): Node[] {
    return [...this._nodes];
  }

  public addNode(node: Node): Node {
    this._nodes.push(node);
    return node;
  }

  public selectNode(selectedNode: Node) {
    const index = this._nodes.findIndex((node) => selectedNode === node);
    const selected = this._nodes.splice(index, 1)[0];
    this._nodes.push(selected);
  }
}
