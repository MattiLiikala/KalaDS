import { addons } from '@storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { kaladsThemes, themeName, THEME_GLOBAL, TOKENS, type ThemeName } from './kalads-theme';

addons.setConfig({
  theme: kaladsThemes.light,
  sidebar: { showRoots: true },
});

/*
 * What the theme can't set: the sidebar icon colours (Storybook's defaults for documents, stories and
 * folders are orange, teal and purple) and the brand title size. Storybook's interface can't read the
 * token CSS variables, so the values come from the JS tokens of the active theme.
 *
 * The selected row: Storybook paints it with colorSecondary and white text. In light that is the accent
 * fill; in dark the accent is a light pink that white text can't be read on, so the row uses the subtle
 * accent fill and its label colour instead, as the selected Drawer and List items do, and the other
 * rows hover on the next surface step rather than Storybook's saturated pink. (The id outranks
 * Storybook's own rules, which it injects after these.)
 */
const style = document.createElement('style');
document.head.append(style);

function sidebarStyles(theme: ThemeName) {
  const t = TOKENS[theme];
  style.textContent = `
  .sidebar-header a[href="./"] {
    font-family: ${t.FontFamilyHeading};
    font-size: ${t.FontSize500};
    font-weight: ${t.FontWeightBold};
    color: ${t.SemanticTextDefault};
  }
  .sidebar-header a[href="./"] img {
    height: ${t.SemanticSpacing2xl};
    width: auto;
  }
  .sidebar-item[data-nodetype="document"]:not([data-selected="true"]) svg {
    color: ${t.SemanticInteractiveAccent};
  }
  .sidebar-item[data-nodetype="story"]:not([data-selected="true"]) svg {
    color: ${t.SemanticInteractiveSecondary};
  }
  .sidebar-item[data-nodetype="group"]:not([data-selected="true"]) svg {
    color: ${t.SemanticTextSubtle};
  }
${
  theme === 'dark'
    ? `  #storybook-explorer-tree .sidebar-item[data-selected="true"] {
    background: ${t.SemanticInteractiveAccentSubtle};
    color: ${t.SemanticInteractiveOnAccentSubtle};
  }
  #storybook-explorer-tree .sidebar-item[data-selected="true"]:hover {
    background: ${t.SemanticInteractiveAccentSubtleHover};
  }
  #storybook-explorer-tree .sidebar-item[data-selected="true"] :is(a, button, svg) {
    color: ${t.SemanticInteractiveOnAccentSubtle};
  }
  #storybook-explorer-tree .sidebar-item:not([data-selected="true"]):is(:hover, :focus) {
    background: ${t.SemanticBgMuted};
  }`
    : ''
}`;
}
sidebarStyles('light');

// The interface follows the dark mode switch in the toolbar (the `theme` global, set in preview.ts).
addons.register('kalads/theme', (api) => {
  let current: ThemeName = 'light';
  const apply = ({ globals }: { globals?: Record<string, unknown> }) => {
    const next = themeName(globals?.[THEME_GLOBAL]);
    if (next === current) return;
    current = next;
    api.setOptions({ theme: kaladsThemes[next] });
    sidebarStyles(next);
  };
  api.getChannel()?.on(SET_GLOBALS, apply);
  api.getChannel()?.on(GLOBALS_UPDATED, apply);
});
