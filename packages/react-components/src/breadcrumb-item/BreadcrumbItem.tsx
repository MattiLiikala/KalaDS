import type { ComponentPropsWithRef } from 'react';
import type { BreadcrumbItemSpec } from '@kalads/spec';
import { ChevronRightIcon } from '@kalads/icons/react';
import { cx } from '../internal/cx.js';
import { Link } from '../link/Link.js';
import styles from './BreadcrumbItem.module.css';

export interface BreadcrumbItemProps extends BreadcrumbItemSpec, Omit<ComponentPropsWithRef<'li'>, keyof BreadcrumbItemSpec> {}

/**
 * One step in Breadcrumbs: a link when it has an `href`, plain text marked aria-current="page" when it's
 * the current page (`current`, or no `href`). A chevron separator comes before every item but the first.
 */
export function BreadcrumbItem({ href, current, className, children, ...rest }: BreadcrumbItemProps) {
  const isCurrent = current || !href;
  return (
    <li className={cx(styles.root, className)} {...rest}>
      <span className={styles.separator} aria-hidden="true">
        <ChevronRightIcon />
      </span>
      {isCurrent ? (
        <span className={styles.current} aria-current="page">
          {children}
        </span>
      ) : (
        <Link href={href} variant="subtle">
          {children}
        </Link>
      )}
    </li>
  );
}
