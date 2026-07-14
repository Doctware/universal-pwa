# Contributing to universal-pwa

First off — thank you! Every contribution helps make PWA installation better for every developer.

## Getting Started

```bash
git clone https://github.com/doctwaretech/universal-pwa.git
cd universal-pwa
npm install
npm run dev       # rebuilds on every file change
```

## Project Structure

```
universal-pwa/
├── src/
│   ├── core/
│   │   ├── engine.ts      # Main install logic — most PRs start here
│   │   ├── platform.ts    # Browser/OS detection
│   │   ├── storage.ts     # localStorage persistence
│   │   └── events.ts      # Typed EventEmitter
│   ├── ui/
│   │   ├── component.ts   # Shadow DOM UI component
│   │   ├── styles.ts      # All CSS (Shadow DOM scoped)
│   │   └── templates.ts   # HTML templates
│   ├── react/
│   │   ├── usePWAInstall.ts    # React hook
│   │   ├── PWAInstallButton.tsx # React component
│   │   └── index.ts
│   ├── types.ts           # Shared TypeScript types
│   └── index.ts           # Public entry point
├── examples/
│   └── vanilla/           # Live demo — test your changes here
└── dist/                  # Built output (do not edit directly)
```

## Making a Change

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Make your changes in `src/`
4. Run `npm run build` to verify it compiles
5. Test your change in `examples/vanilla/index.html`
6. Open a PR with a clear description

## Adding a New Framework Wrapper

We welcome Vue, Svelte, and Angular wrappers! The pattern is:

1. Create `src/vue/index.ts` (or `svelte/`, `angular/`)
2. Import `InstallEngine` from `'../core/engine'`
3. Wrap it with the framework's reactivity primitives
4. Add a new rollup entry in `rollup.config.js`
5. Add a new `exports` entry in `package.json`

## Reporting a Bug

Please include:
- Browser + OS
- Expected behaviour
- Actual behaviour
- Minimal reproduction (CodeSandbox link preferred)

## Code Style

- TypeScript strict mode — no `any` without justification
- No external runtime dependencies in `core/` or `ui/`
- All public APIs must have JSDoc comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
