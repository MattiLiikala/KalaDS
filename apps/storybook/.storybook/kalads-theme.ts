import { create } from '@storybook/theming';
import {
  FontFamilyBase,
  SemanticBgDefault,
  SemanticBgMuted,
  SemanticBgSubtle,
  SemanticBorderControl,
  SemanticBorderDefault,
  SemanticInteractiveAccent,
  SemanticRadiusMd,
  SemanticTextDefault,
  SemanticTextInverse,
  SemanticTextSubtle,
} from '@kalads/tokens/js';

/** Storybook's theme wants radii as pixel numbers; tokens are rem. */
const toPx = (rem: string) => Math.round(parseFloat(rem) * 16);

/**
 * Storybook's own interface (sidebar, toolbar, docs page frame) in KalaDS colours and fonts.
 * The manager runs outside the story iframe and can't read CSS variables, so values come from the
 * generated JS tokens: never copy hex values here.
 *
 * colorSecondary is the selected sidebar item's background (with inverse text) and the link colour.
 */
export const kaladsTheme = create({
  base: 'light',

  brandTitle: 'KalaDS',
  brandUrl: './',
  brandTarget: '_self',

  colorPrimary: SemanticInteractiveAccent,
  colorSecondary: SemanticInteractiveAccent,

  appBg: SemanticBgSubtle,
  appContentBg: SemanticBgDefault,
  appPreviewBg: SemanticBgDefault,
  appBorderColor: SemanticBorderDefault,
  appBorderRadius: toPx(SemanticRadiusMd),

  fontBase: FontFamilyBase,
  fontCode: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",

  textColor: SemanticTextDefault,
  textMutedColor: SemanticTextSubtle,
  textInverseColor: SemanticTextInverse,

  barBg: SemanticBgDefault,
  barTextColor: SemanticTextSubtle,
  barSelectedColor: SemanticInteractiveAccent,
  barHoverColor: SemanticInteractiveAccent,

  buttonBg: SemanticBgSubtle,
  buttonBorder: SemanticBorderControl,
  booleanBg: SemanticBgMuted,
  booleanSelectedBg: SemanticBgDefault,

  inputBg: SemanticBgDefault,
  inputBorder: SemanticBorderControl,
  inputTextColor: SemanticTextDefault,
  inputBorderRadius: toPx(SemanticRadiusMd),
});
