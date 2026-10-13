import type { ComponentPropsWithRef, ReactNode } from 'react';
import { CardDefaults, type CardSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { hasContent } from '../internal/children.js';
import styles from './Card.module.css';

export interface CardProps extends CardSpec, Omit<ComponentPropsWithRef<'div'>, keyof CardSpec> {
  /** Card header area (the web component's `header` slot). */
  header?: ReactNode;
  /** Card footer area (the web component's `footer` slot). */
  footer?: ReactNode;
}

/**
 * Surface container for grouping related content: a 1px border and a crisp offset shadow set by
 * `elevation`. Header, body and footer are separated by spacing only. `interactive` only adds hover
 * styles: wrap the card in a link, or put one inside it, to make it reachable by keyboard.
 */
export function Card({ elevation = CardDefaults.elevation, interactive, header, footer, className, children, ...rest }: CardProps) {
  return (
    <div className={cx(styles.root, className)} data-elevation={elevation} data-interactive={flag(interactive)} {...rest}>
      <div className={styles.card}>
        {hasContent(header) && <div>{header}</div>}
        <div>{children}</div>
        {hasContent(footer) && <div>{footer}</div>}
      </div>
    </div>
  );
}
