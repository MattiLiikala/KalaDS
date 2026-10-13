import type { ComponentPropsWithRef } from 'react';
import { BreadcrumbsDefaults, type BreadcrumbsSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbsProps extends BreadcrumbsSpec, Omit<ComponentPropsWithRef<'nav'>, keyof BreadcrumbsSpec> {}

/** Where the current page sits in the site hierarchy: a navigation landmark with a list of BreadcrumbItems. */
export function Breadcrumbs({ label = BreadcrumbsDefaults.label, className, children, ...rest }: BreadcrumbsProps) {
  return (
    <nav className={cx(styles.root, className)} aria-label={label} {...rest}>
      <ol className={styles.list} role="list">
        {children}
      </ol>
    </nav>
  );
}
