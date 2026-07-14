/**
 * PWAInstallButton.tsx — A ready-to-use, fully styled React component.
 *
 * Renders an install button that:
 * - Automatically hides when the app is already installed or unsupported
 * - Shows a native install prompt on Android/Chrome
 * - Shows iOS instructions via a popover on iOS Safari
 * - Accepts full styling customization via className / style props
 *
 * Usage:
 *   <PWAInstallButton appName="My App" themeColor="#6200ee" />
 *
 * Or custom children:
 *   <PWAInstallButton appName="My App">
 *     <MyCustomButton />
 *   </PWAInstallButton>
 */

import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import type { UniversalPWAConfig } from '../types';

export interface PWAInstallButtonProps extends UniversalPWAConfig {
  /** Custom class name for the button */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Custom children — replaces the default button UI */
  children?: React.ReactNode;
  /** Hides the button instead of disabling it when not installable */
  hideWhenNotInstallable?: boolean;
}

export function PWAInstallButton({
  className,
  style,
  children,
  hideWhenNotInstallable = true,
  ...config
}: PWAInstallButtonProps) {
  const { isInstallable, isIOS, install, dismiss, isReady } = usePWAInstall(config);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Don't render until engine is ready (avoids flicker on initial load)
  if (!isReady) return null;

  // Hide if not installable and hideWhenNotInstallable is true
  if (hideWhenNotInstallable && !isInstallable) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
    } else {
      await install();
    }
  };

  if (children) {
    return (
      <>
        <span onClick={handleClick} style={{ display: 'contents' }}>
          {children}
        </span>
        {showIOSGuide && (
          <IOSGuide onClose={() => { setShowIOSGuide(false); dismiss(); }} />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          height: 44,
          padding: '0 20px',
          background: config.themeColor ?? '#6200ee',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          ...style,
        }}
        aria-label={`Install ${config.appName ?? 'this app'}`}
      >
        <DownloadIcon />
        {isIOS ? 'How to Install' : (config.installLabel ?? 'Install App')}
      </button>

      {showIOSGuide && (
        <IOSGuide onClose={() => { setShowIOSGuide(false); dismiss(); }} />
      )}
    </>
  );
}

// ─── iOS Guide Popover ────────────────────────────────────────────────────────

function IOSGuide({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How to install on iOS"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 20,
          padding: 24,
          maxWidth: 380,
          width: '100%',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <p style={{ fontWeight: 800, fontSize: 17, color: '#1a1a2e' }}>Install on iOS</p>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' }}
            aria-label="Close"
          >×</button>
        </div>
        {[
          { step: 1, text: <>Tap the <strong>Share</strong> button (↑) at the bottom of Safari</> },
          { step: 2, text: <>Scroll down and tap <strong>Add to Home Screen</strong></> },
          { step: 3, text: <>Tap <strong>Add</strong> in the top right corner</> },
        ].map(({ step, text }) => (
          <div key={step} style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#6200ee', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              {step}
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.5, paddingTop: 4 }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inline icon ──────────────────────────────────────────────────────────────

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a1 1 0 0 1 1 1v10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L11 13.586V3a1 1 0 0 1 1-1ZM4 19a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2H4Z"/>
    </svg>
  );
}
