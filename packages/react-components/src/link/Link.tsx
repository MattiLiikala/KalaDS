import type { ComponentPropsWithRef } from 'react';
import { LinkDefaults, type LinkSpec } from '@kalads/spec';
import { ExternalLinkIcon } from '@kalads/icons/react';
import { cx } from '../internal/cx.js';
import hidden from '../internal/VisuallyHidden.module.css';
import styles from './Link.module.css';

export interface LinkProps extends LinkSpec, Omit<ComponentPropsWithRef<'a'>, keyof LinkSpec> {}

/**
 * Text link for navigation (use Button for actions). Underlined so it's recognisable without relying on
 * colour. Links that open in a new tab (target="_blank") get an icon, a screen-reader note and
 * rel="noopener noreferrer".
 */
export function Link({
  href,
  target,
  rel,
  download,
  variant = LinkDefaults.variant,
  newTabLabel = LinkDefaults.newTabLabel,
  className,
  children,
  ...rest
}: LinkProps) {
  const newTab = target === '_blank';
  const relValue = newTab ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel;
  return (
    <a
      className={cx(styles.root, className)}
      data-variant={variant}
      href={href || undefined}
      target={target || undefined}
      rel={relValue || undefined}
      download={download || undefined}
      {...rest}
    >
      {children}
      {newTab && (
        <>
          <span className={styles.external} aria-hidden="true">
            <ExternalLinkIcon />
          </span>
          <span className={hidden.root}>{newTabLabel}</span>
        </>
      )}
    </a>
  );
}
