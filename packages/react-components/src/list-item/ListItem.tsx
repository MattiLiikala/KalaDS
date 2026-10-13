import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ListItemSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { hasContent } from '../internal/children.js';
import { NestedListContext } from '../list/context.js';
import styles from './ListItem.module.css';

export interface ListItemProps extends ListItemSpec, Omit<ComponentPropsWithRef<'li'>, keyof ListItemSpec | 'onSelect'> {
  /** Secondary (description) text. */
  secondary?: ReactNode;
  /** Leading content: icon, avatar, checkbox. */
  start?: ReactNode;
  /** Trailing content: meta text, badge, action. */
  end?: ReactNode;
  /** A nested List. */
  nested?: ReactNode;
  /** When an interactive row is activated (the web component's `kds-select`). */
  onSelect?: () => void;
}

/**
 * One row in a List: primary text, optional secondary text, leading and trailing content. Static by
 * default; with `href` the row is a link, with `interactive` a button that calls onSelect.
 */
export function ListItem({
  href,
  target,
  interactive,
  selected,
  disabled,
  secondary,
  start,
  end,
  nested,
  onSelect,
  className,
  children,
  ...rest
}: ListItemProps) {
  const content = (
    <>
      {start && <span className={styles.side}>{start}</span>}
      <span className={styles.text}>
        <span>{children}</span>
        {hasContent(secondary) && <span className={styles.secondary}>{secondary}</span>}
      </span>
      {end && <span className={styles.side}>{end}</span>}
    </>
  );
  const current = selected ? (href ? 'page' : 'true') : undefined;
  return (
    <li className={cx(styles.root, className)} data-selected={flag(selected)} {...rest}>
      {href ? (
        <a
          className={styles.row}
          href={href}
          target={target || undefined}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          aria-current={current}
        >
          {content}
        </a>
      ) : interactive ? (
        <button className={styles.row} type="button" aria-current={current} disabled={disabled} onClick={() => !disabled && onSelect?.()}>
          {content}
        </button>
      ) : (
        <div className={styles.row}>{content}</div>
      )}
      {nested && <NestedListContext.Provider value>{nested}</NestedListContext.Provider>}
    </li>
  );
}
