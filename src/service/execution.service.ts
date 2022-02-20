import Service from '../core/service';
import Node from '../model/node/node';
import OutputExecutionPin from '../model/pin/execution-pin/output-execution-pin';
import NodeService from './node.service';

export default class ExecutionService extends Service {
  public startNode: Node;

  private _nodeService: NodeService;

  public init() {
    this._nodeService = Service.retrieve(NodeService);
    this.startNode = new Node('Start').addExecutionOutput(
      new OutputExecutionPin()
    );
    this._nodeService.addNode(this.startNode);
  }
  public start(): void {
    console.debug('Starting execution ...');
    // Start the code execution
    this.startNode.executionOutputs[0].executeNext();
  }
}
