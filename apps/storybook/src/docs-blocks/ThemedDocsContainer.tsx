import React, { useEffect, useState, type ComponentProps } from 'react';
import { DocsContainer } from '@storybook/blocks';
import { kaladsThemes, themeName } from '../../.storybook/kalads-theme';

/** The theme the preview set on <html> (`data-kds-theme`, from the toolbar's dark mode switch). */
const current = () => themeName(document.documentElement.dataset.kdsTheme);

/** The active colour theme, updated when the toolbar switch changes it. */
export function useColorTheme() {
  const [theme, setTheme] = useState(current);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(current()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-kds-theme'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/**
 * Storybook's docs container with the KalaDS theme of the active colour theme, so the docs frame (props
 * tables, controls) switches with the page.
 */
export function ThemedDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  return <DocsContainer {...props} theme={kaladsThemes[useColorTheme()]} />;
}
