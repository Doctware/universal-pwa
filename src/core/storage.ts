/**
 * storage.ts — Manages install preference state in localStorage.
 * Handles dismissal cooldowns so we don't spam users.
 */

const STORAGE_KEY = 'pwa_install_kit';

interface StoredState {
  dismissedAt: number | null;
  installedAt: number | null;
}

function load(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { dismissedAt: null, installedAt: null };
    return JSON.parse(raw) as StoredState;
  } catch {
    return { dismissedAt: null, installedAt: null };
  }
}

function save(state: StoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may not be available in some privacy modes — fail silently
  }
}

/**
 * Records the exact timestamp when the user dismissed the prompt.
 */
export function recordDismissal(): void {
  save({ ...load(), dismissedAt: Date.now() });
}

/**
 * Records when the app was confirmed installed.
 */
export function recordInstalled(): void {
  save({ ...load(), installedAt: Date.now() });
}

/**
 * Returns true if the user already installed the app.
 */
export function hasInstalled(): boolean {
  return load().installedAt !== null;
}

/**
 * Returns true if the user dismissed WITHIN the cooldown window.
 * If cooldownDays have passed, returns false (show the prompt again).
 */
export function isDismissedWithinCooldown(cooldownDays: number): boolean {
  const { dismissedAt } = load();
  if (!dismissedAt) return false;

  const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
  return Date.now() - dismissedAt < cooldownMs;
}

/**
 * Resets stored state — useful for testing or if a developer calls .reset()
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
}
