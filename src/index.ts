import RenderEngine from './core/engine/render/render.engine';
import MathLibrary from './library/math-library';
import NodeLibrary from './library/node-library';
import SystemLibrary from './library/system-library';
import VariableLibrary from './library/variable-library';
import CameraService from './service/camera.service';
import ExecutionService from './service/execution.service';
import NodeService from './service/node.service';
import NotificationService from './service/notification/notification.service';
import PinService from './service/pin.service';
import Service from './service/service';

const main = (target: string) => {
  window._rvs = {
    engine: {
      renderEngine: new RenderEngine(document.getElementById(target))
    }
  };

  const { renderEngine } = window._rvs.engine;

  Service.provide(new NotificationService());
  Service.provide(
    new CameraService(-window.innerWidth / 2, -window.innerHeight / 2)
  );
  Service.provide(new NodeService());
  const pinService = Service.provide(new PinService());
  const executionService = Service.provide(new ExecutionService());

  pinService.init();
  renderEngine.init();
  executionService.init();

  renderEngine.layers.invalidateAll();
  requestAnimationFrame(renderEngine.draw);
};

// --- Tests --- //

main('visual-scripting');

NodeLibrary.loadLibrary(
  document.getElementById('node-library') as HTMLDivElement,
  MathLibrary,
  VariableLibrary,
  SystemLibrary
);

document.getElementById('btn-start').addEventListener('click', () => {
  Service.retrieve(ExecutionService).start();
});
