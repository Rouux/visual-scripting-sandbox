import CameraService from './service/camera.service';
import Service from './core/service';
import DebugService from './service/debug.service';
import RenderService from './service/render.service';

const debug = Service.provide(new DebugService());

const camera = Service.provide(
  new CameraService(-window.innerWidth / 2, -window.innerHeight / 2)
);

const canvas = <HTMLCanvasElement>document.getElementById('main-canvas');
const render = Service.provide(new RenderService(camera, debug, canvas));

render.draw();
