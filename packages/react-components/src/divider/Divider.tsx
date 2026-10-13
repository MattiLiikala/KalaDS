import type { ComponentPropsWithRef } from 'react';
import { DividerDefaults, type DividerSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { hasContent } from '../internal/children.js';
import styles from './Divider.module.css';

export interface DividerProps extends DividerSpec, Omit<ComponentPropsWithRef<'div'>, keyof DividerSpec> {}

/**
 * Thin line separating groups of content, horizontally or vertically. Children become a label in the
 * middle of a horizontal divider ("or"). Purely decorative dividers can set `decorative`.
 */
export function Divider({ orientation = DividerDefaults.orientation, flush, decorative, className, children, ...rest }: DividerProps) {
  const labelled = orientation === 'horizontal' && hasContent(children);
  const a11y = decorative
    ? { 'aria-hidden': true }
    : { role: 'separator', 'aria-orientation': orientation };
  return (
    <div className={cx(styles.root, className)} data-orientation={orientation} data-flush={flag(flush)} {...a11y} {...rest}>
      <div className={styles.divider}>
        <span className={styles.line} />
        {labelled && (
          <>
            <span className={styles.label}>{children}</span>
            <span className={styles.line} />
          </>
        )}
      </div>
    </div>
  );
}
