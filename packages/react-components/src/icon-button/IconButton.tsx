import type { ReactNode } from 'react';
import { IconButtonDefaults, type IconButtonSpec } from '@kalads/spec';
import { ButtonBase, type ButtonProps } from '../button/Button.js';
import styles from './IconButton.module.css';

export interface IconButtonProps extends IconButtonSpec, Omit<ButtonProps, keyof IconButtonSpec | 'start' | 'end' | 'children'> {
  /** Accessible name, e.g. "Close dialog". Required. */
  label: string;
  /** The icon, e.g. <CloseIcon />. */
  children: ReactNode;
}

/**
 * Round button that shows only an icon. `label` is the accessible name. Has every Button variant and
 * `onInverse`. Defaults to the ghost variant. Pair with Tooltip to show the label.
 */
export function IconButton({ label, variant = IconButtonDefaults.variant, size = IconButtonDefaults.size, children, ...rest }: IconButtonProps) {
  return (
    <ButtonBase aria-label={label} variant={variant} size={size} extraClass={styles.root} {...rest}>
      {children}
    </ButtonBase>
  );
}
