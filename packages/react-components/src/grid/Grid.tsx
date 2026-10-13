import type { ComponentPropsWithRef } from 'react';
import type { GridSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { tokenVars } from '../internal/token-vars.js';
import styles from './Grid.module.css';

export interface GridProps extends GridSpec, Omit<ComponentPropsWithRef<'div'>, keyof GridSpec> {}

/** Whole numbers from 1 to 12, as the web component's columns / span selectors accept. */
export function clampCount(value: number | undefined): number | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  return Math.min(12, Math.max(1, Math.round(value)));
}

/**
 * CSS grid with a fixed number of columns, or responsive columns with a minimum width. Set `columns` for a
 * fixed grid, or `min` for as many columns as fit, each at least that wide. Use GridItem to span columns.
 */
export function Grid({ columns = 1, min, gap, rowGap, align, className, style, ...rest }: GridProps) {
  return (
    <div
      className={cx(styles.root, className)}
      data-min={min}
      data-align={align}
      style={tokenVars(
        {
          '--_columns': clampCount(columns),
          '--_min': ['semantic-size', min],
          '--_gap': ['semantic-spacing', gap],
          '--_row-gap': ['semantic-spacing', rowGap],
        },
        style,
      )}
      {...rest}
    />
  );
}
