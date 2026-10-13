import type { ComponentPropsWithRef } from 'react';
import type { BoxSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { tokenVars } from '../internal/token-vars.js';
import styles from './Box.module.css';

export interface BoxProps extends BoxSpec, Omit<ComponentPropsWithRef<'div'>, keyof BoxSpec> {}

/**
 * Generic block with token-based padding, margin, background, border and radius: the escape hatch for
 * spacing and simple surfaces without writing CSS. Every value is a token name.
 */
export function Box({ padding, paddingX, paddingY, marginY, bg, radius, border, inline, className, style, ...rest }: BoxProps) {
  return (
    <div
      className={cx(styles.root, className)}
      data-bg={bg}
      data-border={flag(border)}
      data-inline={flag(inline)}
      style={tokenVars(
        {
          '--_p': ['semantic-spacing', padding],
          '--_px': ['semantic-spacing', paddingX],
          '--_py': ['semantic-spacing', paddingY],
          '--_my': ['semantic-spacing', marginY],
          '--_bg': ['semantic-bg', bg],
          '--_radius': ['semantic-radius', radius],
        },
        style,
      )}
      {...rest}
    />
  );
}
