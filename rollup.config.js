import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const coreInput = 'src/index.ts';
const reactInput = 'src/react/index.ts';

// React is a peer dep — always treat it as external in React bundles
const reactExternal = ['react', 'react-dom', 'react/jsx-runtime'];

export default [
  // ─── Core bundles (no React) ───────────────────────────────────────────────
  {
    input: coreInput,
    output: { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    plugins: [resolve(), typescript()],
  },
  {
    input: coreInput,
    output: { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
    plugins: [resolve(), typescript()],
  },
  {
    input: coreInput,
    output: { file: 'dist/index.umd.js', format: 'umd', name: 'UniversalPWA', sourcemap: true },
    plugins: [resolve(), typescript(), terser()],
  },

  // ─── React bundles ─────────────────────────────────────────────────────────
  {
    input: reactInput,
    external: reactExternal,
    output: {
      file: 'dist/react/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [resolve(), typescript({ tsconfig: './tsconfig.json' })],
  },
  {
    input: reactInput,
    external: reactExternal,
    output: {
      file: 'dist/react/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [resolve(), typescript({ tsconfig: './tsconfig.json' })],
  },
];
