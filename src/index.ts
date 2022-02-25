import NodeLibrary from './library/node-library';
import Service from './service/service';
import MathLibrary from './library/math-library';
import SystemLibrary from './library/system-library';
import VariableLibrary from './library/variable-library';
import CameraService from './service/camera.service';
import ExecutionService from './service/execution.service';
import NodeService from './service/node.service';
import NotificationService from './service/notification/notification.service';
import PinService from './service/pin.service';
import RenderService from './service/render/render.service';

const canvas = <HTMLCanvasElement>document.getElementById('main-canvas');
const renderService = Service.provide(new RenderService(canvas));
Service.provide(new NotificationService());
Service.provide(
  new CameraService(-window.innerWidth / 2, -window.innerHeight / 2)
);
const nodeService = Service.provide(new NodeService());
const pinService = Service.provide(new PinService());
const executionService = Service.provide(new ExecutionService());

nodeService.init();
pinService.init();
renderService.init();
executionService.init();

requestAnimationFrame(renderService.draw);

// --- Tests --- //

NodeLibrary.loadLibrary(
  document.getElementById('node-library') as HTMLDivElement,
  MathLibrary,
  VariableLibrary,
  SystemLibrary
);

document.getElementById('btn-start').addEventListener('click', () => {
  executionService.start();
});
