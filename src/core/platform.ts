/**
 * platform.ts — Detects the current browser/OS environment.
 * No dependencies. Works in any JS runtime that has a `navigator` global.
 */
import type { Platform } from '../types';

/**
 * Detects the current platform so the engine can apply the correct
 * install strategy.
 */
export function detectPlatform(): Platform {
  // Safety guard for SSR environments (Next.js, Nuxt, etc.)
  if (typeof navigator === 'undefined') return 'unsupported';

  const ua = navigator.userAgent;

  // iOS Safari — has to be handled differently (no beforeinstallprompt)
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isIOSSafari = isIOS && /safari/i.test(ua) && !/crios|fxios/i.test(ua);
  if (isIOSSafari) return 'ios-safari';

  // Samsung Internet Browser
  const isSamsung = /samsungbrowser/i.test(ua);
  if (isSamsung) return 'samsung';

  // Microsoft Edge
  const isEdge = /edg\//i.test(ua);
  if (isEdge) return 'edge';

  // Firefox — PWA install is not well supported
  const isFirefox = /firefox/i.test(ua);
  if (isFirefox) return 'firefox';

  // Chrome on Android
  const isChrome = /chrome/i.test(ua) && !/chromium/i.test(ua);
  const isAndroid = /android/i.test(ua);
  if (isChrome && isAndroid) return 'chrome-android';

  // Chrome on Desktop
  if (isChrome) return 'chrome-desktop';

  return 'unsupported';
}

/**
 * Returns true if the app is already running in installed/standalone mode.
 * This covers Android (display-mode) and iOS (navigator.standalone).
 */
export function isAlreadyInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  const standaloneMedia = window.matchMedia('(display-mode: standalone)');
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;

  return standaloneMedia.matches || iosStandalone;
}
