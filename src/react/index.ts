/**
 * React entry point for universal-pwa.
 *
 * Import from 'universal-pwa/react' to get the React-specific API:
 *   import { usePWAInstall, PWAInstallButton } from 'universal-pwa/react'
 *
 * React is a peer dependency — bring your own React 16.8+.
 */

export { usePWAInstall } from './usePWAInstall';
export { PWAInstallButton } from './PWAInstallButton';
export type { UsePWAInstallReturn } from './usePWAInstall';
export type { PWAInstallButtonProps } from './PWAInstallButton';

// Re-export core types so consumers don't need to import from two places
export type {
  UniversalPWAConfig,
  InstallStatus,
  Platform,
  PromptPosition,
} from '../types';
