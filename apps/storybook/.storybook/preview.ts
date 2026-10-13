import type { Preview } from '@storybook/web-components';
// Self-hosted fonts matching the font.family tokens, so Storybook never falls back to system fonts.
// Weights follow font.weight (300 / 400 / 500 / 700). Overlock has no 300 or 500, so those render at 400.
import '@fontsource/overlock/400.css';
import '@fontsource/overlock/400-italic.css';
import '@fontsource/overlock/700.css';
import '@fontsource/overlock/700-italic.css';
import '@fontsource/parkinsans/300.css';
import '@fontsource/parkinsans/400.css';
import '@fontsource/parkinsans/500.css';
import '@fontsource/parkinsans/700.css';
import '@kalads/tokens/css';
import '@kalads/components';

// Page defaults from the semantic tokens, as an app using KalaDS would set them. Without this, text that
// inherits its font (kds-link outside a kds-typography, slotted labels) falls back to the browser's serif.
const baseStyles = document.createElement('style');
baseStyles.textContent = `
  body {
    font-family: var(--kds-semantic-font-body);
    color: var(--kds-semantic-text-default);
  }
`;
document.head.append(baseStyles);

// Example links in stories (href="#" and the like) must not navigate the preview iframe away from the story.
// Links inside shadow roots are found through the composed path. Links opening a new tab still work, and
// the docs page's own links (table of contents) are left alone.
document.addEventListener(
  'click',
  (e) => {
    const path = e.composedPath();
    const inStory = path.some((n) => n instanceof Element && n.matches('#storybook-root, .docs-story'));
    const link = path.find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement && n.hasAttribute('href'));
    if (inStory && link && link.target !== '_blank') e.preventDefault();
  },
  { capture: true },
);

/** Font faces stories depend on. Browsers load fonts lazily, so request them all before rendering. */
const FONTS = [
  '400 1em Overlock',
  'italic 400 1em Overlock',
  '700 1em Overlock',
  'italic 700 1em Overlock',
  '300 1em Parkinsans',
  '400 1em Parkinsans',
  '500 1em Parkinsans',
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
      source: {
        // The code snippet is serialised from the rendered DOM, where boolean attributes read `interactive=""`.
        // Show them the way they're written: `interactive`.
        transform: (code: string) => code.replace(/(\s[\w-]+)=""/g, '$1'),
      },
    },
  },
};

export default preview;
