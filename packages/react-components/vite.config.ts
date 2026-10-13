import { defineConfig } from 'vitest/config';
import { basename } from 'path';

export default defineConfig({
  css: {
    modules: {
      // Readable, stable class names: Button.module.css `.root` → `kds-button-root`.
      generateScopedName: (local, file) => `kds-${basename(file).replace(/\.module\.css.*$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}-${local}`,
    },
  },
  esbuild: { jsx: 'automatic' },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@kalads\//],
    },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
