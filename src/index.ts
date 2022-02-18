import CameraService from './service/camera.service';
import Service from './core/service';
import DebugService from './service/debug.service';
import RenderService from './service/render.service';
import NodeService from './service/node.service';
import MathLibrary from './lib/math/node-math';
import NodeLibrary from './core/node-library';

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

const nodes = NodeLibrary.loadLibrary(MathLibrary);
nodes.forEach((node) => nodeService.addNode(node));
