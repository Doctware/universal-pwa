/**
 * usePWAInstall.ts — React hook for universal-pwa.
 *
 * Wraps the InstallEngine with React state so components can
 * reactively re-render when the install status changes.
 *
 * Usage:
 *   const { isInstallable, install, dismiss, status, platform } = usePWAInstall({
 *     appName: 'My App',
 *     themeColor: '#6200ee',
 *   })
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { InstallEngine } from '../core/engine';
import type { UniversalPWAConfig, InstallStatus, Platform } from '../types';

export interface UsePWAInstallReturn {
  /** Current install status */
  status: InstallStatus;
  /** Detected browser/OS platform */
  platform: Platform | null;
  /** True if the prompt can be shown right now */
  isInstallable: boolean;
  /** True if the app is already installed */
  isInstalled: boolean;
  /** True on iOS — use this to show manual instructions */
  isIOS: boolean;
  /** Whether the engine has finished initializing */
  isReady: boolean;
  /**
   * Trigger the install flow.
   * Returns the outcome: 'accepted' | 'dismissed' | 'ios' | 'unsupported'
   */
  install: () => Promise<'accepted' | 'dismissed' | 'ios' | 'unsupported'>;
  /** Record that the user dismissed the prompt */
  dismiss: () => void;
  /** Reset stored preferences (for dev/testing) */
  reset: () => void;
}

export function usePWAInstall(config: UniversalPWAConfig = {}): UsePWAInstallReturn {
  const [status, setStatus] = useState<InstallStatus>('unsupported');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Use a ref for the engine so it's stable across renders
  const engineRef = useRef<InstallEngine | null>(null);

  // Serialize config to a stable string for useEffect dependency
  // (avoids reinstantiating the engine on every render if config is inline object)
  const configKey = JSON.stringify(config);

  useEffect(() => {
    // Only run in browser — guards against Next.js/SSR
    if (typeof window === 'undefined') return;

    const engine = new InstallEngine(config);
    engineRef.current = engine;

    engine.on('ready', ({ status: s, platform: p }) => {
      setStatus(s as InstallStatus);
      setPlatform(p as Platform);
      setIsReady(true);
    });

    engine.on('installable', () => {
      setStatus('installable');
    });

    engine.on('installed', () => {
      setStatus('installed');
    });

    engine.on('dismissed', () => {
      setStatus('dismissed');
    });

    return () => {
      // Cleanup: dereference the engine on unmount
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);

  const install = useCallback(async () => {
    if (!engineRef.current) return 'unsupported' as const;
    return engineRef.current.install();
  }, []);

  const dismiss = useCallback(() => {
    engineRef.current?.dismiss();
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset();
  }, []);

  return {
    status,
    platform,
    isInstallable: status === 'installable',
    isInstalled: status === 'installed',
    isIOS: platform === 'ios-safari',
    isReady,
    install,
    dismiss,
    reset,
  };
}
