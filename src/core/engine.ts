/**
 * engine.ts — The heart of universal-pwa.
 *
 * This class is completely framework-agnostic. It:
 *   1. Detects the current platform
 *   2. Listens for the browser's `beforeinstallprompt` event
 *   3. Checks stored user preferences
 *   4. Exposes a simple async install() method
 *   5. Emits events so any UI layer can react
 *
 * It has zero DOM manipulation — all UI is the responsibility of the
 * layer above (UIComponent or the developer's own code).
 */

import { detectPlatform, isAlreadyInstalled } from './platform';
import {
  recordDismissal,
  recordInstalled,
  hasInstalled,
  isDismissedWithinCooldown,
  clearStorage,
} from './storage';
import { EventEmitter, type EngineEvents } from './events';
import type {
  UniversalPWAConfig,
  EngineState,
  BeforeInstallPromptEvent,
  InstallStatus,
} from '../types';

export class InstallEngine extends EventEmitter<EngineEvents> {
  private config: Required<
    Pick<
      UniversalPWAConfig,
      | 'delay'
      | 'dismissCooldownDays'
      | 'onInstall'
      | 'onDismiss'
      | 'onInstalled'
    >
  >;

  private state: EngineState;
  private _readyResolve: (() => void) | null = null;

  // A promise that resolves once the engine has finished initializing
  readonly ready: Promise<void>;

  constructor(config: UniversalPWAConfig = {}) {
    super();

    this.config = {
      delay: config.delay ?? 3000,
      dismissCooldownDays: config.dismissCooldownDays ?? 3,
      onInstall: config.onInstall ?? (() => {}),
      onDismiss: config.onDismiss ?? (() => {}),
      onInstalled: config.onInstalled ?? (() => {}),
    };

    this.state = {
      status: 'unsupported',
      platform: 'unsupported',
      deferredPrompt: null,
    };

    this.ready = new Promise((resolve) => {
      this._readyResolve = resolve;
    });

    // Defer initialization until DOM is ready
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this._init());
      } else {
        this._init();
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Private: initialization
  // ─────────────────────────────────────────────────────────────────────────

  private _init(): void {
    const platform = detectPlatform();
    this.state.platform = platform;

    // Already installed — do nothing
    if (isAlreadyInstalled() || hasInstalled()) {
      this._setStatus('installed');
      return;
    }

    // User dismissed recently — respect the cooldown
    if (isDismissedWithinCooldown(this.config.dismissCooldownDays)) {
      this._setStatus('dismissed');
      return;
    }

    // iOS Safari needs special handling — no `beforeinstallprompt`
    if (platform === 'ios-safari') {
      setTimeout(() => {
        this._setStatus('installable');
        this.emit('installable', undefined as void);
      }, this.config.delay);
      return;
    }

    // For unsupported/Firefox — mark unsupported and bail
    if (platform === 'unsupported' || platform === 'firefox') {
      this._setStatus('unsupported');
      return;
    }

    // Chrome/Edge/Samsung — wait for the browser's own event
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault(); // Stop the browser's own mini-infobar
      this.state.deferredPrompt = event as BeforeInstallPromptEvent;

      setTimeout(() => {
        this._setStatus('installable');
        this.emit('installable', undefined as void);
      }, this.config.delay);
    });

    // Listen for successful install from outside (e.g. browser menu)
    window.addEventListener('appinstalled', () => {
      recordInstalled();
      this._setStatus('installed');
      this.config.onInstalled();
      this.emit('installed', undefined as void);
    });
  }

  private _setStatus(status: InstallStatus): void {
    this.state.status = status;
    this.emit('ready', { status, platform: this.state.platform });
    this._readyResolve?.();
    this._readyResolve = null;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Programmatically trigger the install flow.
   *
   * On Chrome/Android/Desktop: calls the deferred browser prompt.
   * On iOS: this is a no-op — the UI layer should show manual instructions.
   * Returns the user's outcome: 'accepted' | 'dismissed' | 'ios' | 'unsupported'
   */
  async install(): Promise<'accepted' | 'dismissed' | 'ios' | 'unsupported'> {
    if (this.state.platform === 'ios-safari') {
      // Can't programmatically install on iOS — UI should show instructions
      this.config.onInstall();
      return 'ios';
    }

    if (!this.state.deferredPrompt) {
      return 'unsupported';
    }

    this.config.onInstall();
    await this.state.deferredPrompt.prompt();
    const { outcome } = await this.state.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      recordInstalled();
      this._setStatus('installed');
      this.config.onInstalled();
      this.emit('installed', undefined as void);
      return 'accepted';
    } else {
      this.dismiss();
      return 'dismissed';
    }
  }

  /**
   * Record that the user dismissed the prompt and emit the event.
   */
  dismiss(): void {
    recordDismissal();
    this._setStatus('dismissed');
    this.config.onDismiss();
    this.emit('dismissed', undefined as void);
  }

  /**
   * Resets all stored state. Useful for dev/testing.
   */
  reset(): void {
    clearStorage();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Read-only accessors for external consumers
  // ─────────────────────────────────────────────────────────────────────────

  get status(): InstallStatus {
    return this.state.status;
  }

  get platform() {
    return this.state.platform;
  }

  get isInstallable(): boolean {
    return this.state.status === 'installable';
  }

  get isInstalled(): boolean {
    return this.state.status === 'installed';
  }
}
