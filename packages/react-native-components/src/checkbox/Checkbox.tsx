import { useState, type ReactNode } from 'react';
import { Pressable, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { IconContext, CheckIcon, MinusIcon } from '@kalads/icons/native';
import type { CheckboxSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { useControllable } from '../internal/controllable.js';
import { ring, useFocusVisible } from '../internal/focus.js';

export interface CheckboxProps extends Omit<CheckboxSpec, 'name' | 'value'>, Omit<PressableProps, 'onPress' | 'children' | 'style' | 'disabled'> {
  defaultChecked?: boolean;
  /** When the user toggles the checkbox (the web component's `kds-change`). */
  onChange?: (checked: boolean) => void;
  /** Label text. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const body = typeStyle('body');

/**
 * Binary choice, or a mixed state for "select all" (`indeterminate`). The whole row, label included, is
 * the touch target. There's no error state on a single checkbox: show errors on the CheckboxGroup.
 */
export function Checkbox({ checked, defaultChecked = false, indeterminate, disabled, required, onChange, children, style, ...rest }: CheckboxProps) {
  const { c } = useTokens();
  const [on, setOn] = useControllable(checked, defaultChecked);
  const [hovered, setHovered] = useState(false);
  const focus = useFocusVisible();
  const k = c.checkbox;
  const filled = on || indeterminate;
  const bg = disabled ? (filled ? k.bgCheckedDisabled : k.bgDisabled) : filled ? (hovered ? k.bgCheckedHover : k.bgChecked) : hovered ? k.bgHover : k.bg;
  const border = disabled ? (filled ? k.bgCheckedDisabled : k.borderDisabled) : filled ? (hovered ? k.borderCheckedHover : k.borderChecked) : hovered ? k.borderHover : k.border;
  return (
    <Pressable
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : on}
      aria-disabled={disabled}
      aria-required={required}
      disabled={disabled}
      onPress={() => {
        setOn(!on);
        onChange?.(!on);
      }}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: k.gap, alignSelf: 'flex-start' }, style]}
      {...rest}
    >
      {/* Centre the box on the first line of label text. */}
      <View style={{ height: body.lineHeight, justifyContent: 'center' }}>
        <View
          style={[
            {
              width: k.size,
              height: k.size,
              borderWidth: k.borderWidth,
              borderRadius: k.radius,
              borderColor: border,
              backgroundColor: bg,
              alignItems: 'center',
              justifyContent: 'center',
            },
            focus.focusVisible ? ring(k.ringFocus, k.ringWidth, k.ringOffset) : null,
          ]}
        >
          <IconContext.Provider value={{ color: disabled ? k.checkDisabled : k.check, size: k.size }}>
            {indeterminate ? <MinusIcon /> : on ? <CheckIcon /> : null}
          </IconContext.Provider>
        </View>
      </View>
      {children != null && <Text style={[body, { color: disabled ? k.labelTextDisabled : k.labelText }]}>{children}</Text>}
    </Pressable>
  );
}
