import type { ComponentPropsWithRef } from 'react';
import { StackDefaults, type StackSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { tokenVars } from '../internal/token-vars.js';
import styles from './Stack.module.css';

export interface StackProps extends StackSpec, Omit<ComponentPropsWithRef<'div'>, keyof StackSpec> {}

/** Lays children out in a column or row with token-based spacing. */
export function Stack({
  direction = StackDefaults.direction,
  gap,
  align,
  justify,
  wrap,
  inline,
  className,
  style,
  ...rest
}: StackProps) {
  return (
    <div
      className={cx(styles.root, className)}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={flag(wrap)}
      data-inline={flag(inline)}
      style={tokenVars({ '--_gap': ['semantic-spacing', gap] }, style)}
      {...rest}
    />
  );
}
