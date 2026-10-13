import type { ComponentPropsWithRef } from 'react';
import { IconDefaults, type IconSpec } from '@kalads/spec';
import { icons, type IconName } from '@kalads/icons/react';
import { cx } from '../internal/cx.js';
import styles from './Icon.module.css';

export interface IconProps extends Omit<IconSpec, 'name'>, Omit<ComponentPropsWithRef<'span'>, keyof IconSpec> {
  /** Icon name, e.g. "search" or "chevron-down". */
  name: IconName;
}

/**
 * Any KalaDS icon by name, with token-based size and colour. Without `label` the icon is decorative;
 * with one it's announced as an image with that name. To import a single icon, use @kalads/icons/react.
 */
export function Icon({ name, size = IconDefaults.size, color = IconDefaults.color, label, className, ...rest }: IconProps) {
  const Glyph = icons[name];
  if (!Glyph) return null;
  return (
    <span className={cx(styles.root, className)} data-size={size} data-color={color} {...rest}>
      <Glyph label={label} />
    </span>
  );
}
