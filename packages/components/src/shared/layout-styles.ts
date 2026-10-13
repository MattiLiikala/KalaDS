import { unsafeCSS } from 'lit';

/** Spacing scale names accepted by layout attributes (gap, padding, margin). */
export const SPACING = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export type Spacing = (typeof SPACING)[number];

/**
 * CSS mapping a token-name attribute to a custom property:
 * tokenAttr('gap', '--_gap') → :host([gap='md']) { --_gap: var(--kds-semantic-spacing-md); } …
 */
export function spacingAttr(attr: string, prop: string) {
  return unsafeCSS(
    SPACING.map((s) => `:host([${attr}='${s}']) { ${prop}: var(--kds-semantic-spacing-${s}); }`).join('\n'),
  );
}

/** :host([attr='1']) { prop: 1 } … through `max`, for numeric attributes such as grid columns. */
export function numberAttr(attr: string, prop: string, max = 12) {
  return unsafeCSS(
    Array.from({ length: max }, (_, i) => `:host([${attr}='${i + 1}']) { ${prop}: ${i + 1}; }`).join('\n'),
  );
}

/** Same as spacingAttr for an arbitrary list of names and a token prefix. */
export function namedAttr(attr: string, prop: string, names: readonly string[], tokenPrefix: string) {
  return unsafeCSS(names.map((n) => `:host([${attr}='${n}']) { ${prop}: var(${tokenPrefix}${n}); }`).join('\n'));
}
