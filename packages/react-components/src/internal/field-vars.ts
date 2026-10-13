import type { CSSProperties } from 'react';

const NAMES = [
  'label-text', 'text', 'text-placeholder', 'text-disabled', 'bg', 'bg-disabled', 'border', 'border-hover',
  'border-focus', 'border-error', 'border-error-focus', 'border-disabled', 'border-width', 'border-width-focus',
  'radius', 'padding-x', 'padding-y', 'icon', 'helper-text', 'error-text',
] as const;

/** Maps a component's field tokens (--kds-component-select-*) onto Field.module.css's --_f-* properties. */
export function fieldVars(prefix: string, style?: CSSProperties): CSSProperties {
  const vars: Record<string, string> = {};
  for (const name of NAMES) vars[`--_f-${name}`] = `var(--kds-component-${prefix}-${name})`;
  return { ...vars, ...style } as CSSProperties;
}
