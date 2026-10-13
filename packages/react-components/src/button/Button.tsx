import type { ComponentPropsWithRef, ReactNode, Ref } from 'react';
import { ButtonDefaults, type ButtonSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { hasContent } from '../internal/children.js';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonSpec, Omit<ComponentPropsWithRef<'button'>, keyof ButtonSpec> {
  /** Icon before the label (the web component's `start` slot). */
  start?: ReactNode;
  /** Icon after the label (the web component's `end` slot). */
  end?: ReactNode;
}

/**
 * Trigger actions. Solid variants (`primary`, `secondary`, `danger`) have a filled background with a label
 * colour that keeps 4.5:1 contrast in every state; on inverse surfaces set `onInverse`.
 */
export function Button(props: ButtonProps) {
  return <ButtonBase {...props} />;
}

/** @internal Shared by Button and IconButton. */
export function ButtonBase({
  variant = ButtonDefaults.variant,
  size = ButtonDefaults.size,
  disabled,
  onInverse,
  start,
  end,
  children,
  className,
  ref,
  type = 'button',
  extraClass,
  ...rest
}: ButtonProps & { extraClass?: string; ref?: Ref<HTMLButtonElement> }) {
  const hasLabel = hasContent(children);
  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.root, extraClass, className)}
      data-variant={variant}
      data-size={size}
      data-on-inverse={flag(onInverse)}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {start}
      {hasLabel && <span>{children}</span>}
      {end}
    </button>
  );
}
