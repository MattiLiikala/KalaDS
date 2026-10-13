import type { ComponentPropsWithRef } from 'react';
import { PaperDefaults, type PaperSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { tokenVars } from '../internal/token-vars.js';
import styles from './Paper.module.css';

export interface PaperProps extends PaperSpec, Omit<ComponentPropsWithRef<'div'>, keyof PaperSpec> {}

/**
 * Plain surface for grouping content: background, 1px border and a crisp offset shadow that grows with
 * `elevation`. Use Card when you need header / body / footer sections.
 */
export function Paper({ elevation = PaperDefaults.elevation, variant = PaperDefaults.variant, padding, className, style, ...rest }: PaperProps) {
  return (
    <div
      className={cx(styles.root, className)}
      data-elevation={elevation}
      data-variant={variant}
      data-padding={padding}
      style={tokenVars({ '--_padding': ['semantic-padding', padding === 'none' ? undefined : padding] }, style)}
      {...rest}
    />
  );
}
