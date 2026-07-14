/**
 * templates.ts — HTML template strings for the install prompt.
 *
 * Produces clean, semantic HTML injected into the Shadow DOM.
 * All text is configurable via the config object.
 */

import type { UniversalPWAConfig, Platform } from '../types';

interface TemplateOptions {
  config: UniversalPWAConfig;
  platform: Platform;
}

/** Renders the main prompt card HTML */
export function renderPromptTemplate({ config, platform }: TemplateOptions): string {
  const appName = config.appName ?? document.title ?? 'This App';
  const desc = config.description ?? 'Install this app on your device for quick and easy access anytime.';
  const installLabel = config.installLabel ?? 'Install App';
  const dismissLabel = config.dismissLabel ?? 'Not now';
  const isIOS = platform === 'ios-safari';

  const iconHtml = config.iconUrl
    ? `<img class="app-icon" src="${config.iconUrl}" alt="${appName} icon" />`
    : `<div class="app-icon-placeholder">${ICON_APP}</div>`;

  return `
    <div class="backdrop" id="kit-backdrop" role="presentation"></div>
    <div class="card" role="dialog" aria-modal="true" aria-labelledby="kit-app-name">
      <button class="btn-close" id="kit-close" aria-label="Close install prompt">
        ${ICON_CLOSE}
      </button>

      <div class="header">
        ${iconHtml}
        <div class="header-text">
          <div class="badge">${ICON_SHIELD} Verified App</div>
          <div class="app-name" id="kit-app-name">${appName}</div>
        </div>
      </div>

      <p class="app-desc">${desc}</p>

      <div class="perks">
        <div class="perk">${ICON_BOLT} Works Offline</div>
        <div class="perk">${ICON_BELL} Push Notifications</div>
        <div class="perk">${ICON_LOCK} No App Store needed</div>
      </div>

      <div class="actions">
        <button class="btn-install" id="kit-install">
          ${ICON_DOWNLOAD}
          ${isIOS ? 'How to Install' : installLabel}
        </button>
        <button class="btn-dismiss" id="kit-dismiss">${dismissLabel}</button>
      </div>

      ${isIOS ? renderIOSSteps() : ''}
    </div>
  `;
}

/** Renders the iOS manual instructions panel */
function renderIOSSteps(): string {
  return `
    <div class="ios-steps" id="kit-ios-steps">
      <div class="ios-step">
        <div class="ios-step-num">1</div>
        <span>Tap the <span class="ios-step-icon">${ICON_SHARE} Share</span> button at the bottom of your browser</span>
      </div>
      <div class="ios-step">
        <div class="ios-step-num">2</div>
        <span>Scroll down and tap <span class="ios-step-icon">⊞ Add to Home Screen</span></span>
      </div>
      <div class="ios-step">
        <div class="ios-step-num">3</div>
        <span>Tap <strong>Add</strong> in the top right corner</span>
      </div>
    </div>
  `;
}

// ─── Inline SVG icons (no external deps) ────────────────────────────────────

const ICON_CLOSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
  <path d="M18 6 6 18M6 6l12 12"/>
</svg>`;

const ICON_DOWNLOAD = `<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2a1 1 0 0 1 1 1v10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L11 13.586V3a1 1 0 0 1 1-1ZM4 19a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2H4Z"/>
</svg>`;

const ICON_SHIELD = `<svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
</svg>`;

const ICON_BOLT = `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
  <path d="M13 2L4.09 12.26c-.28.33-.43.75-.43 1.19v.36c0 .66.3 1.27.81 1.69.51.41 1.17.6 1.83.49L10 15.3V22l8.91-10.26c.28-.33.43-.75.43-1.19v-.36c0-.66-.3-1.27-.81-1.69-.51-.41-1.17-.6-1.83-.49L13 8.7V2z"/>
</svg>`;

const ICON_BELL = `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
</svg>`;

const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
</svg>`;

const ICON_SHARE = `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
  <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
</svg>`;

const ICON_APP = `<svg viewBox="0 0 24 24">
  <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm7 14l5-5-1.41-1.41L12 14.17l-2.59-2.58L8 13l4 4z"/>
</svg>`;
