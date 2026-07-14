/**
 * index.ts — Public entry point for universal-pwa.
 *
 * Usage (CDN / any HTML page):
 *   <script src="...index.umd.js"></script>
 *   <script>UniversalPWA.init({ appName: 'My App', themeColor: '#6200ee' })</script>
 *
 * Usage (npm / ESM):
 *   import { init } from 'universal-pwa'
 *   init({ appName: 'My App' })
 *
 * Headless usage (bring your own UI):
 *   import { createEngine } from 'universal-pwa'
 *   const engine = createEngine({ appName: 'My App' })
 *   engine.on('installable', () => myButton.show())
 */

export { InstallEngine } from './core/engine';
export { UIComponent } from './ui/component';
export type {
  UniversalPWAConfig,
  InstallStatus,
  Platform,
  PromptPosition,
  BeforeInstallPromptEvent,
} from './types';

import { InstallEngine } from './core/engine';
import { UIComponent } from './ui/component';
import type { UniversalPWAConfig } from './types';

/**
 * `init()` — The primary API. Creates the engine AND the default UI.
 * One call, full functionality.
 */
export function init(config: UniversalPWAConfig = {}): {
  engine: InstallEngine;
  ui: UIComponent;
} {
  const engine = new InstallEngine(config);
  // Only mount the UI in browser environments
  if (typeof document !== 'undefined') {
    const ui = new UIComponent(engine, config);
    return { engine, ui };
  }
  // SSR fallback — return a stub ui
  return { engine, ui: null as unknown as UIComponent };
}

/**
 * `createEngine()` — Headless mode. Engine only, no default UI.
 * For devs who want to build their own UI using the event system.
 */
export function createEngine(config: UniversalPWAConfig = {}): InstallEngine {
  return new InstallEngine(config);
}

/**
 * Default export for CDN usage: window.UniversalPWA.init(...)
 */
const UniversalPWA = {
  init,
  createEngine,
  version: '0.1.0',
};

export default UniversalPWA;

