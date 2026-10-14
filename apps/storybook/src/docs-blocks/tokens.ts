import tokens from '@kalads/tokens/json';
import darkTokens from '@kalads/tokens/json/dark';

/** A resolved token value as it appears in the nested JSON build: a string, number, shadow or shadow list. */
type Shadow = { offsetX: string; offsetY: string; blur: string; spread: string; color: string };
type TokenValue = string | number | Shadow | Shadow[];
type TokenTree = { [key: string]: TokenTree | TokenValue };

export interface TokenRow {
  /** Dot path, e.g. "semantic.spacing.md" (unit suffixes dropped when paired). */
  path: string;
  /** CSS custom property, e.g. "--kds-semantic-spacing-md". */
  cssVar: string;
  /** Display value, e.g. "1rem", "#c50277", or "1rem / 16px" for paired size steps. */
  value: string;
  /** The dark theme's value, when it differs from `value`. */
  dark?: string;
  /** CSS value for previews: the custom property itself, so previews show the live token. */
  css: string;
}

const isShadow = (v: unknown): v is Shadow => typeof v === 'object' && v !== null && 'offsetX' in v;
const isLeaf = (v: unknown): v is TokenValue =>
  typeof v !== 'object' || v === null || isShadow(v) || (Array.isArray(v) && v.every(isShadow));

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
export const cssVarFor = (path: string[]) => `--kds-${path.map(kebab).join('-')}`;

const shadowCss = (s: Shadow) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`;
const format = (v: TokenValue): string =>
  Array.isArray(v) ? v.map(shadowCss).join(', ') : isShadow(v) ? shadowCss(v) : String(v);

function node(path: string, tree: TokenTree = tokens as TokenTree): TokenTree | TokenValue | undefined {
  return path.split('.').reduce<TokenTree | TokenValue | undefined>(
    (n, key) => (n && typeof n === 'object' && !Array.isArray(n) && !isShadow(n) ? (n as TokenTree)[key] : undefined),
    tree,
  );
}

/** Palette step of a colour value ("#20160e" → "neutral.900"), so themed values show which core colour they use. */
const PALETTE = new Map<string, string>();
for (const [palette, steps] of Object.entries((tokens as TokenTree).color as TokenTree)) {
  if (palette.startsWith('data')) continue;
  for (const [step, value] of Object.entries(steps as TokenTree)) if (typeof value === 'string' && !PALETTE.has(value)) PALETTE.set(value, `${palette}.${step}`);
}
export const paletteName = (value: string) => PALETTE.get(value);

/**
 * Every token under `path`, in source order. With `pairUnits`, size steps that have both a `rem` and a
 * `px` value (core size tokens) become one row each, previewed with the rem value.
 */
export function getTokens(path: string, { pairUnits = false } = {}): TokenRow[] {
  const start = node(path);
  if (start === undefined) throw new Error(`No tokens at "${path}"`);
  const rows: TokenRow[] = [];
  const walk = (n: TokenTree | TokenValue, keys: string[]) => {
    if (isLeaf(n)) {
      const cssVar = cssVarFor(keys);
      const value = format(n);
      const dark = node(keys.join('.'), darkTokens as TokenTree);
      rows.push({ path: keys.join('.'), cssVar, value, dark: dark !== undefined && isLeaf(dark) && format(dark) !== value ? format(dark) : undefined, css: `var(${cssVar})` });
      return;
    }
    const tree = n as TokenTree;
    if (pairUnits && 'rem' in tree && 'px' in tree) {
      const rem = cssVarFor([...keys, 'rem']);
      rows.push({
        path: keys.join('.'),
        cssVar: `${rem} / ${cssVarFor([...keys, 'px'])}`,
        value: `${format(tree.rem as TokenValue)} / ${format(tree.px as TokenValue)}`,
        css: `var(${rem})`,
      });
      return;
    }
    for (const [key, child] of Object.entries(tree)) walk(child, [...keys, key]);
  };
  walk(start, path.split('.'));
  return rows;
}

/* WCAG contrast, for the colour scale labels. */
const channel = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** A resolved token value by dot path, e.g. tokenValue('semantic.bg.default') → "#fef9f5". */
export function tokenValue(path: string): string {
  const n = node(path);
  if (n === undefined || !isLeaf(n)) throw new Error(`"${path}" is not a token`);
  return format(n);
}
