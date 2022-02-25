import Service from './service';
import Node from '../model/node/node';
import ExecutionOutputPin from '../model/pin/execution-pin/output/execution-output-pin';
import NodeService from './node.service';

export default class ExecutionService extends Service {
  public startNode: Node;

  private _nodeService: NodeService;

  public init() {
    this._nodeService = Service.retrieve(NodeService);
    this.startNode = new Node('Start').addExecutionOutput(
      new ExecutionOutputPin()
    );
    this._nodeService.addNode(this.startNode);
  }
  public start(): void {
    console.debug('Starting execution ...');
    this.startNode.executionOutputs[0].executeNext();
  }
}
