import { View, type ViewProps, type ViewStyle } from 'react-native';
import { PaperDefaults, type PaperSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';

export interface PaperProps extends PaperSpec, ViewProps {}

/**
 * Plain surface for grouping content: background, 1px border and a crisp offset shadow that grows with
 * `elevation`. Use Card when you need header / body / footer sections.
 */
export function Paper({ elevation = PaperDefaults.elevation, variant = PaperDefaults.variant, padding, style, ...rest }: PaperProps) {
  const { c, s } = useTokens();
  const k = c.paper;
  const shadow = { 0: k.shadow0, 1: k.shadow1, 2: k.shadow2, 3: k.shadow3 }[elevation] ?? k.shadow1;
  return (
    <View
      style={[
        {
          padding: padding === 'none' ? 0 : padding ? s.padding[padding] : k.padding,
          backgroundColor: k.bg,
          borderWidth: k.borderWidth,
          borderColor: variant === 'flat' ? 'transparent' : k.border,
          borderRadius: k.radius,
          boxShadow: shadow as ViewStyle['boxShadow'],
        },
        style,
      ]}
      {...rest}
    />
  );
}
