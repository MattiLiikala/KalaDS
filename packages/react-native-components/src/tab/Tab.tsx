import { useContext, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { TabSpec } from '@kalads/spec';
import { c, s, t } from '../internal/theme.js';
import { textStyle } from '../internal/text.js';
import { ring, useFocusVisible } from '../internal/focus.js';
import { TabsContext } from '../tabs/context.js';

export interface TabProps extends TabSpec {
  /** Tab label. */
  children?: ReactNode;
}

/** One tab in Tabs. Tabs sets its selection. */
export function Tab({ value = '', disabled, children }: TabProps) {
  const tabs = useContext(TabsContext);
  const [hovered, setHovered] = useState(false);
  const focus = useFocusVisible();
  const k = c.tab;
  const selected = tabs?.value === value;
  const type = t.semantic.type;
  const font = textStyle(type.label.family, type.label.size, type.label.weight, type.body.lineHeight);
  // Hover darkens only unselected tabs; the selected tab keeps its accent colour.
  const color = disabled ? k.textDisabled : selected ? k.textSelected : hovered ? k.textHover : k.text;
  return (
    <Pressable
      role="tab"
      aria-selected={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={() => tabs?.select(value)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: s.spacing.sm,
          paddingVertical: k.paddingY,
          paddingHorizontal: k.paddingX,
          borderTopLeftRadius: k.radius,
          borderTopRightRadius: k.radius,
          backgroundColor: hovered && !disabled ? k.bgHover : 'transparent',
        },
        focus.focusVisible ? ring(k.ringFocus, k.ringWidth, k.ringOffset) : null,
      ]}
    >
      <Text style={[font, { color }]} numberOfLines={1}>
        {children}
      </Text>
      {/* Selected indicator along the bottom edge. */}
      {selected ? <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: k.indicatorWidth, backgroundColor: k.indicator }} /> : null}
    </Pressable>
  );
}
