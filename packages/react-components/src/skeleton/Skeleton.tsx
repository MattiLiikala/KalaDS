import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { SkeletonDefaults, type SkeletonSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends SkeletonSpec, Omit<ComponentPropsWithRef<'span'>, keyof SkeletonSpec> {}

/**
 * Placeholder shape shown while content loads. Hidden from assistive technology: mark the loading region
 * with aria-busy="true". The shimmer stops when the user prefers reduced motion. `width` and `height`
 * take CSS lengths, as in kds-skeleton (e.g. "12rem" or "60%").
 */
export function Skeleton({ variant = SkeletonDefaults.variant, lines = 1, width, height, className, ...rest }: SkeletonProps) {
  let body;
  if (variant === 'circle') {
    const size = width || height;
    body = <span className={cx(styles.shape, styles.circle)} style={size ? ({ '--_size': size } as CSSProperties) : undefined} />;
  } else if (variant === 'rect') {
    body = <span className={cx(styles.shape, styles.rect)} style={{ width: width || undefined, ...(height ? { '--_height': height } : {}) } as CSSProperties} />;
  } else {
    const count = Math.max(1, Math.floor(lines));
    body = (
      <span className={styles.stack} style={{ width: width || undefined, height: height || undefined }}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={cx(styles.shape, styles.line, count > 1 && i === count - 1 && styles.last)} />
        ))}
      </span>
    );
  }
  return (
    <span className={cx(styles.root, className)} data-variant={variant} aria-hidden="true" {...rest}>
      {body}
    </span>
  );
}
