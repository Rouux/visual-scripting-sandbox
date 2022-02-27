import RenderEngine from './core/engine/render/render.engine';

declare global {
  interface Window {
    _rvs: {
      engine: {
        renderEngine: RenderEngine;
      };
    };
  }
}
