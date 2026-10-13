import type { ComponentPropsWithRef } from 'react';
import { BadgeDefaults, type BadgeSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import styles from './Badge.module.css';

export interface BadgeProps extends BadgeSpec, Omit<ComponentPropsWithRef<'span'>, keyof BadgeSpec> {}

/**
 * Small status label. Badges are outlined (no fill, a 1px border in the text colour), so the text colour
 * must contrast with the surface behind them at 4.5:1 or more.
 */
export function Badge({ variant = BadgeDefaults.variant, className, ...rest }: BadgeProps) {
  return <span className={cx(styles.root, className)} data-variant={variant} {...rest} />;
}
