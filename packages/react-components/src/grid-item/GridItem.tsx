import type { ComponentPropsWithRef } from 'react';
import type { GridItemSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { tokenVars } from '../internal/token-vars.js';
import { clampCount } from '../grid/Grid.js';
import styles from './GridItem.module.css';

export interface GridItemProps extends GridItemSpec, Omit<ComponentPropsWithRef<'div'>, keyof GridItemSpec> {}

/** Cell in a Grid that spans several columns or rows. Plain children of Grid take one cell. */
export function GridItem({ span = 1, rowSpan = 1, full, className, style, ...rest }: GridItemProps) {
  return (
    <div
      className={cx(styles.root, className)}
      data-full={flag(full)}
      style={tokenVars({ '--_span': clampCount(span), '--_row-span': clampCount(rowSpan) }, style)}
      {...rest}
    />
  );
}
