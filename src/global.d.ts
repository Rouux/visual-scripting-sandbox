import { LogicEngine } from './core/engine/logic/logic.engine';
import { RenderEngine } from './core/engine/render/render.engine';

declare global {
  interface Window {
    _rvs: {
      target: HTMLElement;
      engine: {
        renderEngine: RenderEngine;
        logicEngine: LogicEngine;
      };
    };
  }
}
