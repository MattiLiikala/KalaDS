import type { StorybookConfig } from '@storybook/web-components-vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: [
    // Font files for Storybook's own interface (see manager-head.html).
    { from: '../node_modules/@fontsource/overlock/files', to: '/fonts/overlock' },
    { from: '../node_modules/@fontsource/parkinsans/files', to: '/fonts/parkinsans' },
  ],
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    const existing = config.resolve.alias ?? [];
    // Exact matches only, so subpaths such as @kalads/web-components/custom-elements.json resolve normally.
    config.resolve.alias = [
      ...(Array.isArray(existing) ? existing : Object.entries(existing).map(([find, replacement]) => ({ find, replacement }))),
      { find: /^@kalads\/web-components$/, replacement: resolve(__dirname, '../../../packages/web-components/src/index.ts') },
      { find: /^@kalads\/icons$/, replacement: resolve(__dirname, '../../../packages/icons/src/index.ts') },
    ];
    return config;
  },
};

export default config;
