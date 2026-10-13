import { View, type ViewProps, type ViewStyle } from 'react-native';
import type { BoxSpec } from '@kalads/spec';
import { c, s, space } from '../internal/theme.js';
import { SurfaceContext } from '../internal/surface.js';

export interface BoxProps extends Omit<BoxSpec, 'inline'>, ViewProps {
  /** Shrink to the content's width instead of filling the row (the web component's inline-block). */
  inline?: boolean;
}

/**
 * Generic block with token-based padding, margin, background, border and radius. Every value is a token
 * name. `bg="inverse"` also switches Typography inside it to inverse text.
 */
export function Box({ padding, paddingX, paddingY, marginY, bg, radius, border, inline, style, children, ...rest }: BoxProps) {
  const p = space(padding) ?? c.box.padding;
  const box: ViewStyle = {
    paddingVertical: space(paddingY) ?? p,
    paddingHorizontal: space(paddingX) ?? p,
    marginVertical: space(marginY) ?? 0,
    backgroundColor: bg ? s.bg[bg] : c.box.bg,
    borderRadius: radius ? s.radius[radius] : c.box.radius,
    ...(border ? { borderWidth: c.box.borderWidth, borderColor: c.box.border } : {}),
    ...(inline ? { alignSelf: 'flex-start' } : {}),
  };
  const content = (
    <View style={[box, style]} {...rest}>
      {children}
    </View>
  );
  return bg === 'inverse' ? <SurfaceContext.Provider value="inverse">{content}</SurfaceContext.Provider> : content;
}
