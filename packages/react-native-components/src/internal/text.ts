import type { TextStyle } from 'react-native';
import { t } from './theme.js';
import { fontFamily } from './fonts.js';

/** A semantic type style, by its token name (body-sm, label-sm…). */
export type TypeVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-sm' | 'caption' | 'label' | 'label-sm' | 'overline';

const camel = (name: string) => name.replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase()) as keyof typeof t.semantic.type;

/**
 * A text style from a semantic type token (h1…overline). React Native needs absolute line heights and
 * letter spacing, so the token ratios are multiplied out by the font size.
 */
export function typeStyle(variant: TypeVariant): TextStyle {
  const type = t.semantic.type[camel(variant)] as { family: string; size: number; weight: number; lineHeight: number; letterSpacing?: number };
  return textStyle(type.family, type.size, type.weight, type.lineHeight, type.letterSpacing);
}

/** A text style from individual tokens: family name, size (dp), weight, line-height ratio, letter spacing (em). */
export function textStyle(family: string, size: number, weight: number | string, lineHeight: number, letterSpacingEm = 0): TextStyle {
  return {
    fontFamily: fontFamily(family, weight),
    fontSize: size,
    lineHeight: Math.round(size * lineHeight),
    ...(letterSpacingEm ? { letterSpacing: size * letterSpacingEm } : {}),
  };
}
