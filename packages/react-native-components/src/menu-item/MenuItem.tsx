import { useContext, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { IconContext } from '@kalads/icons/native';
import { MenuItemDefaults, type MenuItemSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { isText } from '../internal/children.js';
import { ring, useFocusVisible } from '../internal/focus.js';
import { MenuContext } from '../menu/context.js';

export interface MenuItemProps extends MenuItemSpec {
  /** Leading icon (the web component's `start` slot). */
  start?: ReactNode;
  /** Trailing content, e.g. a keyboard shortcut (the web component's `end` slot). */
  end?: ReactNode;
  /** Item text. */
  children?: ReactNode;
}

/** One action in a Menu. Disabled items stay visible and announced, but can't be picked. */
export function MenuItem({ value = '', variant = MenuItemDefaults.variant, disabled, start, end, children }: MenuItemProps) {
  const { c, s } = useTokens();
  const menu = useContext(MenuContext);
  const [hovered, setHovered] = useState(false);
  const focus = useFocusVisible();
  const k = c.menuItem;
  const color = disabled ? k.textDisabled : variant === 'danger' ? k.textDanger : k.text;
  const body = typeStyle('body');
  return (
    <Pressable
      role="menuitem"
      aria-disabled={disabled}
      disabled={disabled}
      onPress={() => menu?.pick(value)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: k.gap,
          paddingVertical: k.paddingY,
          paddingHorizontal: k.paddingX,
          borderRadius: k.radius,
          backgroundColor: disabled ? 'transparent' : pressed ? k.bgActive : hovered || focus.focused ? k.bgHover : 'transparent',
        },
        focus.focusVisible ? ring(k.ringFocus, k.ringWidth, k.ringOffset) : null,
      ]}
    >
      {start ? <IconContext.Provider value={{ color, size: k.iconSize }}>{start}</IconContext.Provider> : null}
      <View style={{ flex: 1 }}>
        <Text style={[body, { color }]} numberOfLines={1}>
          {children}
        </Text>
      </View>
      {end ? isText(end) ? <Text style={[typeStyle('caption'), { color: s.text.muted }]}>{end}</Text> : end : null}
    </Pressable>
  );
}
