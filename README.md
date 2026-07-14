# universal-pwa

> A universal, framework-agnostic PWA install prompt library. Drop-in ready for any web application in under 60 seconds.

[![npm version](https://img.shields.io/npm/v/universal-pwa.svg?style=flat-square&color=6200ee)](https://www.npmjs.com/package/universal-pwa)
[![bundle size](https://img.shields.io/bundlephobia/minzip/universal-pwa?style=flat-square&color=22c55e&label=core%20size)](https://bundlephobia.com/package/universal-pwa)
[![license](https://img.shields.io/npm/l/universal-pwa?style=flat-square&color=64748b)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-3178c6?style=flat-square)](https://www.typescriptlang.org/)

---

## Why universal-pwa?

Every PWA needs an install prompt. But every developer ends up re-implementing the same messy browser API from scratch — fighting `beforeinstallprompt`, iOS quirks, cooldown logic, and custom UI.

**universal-pwa** solves this once, for everyone:

| Feature | Other libs | universal-pwa |
|---|---|---|
| Single `<script>` CDN drop-in | ❌ | ✅ |
| No framework required | Partial | ✅ |
| iOS Safari step-by-step guide | ❌ | ✅ |
| Shadow DOM — zero style conflicts | ❌ | ✅ |
| Dismissal cooldown management | ❌ | ✅ |
| Headless mode (bring your own UI) | ❌ | ✅ |
| React hook + component | ❌ | ✅ |
| Typed event system | ❌ | ✅ |
| SSR / Next.js safe | ❌ | ✅ |

---

## Quick Start

### Option 1 — CDN (works on **any** website)

Drop one line into any HTML page. Works with WordPress, Laravel, Django, Rails, plain HTML — everything.

```html
<script src="https://cdn.jsdelivr.net/npm/universal-pwa/dist/index.umd.js"></script>
<script>
  UniversalPWA.init({
    appName: 'My App',
    themeColor: '#6200ee',
  })
</script>
```

### Option 2 — npm

```bash
npm install universal-pwa
```

```js
import { init } from 'universal-pwa'

init({
  appName: 'My App',
  themeColor: '#6200ee',
  position: 'bottom',
})
```

### Option 3 — React

```bash
npm install universal-pwa
```

```tsx
import { usePWAInstall } from 'universal-pwa/react'

function InstallButton() {
  const { isInstallable, install, isIOS } = usePWAInstall({
    appName: 'My App',
  })

  if (!isInstallable) return null

  return (
    <button onClick={install}>
      {isIOS ? 'How to Install' : 'Install App'}
    </button>
  )
}
```

Or use the ready-made component:

```tsx
import { PWAInstallButton } from 'universal-pwa/react'

function App() {
  return <PWAInstallButton appName="My App" themeColor="#6200ee" />
}
```

---

## Platform Support

| Platform | Strategy |
|---|---|
| ✅ Chrome / Android | Intercepts `beforeinstallprompt`, calls `.prompt()` |
| ✅ Chrome Desktop | Same as mobile |
| ✅ Edge | Same as Chrome |
| ✅ Samsung Internet | Same as Chrome |
| ✅ iOS Safari | Shows step-by-step "Add to Home Screen" guide |
| ⚠️ Firefox | Marks as unsupported (Firefox lacks PWA install support) |
| ✅ Already installed | Detects `standalone` mode — stays silent automatically |

---

## Configuration

All options are optional.

```ts
init({
  // App display name shown in the prompt
  appName?: string               // default: document.title

  // App icon URL shown in the prompt
  iconUrl?: string               // default: gradient placeholder

  // Primary theme/accent color
  themeColor?: string            // default: '#6200ee'

  // Where the prompt appears
  position?: 'bottom'            // default: 'bottom'
            | 'top'
            | 'bottom-left'
            | 'bottom-right'

  // Delay before showing the prompt (ms)
  delay?: number                 // default: 3000

  // Days before re-showing after a dismissal
  dismissCooldownDays?: number   // default: 3

  // Custom description text
  description?: string

  // Custom button labels
  installLabel?: string          // default: 'Install App'
  dismissLabel?: string          // default: 'Not now'

  // Lifecycle callbacks
  onInstall?: () => void
  onDismiss?: () => void
  onInstalled?: () => void
})
```

---

## Headless Mode (Bring Your Own UI)

Skip the default UI entirely and drive everything with events:

```js
import { createEngine } from 'universal-pwa'

const engine = createEngine({ appName: 'My App', delay: 0 })

// Listen for when the app is ready to install
engine.on('installable', () => {
  myCustomBanner.show()
})

// Trigger install from your own button
myInstallButton.addEventListener('click', async () => {
  const outcome = await engine.install() // 'accepted' | 'dismissed' | 'ios' | 'unsupported'
  console.log('User choice:', outcome)
})

// Dismiss
myDismissButton.addEventListener('click', () => engine.dismiss())
```

### Engine Events

| Event | Payload | Description |
|---|---|---|
| `ready` | `{ status, platform }` | Engine initialized |
| `installable` | — | Prompt is ready to show |
| `installed` | — | User accepted & app installed |
| `dismissed` | — | User clicked "Not now" |
| `error` | `Error` | Something went wrong |

### Engine API

```ts
engine.status         // 'installable' | 'installed' | 'dismissed' | 'unsupported'
engine.platform       // 'chrome-android' | 'ios-safari' | 'chrome-desktop' | ...
engine.isInstallable  // boolean
engine.isInstalled    // boolean

await engine.install()  // triggers the browser install prompt
engine.dismiss()        // records dismissal with cooldown
engine.reset()          // clears stored state (useful for testing)
```

---

## React API Reference

### `usePWAInstall(config?)`

```ts
const {
  status,         // 'installable' | 'installed' | 'dismissed' | 'unsupported'
  platform,       // detected platform string
  isInstallable,  // boolean — show your install button when true
  isInstalled,    // boolean — app is already installed
  isIOS,          // boolean — true on iOS Safari
  isReady,        // boolean — engine has finished initializing
  install,        // async () => 'accepted' | 'dismissed' | 'ios' | 'unsupported'
  dismiss,        // () => void
  reset,          // () => void — for dev/testing
} = usePWAInstall(config?)
```

### `<PWAInstallButton />`

```tsx
<PWAInstallButton
  appName="My App"
  themeColor="#6200ee"
  installLabel="Get the App"
  dismissLabel="No thanks"
  position="bottom"
  hideWhenNotInstallable={true}  // hides the button if not installable (default: true)
  onInstalled={() => console.log('installed!')}
/>
```

---

## How It Works

```
┌─────────────────────────────────────────────┐
│            Your Web App (any stack)          │
│                                              │
│   <script src="universal-pwa.umd.js">     │
│   UniversalPWA.init({ appName: 'App' })    │
│                                              │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              InstallEngine                   │
│                                              │
│  1. detectPlatform()  ──► Chrome / iOS?     │
│  2. isAlreadyInstalled? ──► silent exit     │
│  3. isDismissedRecently? ──► respect sleep  │
│  4. listen for `beforeinstallprompt`        │
│  5. emit('installable') after delay         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         UIComponent (Shadow DOM)             │
│                                              │
│  • Hermetically sealed CSS                  │
│  • Cannot conflict with host app styles     │
│  • Smooth slide-up animation                │
│  • iOS step-by-step instructions            │
│  • Keyboard (Escape) support                │
└─────────────────────────────────────────────┘
```

---

## Requirements

Your web app must have a valid `manifest.json` for the browser to consider it installable:

```json
{
  "name": "My App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Contributing

Pull requests are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

```bash
git clone https://github.com/doctwaretech/universal-pwa.git
cd universal-pwa
npm install
npm run dev       # watch mode
npm run build     # production build
```

---

## License

MIT © [Olayode Yusuf Alani (Doctware) - DoctwareTECH](https://github.com/Doctware)
