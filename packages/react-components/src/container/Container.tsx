import type { ComponentPropsWithRef } from 'react';
import { ContainerDefaults, type ContainerSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import styles from './Container.module.css';

export interface ContainerProps extends ContainerSpec, Omit<ComponentPropsWithRef<'div'>, keyof ContainerSpec> {}

/** Centres content horizontally and limits its width. Layout only: no visuals of its own. */
export function Container({ size = ContainerDefaults.size, flush, className, ...rest }: ContainerProps) {
  return <div className={cx(styles.root, className)} data-size={size} data-flush={flag(flush)} {...rest} />;
}
