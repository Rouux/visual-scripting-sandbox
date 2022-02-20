import NodeLibrary from './core/node-library';
import Service from './core/service';
import MathLibrary from './lib/math-library';
import VariableLibrary from './lib/variable-library';
import CameraService from './service/camera.service';
import DebugService from './service/debug.service';
import NodeService from './service/node.service';
import PinService from './service/pin.service';
import RenderService from './service/render.service';

const canvas = <HTMLCanvasElement>document.getElementById('main-canvas');
const renderService = Service.provide(new RenderService(canvas));
Service.provide(new DebugService());
Service.provide(
  new CameraService(-window.innerWidth / 2, -window.innerHeight / 2)
);
const nodeService = Service.provide(new NodeService());
const pinService = Service.provide(new PinService());

nodeService.init();
pinService.init();
renderService.init();

renderService.draw();

// --- Tests --- //

const nodes = NodeLibrary.loadLibrary(MathLibrary, VariableLibrary);
nodes.forEach((node) => nodeService.addNode(node));
