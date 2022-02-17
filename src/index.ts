import CameraService from './service/camera.service';
import Service from './core/service';
import DebugService from './service/debug.service';
import RenderService from './service/render.service';
import NodeService from './service/node.service';
import Node, { Input, Output } from './node';

const debugService = Service.provide(new DebugService());
const cameraService = Service.provide(
  new CameraService(-window.innerWidth / 2, -window.innerHeight / 2)
);

const canvas = <HTMLCanvasElement>document.getElementById('main-canvas');
const renderService = Service.provide(new RenderService(canvas));
renderService.camera = cameraService;
renderService.debugService = debugService;

const nodeService = Service.provide(new NodeService());
nodeService.renderService = renderService;
renderService.nodeService = nodeService;

renderService.init();
renderService.draw();

// --- Tests --- //

nodeService.addNode(
  new Node('sysout')
    .addInput(new Input<string>('text', 'hello world'))
    .addInput(new Input<string>('text', 'hello world'))
    .addInput(new Input<string>('text', 'hello world'))
    .addOutput(new Output<string>('text'))
);

nodeService.addNode(
  new Node('sysin')
    .addInput(new Input<string>('text', 'hello world'))
    .addInput(new Input<string>('text', 'hello world'))
    .addInput(new Input<string>('text', 'hello world'))
    .addOutput(new Output<string>('text'))
);
