import { View, type ViewProps, type ViewStyle } from 'react-native';
import { PaperDefaults, type PaperSpec } from '@kalads/spec';
import { c, s } from '../internal/theme.js';

export interface PaperProps extends PaperSpec, ViewProps {}

const SHADOW = { 0: c.paper.shadow0, 1: c.paper.shadow1, 2: c.paper.shadow2, 3: c.paper.shadow3 };

/**
 * Plain surface for grouping content: background, 1px border and a crisp offset shadow that grows with
 * `elevation`. Use Card when you need header / body / footer sections.
 */
export function Paper({ elevation = PaperDefaults.elevation, variant = PaperDefaults.variant, padding, style, ...rest }: PaperProps) {
  const k = c.paper;
  return (
    <View
      style={[
        {
          padding: padding === 'none' ? 0 : padding ? s.padding[padding] : k.padding,
          backgroundColor: k.bg,
          borderWidth: k.borderWidth,
          borderColor: variant === 'flat' ? 'transparent' : k.border,
          borderRadius: k.radius,
          boxShadow: (SHADOW[elevation] ?? k.shadow1) as ViewStyle['boxShadow'],
        },
        style,
      ]}
      {...rest}
    />
  );
}
