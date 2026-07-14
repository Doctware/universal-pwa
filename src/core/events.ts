/**
 * events.ts — A tiny, typed EventEmitter for internal pub/sub.
 * No Node.js dependency — works in any browser.
 */

type EventHandler<T = unknown> = (payload: T) => void;

export class EventEmitter<Events extends Record<string, unknown>> {
  private _listeners: Partial<{
    [K in keyof Events]: Array<EventHandler<Events[K]>>;
  }> = {};

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): this {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event]!.push(handler);
    return this;
  }

  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): this {
    const list = this._listeners[event];
    if (!list) return this;
    this._listeners[event] = list.filter((h) => h !== handler) as Array<EventHandler<Events[K]>>;
    return this;
  }

  once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): this {
    const wrapper: EventHandler<Events[K]> = (payload) => {
      handler(payload);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const list = this._listeners[event];
    if (!list) return;
    list.forEach((handler) => handler(payload));
  }
}

/** All events the engine can emit */
export interface EngineEvents extends Record<string, unknown> {
  /** Engine is ready and has determined install status */
  ready: { status: string; platform: string };
  /** The browser fired beforeinstallprompt — we can now show our UI */
  installable: void;
  /** User clicked "Install" and the outcome was 'accepted' */
  installed: void;
  /** User clicked "Not now" */
  dismissed: void;
  /** An error occurred */
  error: Error;
}
