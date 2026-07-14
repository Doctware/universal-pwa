/**
 * All TypeScript types for the universal-pwa public API.
 */

/** Supported browsers/platforms for conditional logic */
export type Platform = 
  | 'chrome-android'
  | 'chrome-desktop'
  | 'edge'
  | 'ios-safari'
  | 'firefox'
  | 'samsung'
  | 'unsupported';

/** Current install status of the PWA */
export type InstallStatus = 
  | 'installable'      // browser is ready & user hasn't dismissed
  | 'installed'        // app is already running in standalone/installed mode
  | 'dismissed'        // user clicked "Not now"
  | 'unsupported';     // browser can't install PWAs

/** Where the install prompt UI appears */
export type PromptPosition = 'bottom' | 'top' | 'bottom-left' | 'bottom-right';

/** User-facing configuration options */
export interface UniversalPWAConfig {
  /** App name shown in the prompt. Defaults to document.title */
  appName?: string;

  /** App icon URL. Defaults to first manifest icon */
  iconUrl?: string;

  /** Primary theme color for the prompt UI */
  themeColor?: string;

  /** Where the prompt appears on screen */
  position?: PromptPosition;

  /** Delay in ms before the prompt is shown. Defaults to 3000 */
  delay?: number;

  /** How many days to wait before showing again after dismissal. Defaults to 3 */
  dismissCooldownDays?: number;

  /** Custom description text shown in the prompt */
  description?: string;

  /** Custom install button label. Defaults to "Install App" */
  installLabel?: string;

  /** Custom dismiss button label. Defaults to "Not now" */
  dismissLabel?: string;

  /** Called when user clicks install */
  onInstall?: () => void;

  /** Called when user dismisses the prompt */
  onDismiss?: () => void;

  /** Called when app install is confirmed by the browser */
  onInstalled?: () => void;
}

/** Internal engine state shape */
export interface EngineState {
  status: InstallStatus;
  platform: Platform;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

/** Augment the native event with the non-standard `prompt()` method */
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
