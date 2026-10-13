import type { ComponentPropsWithoutRef, Ref } from 'react';
import { TypographyDefaults, type TypographySpec, type TypographyVariant } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { tokenVars } from '../internal/token-vars.js';
import styles from './Typography.module.css';

/** Elements Typography can render as, the same set kds-typography allows. */
export type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small';

const DEFAULT_ELEMENT: Record<TypographyVariant, TypographyElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  label: 'span',
  overline: 'span',
};

export interface TypographyProps
  extends Omit<TypographySpec, 'as'>,
    Omit<ComponentPropsWithoutRef<'p'>, keyof TypographySpec> {
  ref?: Ref<HTMLElement>;
  /** Element to render, to change the document outline without changing the look. */
  as?: TypographyElement;
}

/**
 * Text in the KalaDS type scale: headings, body, caption, label and overline. Renders the matching
 * element for the variant; `as` changes the element without changing the look.
 */
export function Typography({
  variant = TypographyDefaults.variant,
  as,
  color = TypographyDefaults.color,
  align,
  truncate,
  gutter,
  className,
  style,
  ...rest
}: TypographyProps) {
  // Rendered as a paragraph for typing purposes; the element is any of TypographyElement.
  const Element = (as ?? DEFAULT_ELEMENT[variant] ?? 'p') as 'p';
  return (
    <Element
      className={cx(styles.root, className)}
      data-variant={variant}
      data-color={color}
      data-align={align}
      data-truncate={flag(truncate)}
      data-gutter={flag(gutter)}
      style={tokenVars(
        {
          '--_family': ['semantic-type', `${variant}-family`],
          '--_size': ['semantic-type', `${variant}-size`],
          '--_weight': ['semantic-type', `${variant}-weight`],
          '--_line-height': ['semantic-type', `${variant}-line-height`],
        },
        style,
      )}
      {...(rest as ComponentPropsWithoutRef<'p'> & { ref?: Ref<HTMLParagraphElement> })}
    />
  );
}
