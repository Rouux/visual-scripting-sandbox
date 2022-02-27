import { GraphNode } from '../../model/node/graph-node';
import { Node } from '../../model/node/node';
import { ExecutionOutputGraphPin } from '../../model/pin/execution-pin/output/execution-output-graph-pin';
import { RenderEngine } from '../engine/render/render.engine';
import { NodeService } from './node.service';
import { Service } from './service';

export class ExecutionService extends Service {
  public startGraphNode: GraphNode;

  private _nodeService: NodeService;
  private _renderEngine: RenderEngine;

  public init() {
    this._nodeService = Service.retrieve(NodeService);
    this._renderEngine = window._rvs.engine.renderEngine;
    const startNode = new Node('Start');
    this.startGraphNode = new GraphNode(startNode).addExecutionOutput(
      new ExecutionOutputGraphPin('start', 100, 30)
    );
    this.startGraphNode = this._renderEngine.addNode(this.startGraphNode);
  }

  public start(): void {
    console.debug('Starting execution ...');
    this.startGraphNode.executionOutputs[0].executeNext();
  }
}
