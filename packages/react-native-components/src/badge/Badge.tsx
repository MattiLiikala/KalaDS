import type { ReactNode } from 'react';
import { Text, View, type ViewProps } from 'react-native';
import { BadgeDefaults, type BadgeSpec } from '@kalads/spec';
import { c, t } from '../internal/theme.js';
import { textStyle } from '../internal/text.js';

export interface BadgeProps extends BadgeSpec, ViewProps {
  children?: ReactNode;
}

const font = textStyle(t.font.family.label, t.font.size['100'], t.font.weight.bold, t.font.lineHeight.small);

/**
 * Small status label. Outlined (no fill, a 1px border in the text colour), so the text colour must
 * contrast with the surface behind it at 4.5:1 or more.
 */
export function Badge({ variant = BadgeDefaults.variant, style, children, ...rest }: BadgeProps) {
  const b = c.badge[variant];
  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          borderWidth: b.borderWidth,
          borderColor: b.border,
          borderRadius: b.radius,
          // The border sits inside the padding, so badges keep the same outer size as without one.
          paddingVertical: b.paddingY - b.borderWidth,
          paddingHorizontal: b.paddingX - b.borderWidth,
        },
        style,
      ]}
      {...rest}
    >
      <Text style={[font, { color: b.text }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}
