import { addons } from '@storybook/manager-api';
import {
  ColorSecondary500,
  FontFamilyHeading,
  FontSize500,
  FontWeightBold,
  SemanticInteractiveAccent,
  SemanticTextDefault,
  SemanticTextSubtle,
} from '@kalads/tokens/js';
import { kaladsTheme } from './kalads-theme';

addons.setConfig({
  theme: kaladsTheme,
  sidebar: { showRoots: true },
});

/*
 * What the theme can't set: the sidebar icon colours (Storybook's defaults for documents, stories and
 * folders are orange, teal and purple) and the brand title size. Storybook's interface can't read the
 * token CSS variables, so the values come from the JS tokens. The selected row keeps Storybook's inverse
 * icon colour.
 */
const style = document.createElement('style');
style.textContent = `
  .sidebar-header a[href="./"] {
    font-family: ${FontFamilyHeading};
    font-size: ${FontSize500};
    font-weight: ${FontWeightBold};
    color: ${SemanticTextDefault};
  }
  .sidebar-item[data-nodetype="document"]:not([data-selected="true"]) svg {
    color: ${SemanticInteractiveAccent};
  }
  .sidebar-item[data-nodetype="story"]:not([data-selected="true"]) svg {
    color: ${ColorSecondary500};
  }
  .sidebar-item[data-nodetype="group"]:not([data-selected="true"]) svg {
    color: ${SemanticTextSubtle};
  }
`;
document.head.append(style);
