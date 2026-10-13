import type { ReactNode } from 'react';
import { IconButtonDefaults, type ButtonSize, type IconButtonSpec } from '@kalads/spec';
import { c } from '../internal/theme.js';
import { ButtonBase, type ButtonProps } from '../button/Button.js';

const ICON_SIZE: Record<ButtonSize, number> = { sm: c.iconButton.iconSizeSm, md: c.iconButton.iconSizeMd, lg: c.iconButton.iconSizeLg };

export interface IconButtonProps extends IconButtonSpec, Omit<ButtonProps, keyof IconButtonSpec | 'start' | 'end' | 'children'> {
  /** Accessible name, e.g. "Close dialog". Required. */
  label: string;
  /** The icon, e.g. <CloseIcon />. */
  children: ReactNode;
}

/**
 * Round button that shows only an icon; `label` is the accessible name. As tall as a Button of the same
 * size, with every Button variant and `onInverse`. Defaults to the ghost variant.
 */
export function IconButton({ label, variant = IconButtonDefaults.variant, size = IconButtonDefaults.size, ...rest }: IconButtonProps) {
  return <ButtonBase aria-label={label} variant={variant} size={size} square iconSize={ICON_SIZE[size]} {...rest} />;
}
