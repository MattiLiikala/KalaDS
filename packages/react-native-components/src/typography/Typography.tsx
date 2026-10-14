import { Text, type TextProps, type TextStyle } from 'react-native';
import { TypographyDefaults, type TypographySpec, type TypographyVariant } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { useSurface } from '../internal/surface.js';

export interface TypographyProps extends Omit<TypographySpec, 'as'>, TextProps {
  /**
   * Heading level for assistive technology, like the web component's `as` (h1–h6). Defaults to the
   * variant's level for headings. 0 removes the heading role.
   */
  level?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

const HEADING_LEVEL: Partial<Record<TypographyVariant, number>> = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 };

/** Text in the KalaDS type scale: headings, body, caption, label and overline. */
export function Typography({
  variant = TypographyDefaults.variant,
  color = TypographyDefaults.color,
  align,
  truncate,
  gutter,
  level,
  style,
  ...rest
}: TypographyProps) {
  const { c } = useTokens();
  const colors = {
    default: c.typography.colorDefault,
    subtle: c.typography.colorSubtle,
    muted: c.typography.colorMuted,
    brand: c.typography.colorBrand,
    danger: c.typography.colorDanger,
    inverse: c.typography.colorInverse,
  };
  const surface = useSurface();
  const heading = level ?? HEADING_LEVEL[variant] ?? 0;
  const resolved = color === 'default' && surface === 'inverse' ? 'inverse' : color;
  const text: TextStyle = {
    ...typeStyle(variant),
    color: colors[resolved],
    ...(variant === 'overline' ? { textTransform: 'uppercase' } : {}),
    ...(align ? { textAlign: align === 'start' ? 'left' : align === 'end' ? 'right' : 'center' } : {}),
    ...(gutter ? { marginBottom: c.typography.gutter } : {}),
  };
  return (
    <Text
      style={[text, style]}
      numberOfLines={truncate ? 1 : undefined}
      ellipsizeMode={truncate ? 'tail' : undefined}
      role={heading ? 'heading' : undefined}
      aria-level={heading || undefined}
      {...rest}
    />
  );
}
