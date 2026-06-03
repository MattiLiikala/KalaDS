import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';

const entries = Object.fromEntries(
  glob.sync('src/**/*.ts').map((file) => [
    file.replace(/^src\//, '').replace(/\.ts$/, ''),
    resolve(__dirname, file),
  ]),
);

export default defineConfig({
  build: {
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'lit',
        'lit/decorators.js',
        'lit/directives/unsafe-svg.js',
        '@kalads/tokens',
        '@kalads/icons',
        /^lit\//,
      ],
    },
    outDir: 'dist',
    sourcemap: true,
  },
});
