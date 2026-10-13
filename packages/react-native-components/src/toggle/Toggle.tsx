import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Pressable, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import type { ToggleSpec } from '@kalads/spec';
import { c } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { useControllable } from '../internal/controllable.js';
import { ring, useFocusVisible } from '../internal/focus.js';

export interface ToggleProps extends Omit<ToggleSpec, 'name' | 'value'>, Omit<PressableProps, 'onPress' | 'children' | 'style' | 'disabled'> {
  defaultChecked?: boolean;
  /** When the user flips the switch (the web component's `kds-change`). */
  onChange?: (checked: boolean) => void;
  /** Label text. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const body = typeStyle('body');

/**
 * On/off switch for settings that take effect immediately. Use a Checkbox when the choice only applies
 * after a form is submitted. The thumb slides over 150 ms, or jumps when the user prefers reduced motion.
 */
export function Toggle({ checked, defaultChecked = false, disabled, onChange, children, style, ...rest }: ToggleProps) {
  const [on, setOn] = useControllable(checked, defaultChecked);
  const [hovered, setHovered] = useState(false);
  const focus = useFocusVisible();
  const k = c.toggle;
  // Same gap around the thumb on every side: half of what's left of the inner track height.
  const inset = (k.trackHeight - 2 * k.borderWidth - k.thumbSize) / 2;
  const travel = k.trackWidth - 2 * k.borderWidth - k.thumbSize - 2 * inset;
  const position = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) position.setValue(on ? 1 : 0);
      else Animated.timing(position, { toValue: on ? 1 : 0, duration: 150, useNativeDriver: true }).start();
    });
    return () => {
      cancelled = true;
    };
  }, [on, position]);

  const bg = disabled ? k.trackBgDisabled : on ? (hovered ? k.trackBgCheckedHover : k.trackBgChecked) : hovered ? k.trackBgHover : k.trackBg;
  const border = disabled ? k.trackBorderDisabled : on ? (hovered ? k.trackBorderCheckedHover : k.trackBorderChecked) : hovered ? k.trackBorderHover : k.trackBorder;
  const thumb = disabled ? k.thumbDisabled : on ? k.thumbChecked : hovered ? k.thumbHover : k.thumb;

  return (
    <Pressable
      role="switch"
      aria-checked={on}
      aria-disabled={disabled}
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
      <View style={{ height: body.lineHeight, justifyContent: 'center' }}>
        <View
          style={[
            {
              width: k.trackWidth,
              height: k.trackHeight,
              borderWidth: k.borderWidth,
              borderRadius: k.radius,
              borderColor: border,
              backgroundColor: bg,
              justifyContent: 'center',
              paddingHorizontal: inset,
            },
            focus.focusVisible ? ring(k.ringFocus, k.ringWidth, k.ringOffset) : null,
          ]}
        >
          <Animated.View
            style={{
              width: k.thumbSize,
              height: k.thumbSize,
              borderRadius: k.radius,
              backgroundColor: thumb,
              transform: [{ translateX: position.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }) }],
            }}
          />
        </View>
      </View>
      {children != null && <Text style={[body, { color: disabled ? k.labelTextDisabled : k.labelText }]}>{children}</Text>}
    </Pressable>
  );
}
