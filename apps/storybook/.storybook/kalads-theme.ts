import { create } from '@storybook/theming';
import * as light from '@kalads/tokens/js';
import * as dark from '@kalads/tokens/js/dark';

/** The JS tokens of one theme: the light and dark modules export the same names. */
export type ThemeTokens = typeof light;

/** Storybook's theme wants radii as pixel numbers; tokens are rem. */
const toPx = (rem: string) => Math.round(parseFloat(rem) * 16);

/**
 * Storybook's own interface (sidebar, toolbar, docs page frame) in KalaDS colours and fonts.
 * The manager runs outside the story iframe and can't read CSS variables, so values come from the
 * generated JS tokens: never copy hex values here.
 *
 * colorSecondary is the selected sidebar item's background (with inverse text) and the link colour.
 */
function kaladsTheme(t: ThemeTokens, base: 'light' | 'dark') {
  return create({
    base,

    brandTitle: 'KalaDS',
    brandUrl: './',
    brandTarget: '_self',

    colorPrimary: t.SemanticInteractiveAccent,
    colorSecondary: t.SemanticInteractiveAccent,

    appBg: t.SemanticBgSubtle,
    appContentBg: t.SemanticBgDefault,
    appPreviewBg: t.SemanticBgDefault,
    appBorderColor: t.SemanticBorderDefault,
    appBorderRadius: toPx(t.SemanticRadiusMd),

    fontBase: t.FontFamilyBase,
    fontCode: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",

    textColor: t.SemanticTextDefault,
    textMutedColor: t.SemanticTextSubtle,
    textInverseColor: t.SemanticTextInverse,

    barBg: t.SemanticBgDefault,
    barTextColor: t.SemanticTextSubtle,
    barSelectedColor: t.SemanticInteractiveAccent,
    barHoverColor: t.SemanticInteractiveAccent,

    buttonBg: t.SemanticBgSubtle,
    buttonBorder: t.SemanticBorderControl,
    booleanBg: t.SemanticBgMuted,
    booleanSelectedBg: t.SemanticBgDefault,

    inputBg: t.SemanticBgDefault,
    inputBorder: t.SemanticBorderControl,
    inputTextColor: t.SemanticTextDefault,
    inputBorderRadius: toPx(t.SemanticRadiusMd),
  });
}

export type ThemeName = 'light' | 'dark';

/** The toolbar global that holds the theme, and the theme for each of its values. */
export const THEME_GLOBAL = 'theme';
export const TOKENS: Record<ThemeName, ThemeTokens> = { light, dark };
export const kaladsThemes = { light: kaladsTheme(light, 'light'), dark: kaladsTheme(dark, 'dark') };
export const themeName = (value: unknown): ThemeName => (value === 'dark' ? 'dark' : 'light');
