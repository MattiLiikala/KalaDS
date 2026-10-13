import type { CSSProperties } from 'react';

/** Maps a group's tokens (--kds-component-radio-group-*) onto Group.module.css's --_g-* properties. */
export function groupVars(prefix: string, style?: CSSProperties): CSSProperties {
  const vars: Record<string, string> = {};
  for (const name of ['gap', 'gap-horizontal', 'legend-text', 'helper-text', 'error-text']) {
    vars[`--_g-${name}`] = `var(--kds-component-${prefix}-${name})`;
  }
  return { ...vars, ...style } as CSSProperties;
}
