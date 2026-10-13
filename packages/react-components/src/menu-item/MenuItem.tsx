import type { ComponentPropsWithRef, ReactNode } from 'react';
import { MenuItemDefaults, type MenuItemSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import styles from './MenuItem.module.css';

export interface MenuItemProps extends MenuItemSpec, Omit<ComponentPropsWithRef<'div'>, keyof MenuItemSpec> {
  /** Leading icon (the web component's `start` slot). */
  start?: ReactNode;
  /** Trailing content, e.g. a keyboard shortcut (the web component's `end` slot). */
  end?: ReactNode;
}

/**
 * One action in a Menu: the focusable role="menuitem" element. Menu moves focus between items with the
 * arrow keys. Disabled items stay focusable, as the menu pattern recommends.
 */
export function MenuItem({ value = '', variant = MenuItemDefaults.variant, disabled, start, end, className, children, ...rest }: MenuItemProps) {
  return (
    <div
      className={cx(styles.root, className)}
      role="menuitem"
      tabIndex={-1}
      data-value={value}
      data-variant={variant}
      aria-disabled={disabled ? 'true' : 'false'}
      {...rest}
    >
      {start && <span className={styles.start}>{start}</span>}
      <span className={styles.label}>{children}</span>
      {end && <span className={styles.end}>{end}</span>}
    </div>
  );
}
