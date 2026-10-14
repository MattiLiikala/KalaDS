import { setCustomElementsManifest, type Preview } from '@storybook/web-components';
import { addons } from 'storybook/internal/preview-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import manifest from '@kalads/web-components/custom-elements.json';
import { kaladsThemes, themeName, THEME_GLOBAL } from './kalads-theme';
import { ComponentDocsPage, ThemedDocsContainer } from '../src/docs-blocks';
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
import '@kalads/web-components';
import './docs.css';

// Props tables (attributes, properties, slots, events, CSS parts) come from the analyser's manifest,
// which is generated from each component's JSDoc on every components build.
setCustomElementsManifest(publicApi(manifest));

/**
 * The analyser lists every class member, including private state (`_hasHeader`), static Lit config
 * (`styles`, `shadowRootOptions`) and protected helpers. Keep only the public API in the props tables.
 */
function publicApi(cem: typeof manifest): typeof manifest {
  type Member = { name: string; static?: boolean; privacy?: string };
  const isPublic = (m: Member) => !m.static && !m.privacy && !m.name.startsWith('_') && !m.name.startsWith('#');
  return {
    ...cem,
    modules: cem.modules.map((mod) => ({
      ...mod,
      declarations: mod.declarations?.map((d) =>
        'members' in d && Array.isArray(d.members) ? { ...d, members: (d.members as Member[]).filter(isPublic) } : d,
      ),
    })),
  } as typeof manifest;
}

// Page defaults from the semantic tokens, as an app using KalaDS would set them. Without this, text that
// inherits its font (kds-link outside a kds-typography, slotted labels) falls back to the browser's serif.
const baseStyles = document.createElement('style');
baseStyles.textContent = `
  body {
    font-family: var(--kds-semantic-font-body);
    color: var(--kds-semantic-text-default);
    background: var(--kds-semantic-bg-default);
  }
`;
document.head.append(baseStyles);

/*
 * Dark mode, as an app turns it on: data-kds-theme on <html>. The toolbar switch sets the `theme` global;
 * the globals events reach every page, including docs pages without stories, where no decorator runs.
 * The manager (manager.ts) and the docs frame (ThemedDocsContainer) follow the same global.
 */
const applyTheme = (globals?: Record<string, unknown>) => {
  document.documentElement.dataset.kdsTheme = themeName(globals?.[THEME_GLOBAL]);
};
applyTheme();
addons.getChannel().on(SET_GLOBALS, ({ globals }) => applyTheme(globals));
addons.getChannel().on(GLOBALS_UPDATED, ({ globals }) => applyTheme(globals));

// Storybook's containers for the story and the docs page have no landmark role. Only one is shown at a
// time (the other is display: none), so each page gets exactly one main landmark.
for (const id of ['storybook-root', 'storybook-docs']) document.getElementById(id)?.setAttribute('role', 'main');

// Example links in stories and Do / Don't examples (href="#" and the like) must not navigate the preview
// iframe away from the page.
// Links inside shadow roots are found through the composed path. Links opening a new tab still work, and
// the docs page's own links (table of contents) are left alone.
document.addEventListener(
  'click',
  (e) => {
    const path = e.composedPath();
    const inStory = path.some((n) => n instanceof Element && n.matches('#storybook-root, .docs-story, .kds-docs-example'));
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
  // Stories render on their component's docs page only: the sidebar lists one page per component.
  // `!dev` removes a story from the sidebar but keeps it in docs (and reachable by its iframe URL).
  tags: ['!dev'],
  globalTypes: {
    [THEME_GLOBAL]: {
      description: 'Colour theme of the components, the docs and the Storybook interface',
      toolbar: {
        title: 'Theme',
        icon: 'sun',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { [THEME_GLOBAL]: 'light' },
  decorators: [
    (story, context) => {
      applyTheme(context.globals);
      return story();
    },
  ],
  loaders: [
    // Render stories only once the real fonts are available, so layout is never measured against
    // fallback fonts.
    async () => {
      fontsReady ??= Promise.all(FONTS.map((font) => document.fonts.load(font))).catch(() => undefined);
      await fontsReady;
      return {};
    },
  ],
  parameters: {
    // Canvas backgrounds follow the theme (the page background is bg.default); use kds-box for other
    // surfaces in a story.
    backgrounds: { disable: true },
    options: {
      storySort: {
        // Sections in this order; pages inside a section alphabetically.
        method: 'alphabetical',
        order: [
          'Introduction',
          'Getting Started',
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Shadows', 'Icons'],
          'Components',
          ['Inputs', 'Data Display', 'Feedback', 'Surfaces', 'Navigation', 'Layout'],
          'Guidelines',
          ['Accessibility', 'Buttons and Surfaces', 'Dark Mode', 'Writing', 'Agent Skills'],
        ],
      },
    },
    docs: {
      theme: kaladsThemes.light,
      container: ThemedDocsContainer,
      // Generated component pages share one layout (src/docs-blocks/ComponentDocsPage.tsx).
      page: ComponentDocsPage,
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
