import { createContext, createElement, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { IconContext } from '@kalads/icons/native';
import { tokens, themes, type Tokens } from '@kalads/tokens/native';

/**
 * Light-theme tokens, for values that are the same in every theme: dimensions, sizes, fonts, durations.
 * Colours and shadows change with the theme, so components read them from `useTokens()` instead.
 */
export const t = tokens;
/** Component tokens: c.button.primary.radius. */
export const c = tokens.component;
/** Semantic tokens: s.spacing.md. */
export const s = tokens.semantic;

/** A KalaDS spacing name to its value in dp. */
export type SpacingName = keyof typeof tokens.semantic.spacing;
export const space = (name: SpacingName | undefined) => (name === undefined ? undefined : tokens.semantic.spacing[name]);

/** `light` and `dark` force a theme; `auto` follows the device's appearance setting. */
export type KalaScheme = 'light' | 'dark' | 'auto';

const ThemeContext = createContext<Tokens>(themes.light);

/** @internal Provides a theme's tokens. Tests pass their own. */
export function ThemeTokensProvider({ theme, children }: { theme: Tokens; children?: ReactNode }) {
  // Icons outside a component that sets their colour default to the theme's text colour.
  return createElement(
    ThemeContext.Provider,
    { value: theme },
    createElement(IconContext.Provider, { value: { color: theme.semantic.text.default } }, children),
  );
}

export interface KalaThemeProviderProps {
  /** Default: `light`. */
  scheme?: KalaScheme;
  children?: ReactNode;
}

/**
 * Sets the colour theme for the KalaDS components inside it, like `data-kds-theme` on the web. Wrap the
 * app root once; without a provider the components are light. Popups, dialogs and drawers keep the theme.
 */
export function KalaThemeProvider({ scheme = 'light', children }: KalaThemeProviderProps) {
  const system = useColorScheme();
  const dark = scheme === 'dark' || (scheme === 'auto' && system === 'dark');
  return createElement(ThemeTokensProvider, { theme: dark ? themes.dark : themes.light }, children);
}

/** The active theme's tokens: `c` (component), `s` (semantic) and `t` (all), as the static exports. */
export function useTokens() {
  const theme = useContext(ThemeContext);
  return { c: theme.component, s: theme.semantic, t: theme };
}
