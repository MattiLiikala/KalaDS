import type { CSSProperties } from 'react';

/**
 * Token-name props (gap="md", bg="subtle", columns={3}) set a private custom property that the
 * component's CSS reads, like the web components' attribute selectors do. The value is always a token
 * variable (or a plain count), never a raw length or colour.
 *
 *   tokenVars({ '--_gap': ['semantic-spacing', 'md'] }) → { '--_gap': 'var(--kds-semantic-spacing-md)' }
 */
export function tokenVars(
  vars: Record<string, readonly [prefix: string, name: string | number | undefined] | number | undefined>,
  style?: CSSProperties,
): CSSProperties | undefined {
  const out: Record<string, string | number> = {};
  for (const [prop, value] of Object.entries(vars)) {
    if (value === undefined) continue;
    if (typeof value === 'number') out[prop] = value;
    else if (value[1] !== undefined) out[prop] = `var(--kds-${value[0]}-${value[1]})`;
  }
  if (!Object.keys(out).length) return style;
  return { ...out, ...style } as CSSProperties;
}
