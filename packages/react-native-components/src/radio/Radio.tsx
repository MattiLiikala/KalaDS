import { useContext, useState, type ReactNode } from 'react';
import { Pressable, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import type { RadioSpec } from '@kalads/spec';
import { c } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { ring, useFocusVisible } from '../internal/focus.js';
import { RadioGroupContext } from '../radio-group/context.js';

export interface RadioProps extends Omit<RadioSpec, 'checked'>, Omit<PressableProps, 'onPress' | 'children' | 'style' | 'disabled'> {
  /** Label text. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const body = typeStyle('body');

/** One option in a RadioGroup. Always use inside a RadioGroup: the group owns the selection. */
export function Radio({ value = '', disabled, children, style, ...rest }: RadioProps) {
  const group = useContext(RadioGroupContext);
  const [hovered, setHovered] = useState(false);
  const focus = useFocusVisible();
  const k = c.radio;
  const checked = group?.value === value;
  const off = Boolean(disabled || group?.disabled);
  const border = off ? k.borderDisabled : checked ? (hovered ? k.borderCheckedHover : k.borderChecked) : hovered ? k.borderHover : k.border;
  const dot = off ? (checked ? k.dotDisabled : 'transparent') : checked ? (hovered ? k.dotHover : k.dot) : 'transparent';
  return (
    <Pressable
      role="radio"
      aria-checked={checked}
      aria-disabled={off}
      disabled={off}
      onPress={() => group?.select(value)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: k.gap, alignSelf: 'flex-start' }, style]}
      {...rest}
    >
      <View style={{ height: body.lineHeight, justifyContent: 'center' }}>
        <View
          style={[
            {
              width: k.size,
              height: k.size,
              borderWidth: k.borderWidth,
              borderRadius: k.radius,
              borderColor: border,
              backgroundColor: off ? k.bgDisabled : hovered && !checked ? k.bgHover : k.bg,
              alignItems: 'center',
              justifyContent: 'center',
            },
            focus.focusVisible ? ring(k.ringFocus, k.ringWidth, k.ringOffset) : null,
          ]}
        >
          <View style={{ width: k.dotSize, height: k.dotSize, borderRadius: k.radius, backgroundColor: dot }} />
        </View>
      </View>
      {children != null && <Text style={[body, { color: off ? k.labelTextDisabled : k.labelText }]}>{children}</Text>}
    </Pressable>
  );
}
