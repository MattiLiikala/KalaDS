import type { Preview } from '@storybook/web-components';
// Self-hosted fonts matching the font.family tokens, so Storybook never falls back to system fonts.
// Weights follow font.weight (300 / 400 / 700); Overlock has no 300, so light renders at 400.
import '@fontsource/overlock/400.css';
import '@fontsource/overlock/400-italic.css';
import '@fontsource/overlock/700.css';
import '@fontsource/overlock/700-italic.css';
import '@fontsource/parkinsans/300.css';
import '@fontsource/parkinsans/400.css';
import '@fontsource/parkinsans/700.css';
import '@kalads/tokens/css';
import '@kalads/components';

/** Font faces stories depend on. Browsers load fonts lazily, so request them all before rendering. */
const FONTS = [
  '400 1em Overlock',
  'italic 400 1em Overlock',
  '700 1em Overlock',
  'italic 700 1em Overlock',
  '300 1em Parkinsans',
  '400 1em Parkinsans',
  '700 1em Parkinsans',
];

let fontsReady: Promise<unknown> | undefined;

const preview: Preview = {
  loaders: [
    // Render stories only once the real fonts are available, so layout and button knockout masks are
    // never computed against fallback fonts.
    async () => {
      fontsReady ??= Promise.all(FONTS.map((font) => document.fonts.load(font))).catch(() => undefined);
      await fontsReady;
      return {};
    },
  ],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8fafc' },
        { name: 'dark', value: '#0f172a' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
