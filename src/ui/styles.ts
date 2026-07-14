/**
 * styles.ts — All CSS for the install prompt UI.
 *
 * This runs INSIDE a Shadow DOM so it is 100% isolated.
 * It cannot be overridden by the host app's Bootstrap, Tailwind, or any other CSS.
 * It also cannot accidentally override the host app's styles.
 */

export const STYLES = `
  /* ─── Reset ───────────────────────────────────────────────────────────── */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ─── Host element ─────────────────────────────────────────────────────── */
  :host {
    --kit-primary:      var(--pwa-kit-color, #6200ee);
    --kit-primary-dark: color-mix(in srgb, var(--kit-primary) 80%, black);
    --kit-text:         #1a1a2e;
    --kit-subtext:      #64748b;
    --kit-bg:           #ffffff;
    --kit-border:       #e2e8f0;
    --kit-shadow:       0 20px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08);
    --kit-radius:       20px;
    --kit-font:         -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --kit-duration:     350ms;

    display: block;
    position: fixed;
    z-index: 2147483647; /* max z-index — always on top */
    pointer-events: none;
    inset: 0;
  }

  /* ─── Backdrop ─────────────────────────────────────────────────────────── */
  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    opacity: 0;
    transition: opacity var(--kit-duration) ease;
    pointer-events: none;
  }

  /* ─── Card ─────────────────────────────────────────────────────────────── */
  .card {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(calc(100% + 32px));
    bottom: 20px;
    width: min(420px, calc(100vw - 32px));
    background: var(--kit-bg);
    border-radius: var(--kit-radius);
    box-shadow: var(--kit-shadow);
    padding: 24px;
    font-family: var(--kit-font);
    color: var(--kit-text);
    pointer-events: all;
    transition: transform var(--kit-duration) cubic-bezier(0.34, 1.56, 0.64, 1),
                opacity var(--kit-duration) ease;
    opacity: 0;
    border: 1px solid var(--kit-border);
    will-change: transform;
  }

  /* ─── Position variants ─────────────────────────────────────────────────── */
  :host([position="top"]) .card {
    top: 20px;
    bottom: auto;
    transform: translateX(-50%) translateY(calc(-100% - 32px));
  }

  :host([position="bottom-left"]) .card {
    left: 16px;
    transform: translateX(0) translateY(calc(100% + 32px));
  }

  :host([position="bottom-right"]) .card {
    left: auto;
    right: 16px;
    transform: translateX(0) translateY(calc(100% + 32px));
  }

  /* ─── Visible state ─────────────────────────────────────────────────────── */
  :host(.visible) .backdrop {
    opacity: 1;
    pointer-events: all;
    cursor: pointer;
  }

  :host(.visible) .card {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }

  :host(.visible[position="top"]) .card {
    transform: translateX(-50%) translateY(0);
  }

  :host(.visible[position="bottom-left"]) .card,
  :host(.visible[position="bottom-right"]) .card {
    transform: translateX(0) translateY(0);
  }

  /* ─── App header row ────────────────────────────────────────────────────── */
  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
  }

  .app-icon {
    width: 60px;
    height: 60px;
    border-radius: 14px;
    object-fit: cover;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    border: 1px solid var(--kit-border);
    background: #f1f5f9;
  }

  .app-icon-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--kit-primary), var(--kit-primary-dark));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }

  .app-icon-placeholder svg {
    width: 30px;
    height: 30px;
    fill: white;
    opacity: 0.9;
  }

  .header-text {
    flex: 1;
    min-width: 0;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: color-mix(in srgb, var(--kit-primary) 12%, transparent);
    color: var(--kit-primary);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 100px;
    margin-bottom: 5px;
  }

  .app-name {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--kit-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .app-desc {
    font-size: 13px;
    color: var(--kit-subtext);
    line-height: 1.5;
    margin-top: 6px;
  }

  /* ─── Perks row ─────────────────────────────────────────────────────────── */
  .perks {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .perk {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--kit-subtext);
    background: #f8fafc;
    border: 1px solid var(--kit-border);
    padding: 5px 10px;
    border-radius: 100px;
  }

  .perk svg {
    width: 12px;
    height: 12px;
    color: var(--kit-primary);
  }

  /* ─── Action buttons ────────────────────────────────────────────────────── */
  .actions {
    display: flex;
    gap: 10px;
  }

  .btn-install {
    flex: 1;
    height: 46px;
    background: var(--kit-primary);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 4px 14px color-mix(in srgb, var(--kit-primary) 40%, transparent);
    letter-spacing: 0.01em;
    font-family: var(--kit-font);
  }

  .btn-install:hover {
    background: var(--kit-primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px color-mix(in srgb, var(--kit-primary) 50%, transparent);
  }

  .btn-install:active {
    transform: translateY(0);
  }

  .btn-install svg {
    width: 16px;
    height: 16px;
    fill: white;
    flex-shrink: 0;
  }

  .btn-dismiss {
    height: 46px;
    padding: 0 18px;
    background: transparent;
    color: var(--kit-subtext);
    border: 1.5px solid var(--kit-border);
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: var(--kit-font);
    white-space: nowrap;
  }

  .btn-dismiss:hover {
    background: #f8fafc;
    color: var(--kit-text);
    border-color: #cbd5e1;
  }

  /* ─── iOS Instructions panel ────────────────────────────────────────────── */
  .ios-steps {
    margin-top: 16px;
    display: none;
    flex-direction: column;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--kit-border);
  }

  .ios-steps.visible {
    display: flex;
  }

  .ios-step {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--kit-text);
    font-weight: 500;
  }

  .ios-step-num {
    width: 26px;
    height: 26px;
    background: var(--kit-primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .ios-step-icon {
    display: inline-flex;
    background: #f1f5f9;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 600;
    color: #0ea5e9;
    gap: 4px;
    align-items: center;
  }

  /* ─── Close button ────────────────────────────────────────────────────── */
  .btn-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 28px;
    height: 28px;
    background: #f1f5f9;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;
    color: var(--kit-subtext);
  }

  .btn-close:hover {
    background: #e2e8f0;
  }

  .btn-close svg {
    width: 14px;
    height: 14px;
  }

  /* ─── Responsive ────────────────────────────────────────────────────────── */
  @media (max-width: 460px) {
    .card {
      border-radius: 20px 20px 0 0;
      bottom: 0;
      width: 100%;
      left: 0;
      transform: translateX(0) translateY(calc(100% + 32px));
    }

    :host(.visible) .card {
      transform: translateX(0) translateY(0);
    }

    .perks {
      display: none;
    }
  }

  /* ─── Reduced motion ────────────────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .card, .backdrop {
      transition: none;
    }
  }
`;
