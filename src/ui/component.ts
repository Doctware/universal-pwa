/**
 * component.ts — The Shadow DOM UI component.
 *
 * This class creates an isolated custom element that:
 *  1. Mounts itself to <body> (so it lives outside the host app's DOM tree)
 *  2. Uses Shadow DOM so its styles are hermetically sealed
 *  3. Wires up to the InstallEngine via events
 *  4. Manages show/hide animations
 *
 * It is completely optional — devs who want headless mode can skip this
 * and build their own UI using the InstallEngine's event system.
 */

import { STYLES } from './styles';
import { renderPromptTemplate } from './templates';
import type { InstallEngine } from '../core/engine';
import type { UniversalPWAConfig, Platform } from '../types';

export class UIComponent {
  private host: HTMLElement;
  private shadow: ShadowRoot;
  private engine: InstallEngine;
  private config: UniversalPWAConfig;
  private _visible = false;

  constructor(engine: InstallEngine, config: UniversalPWAConfig) {
    this.engine = engine;
    this.config = config;

    // Create the host element — this is what gets appended to <body>
    this.host = document.createElement('universal-pwa');
    this.host.setAttribute('position', config.position ?? 'bottom');

    // Create the Shadow DOM — this is the isolation boundary
    this.shadow = this.host.attachShadow({ mode: 'open' });

    this._mount();
    this._bindEngineEvents();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Private: setup
  // ─────────────────────────────────────────────────────────────────────────

  private _mount(): void {
    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;

    // Set CSS custom property for theme color
    if (this.config.themeColor) {
      this.host.style.setProperty('--pwa-kit-color', this.config.themeColor);
    }

    // Render the initial HTML
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderPromptTemplate({
      config: this.config,
      platform: this.engine.platform as Platform,
    });

    this.shadow.appendChild(styleEl);
    this.shadow.appendChild(wrapper);

    // Append to body — outside any app framework DOM
    document.body.appendChild(this.host);

    this._bindUIEvents();
  }

  private _bindUIEvents(): void {
    const shadow = this.shadow;

    // Install button
    shadow.getElementById('kit-install')?.addEventListener('click', () => {
      const isIOS = this.engine.platform === 'ios-safari';

      if (isIOS) {
        // Toggle the iOS instructions panel
        const steps = shadow.getElementById('kit-ios-steps');
        steps?.classList.toggle('visible');
      } else {
        this.engine.install();
      }
    });

    // Dismiss button
    shadow.getElementById('kit-dismiss')?.addEventListener('click', () => {
      this.hide();
      this.engine.dismiss();
    });

    // Close button (X)
    shadow.getElementById('kit-close')?.addEventListener('click', () => {
      this.hide();
      this.engine.dismiss();
    });

    // Backdrop click
    shadow.getElementById('kit-backdrop')?.addEventListener('click', () => {
      this.hide();
      this.engine.dismiss();
    });

    // Keyboard: Escape to dismiss
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._visible) {
        this.hide();
        this.engine.dismiss();
      }
    });
  }

  private _bindEngineEvents(): void {
    // Show prompt when the engine determines we're installable
    this.engine.on('installable', () => {
      this.show();
    });

    // Hide prompt when installed
    this.engine.on('installed', () => {
      this.hide();
    });

    // Hide prompt when dismissed
    this.engine.on('dismissed', () => {
      this.hide();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public: show / hide
  // ─────────────────────────────────────────────────────────────────────────

  show(): void {
    if (this._visible) return;
    this._visible = true;
    // Force a reflow before adding the class so the CSS transition fires
    void this.host.offsetHeight;
    this.host.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  hide(): void {
    if (!this._visible) return;
    this._visible = false;
    this.host.classList.remove('visible');
    document.body.style.overflow = '';

    // Remove from DOM after animation finishes
    setTimeout(() => {
      if (!this._visible) {
        // We keep the element in DOM but invisible so it can be reshown
        // if the dev calls .show() manually
      }
    }, 400);
  }

  /** Completely removes the component from DOM */
  destroy(): void {
    this.host.remove();
  }
}
