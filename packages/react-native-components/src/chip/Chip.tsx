import { useState, type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { CloseIcon, IconContext } from '@kalads/icons/native';
import { ChipDefaults, type ChipSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { textOf } from '../internal/children.js';
import { useControllable } from '../internal/controllable.js';
import { ring, useFocusVisible } from '../internal/focus.js';

export interface ChipProps extends ChipSpec {
  defaultSelected?: boolean;
  /** Leading icon (the web component's `start` slot). */
  start?: ReactNode;
  /** When a selectable chip is toggled (the web component's `kds-change`). */
  onChange?: (selected: boolean) => void;
  /** When the remove button is pressed (the web component's `kds-remove`). */
  onRemove?: () => void;
  /** Chip text. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const label = typeStyle('label');

/**
 * Compact element for filters, choices or entered values (tags). `selectable` makes it a toggle button,
 * `removable` adds a remove button; a chip that is neither is static text.
 */
export function Chip({
  variant = ChipDefaults.variant,
  selectable,
  selected,
  defaultSelected = false,
  removable,
  removeLabel = ChipDefaults.removeLabel,
  disabled,
  start,
  onChange,
  onRemove,
  children,
  style,
}: ChipProps) {
  const { c } = useTokens();
  const [on, setOn] = useControllable(selected, defaultSelected);
  const [hovered, setHovered] = useState(false);
  const [removeHovered, setRemoveHovered] = useState(false);
  const bodyFocus = useFocusVisible();
  const removeFocus = useFocusVisible();
  const k = c.chip;
  const v = k[variant];
  const isSelected = Boolean(selectable && on);

  const colors = (pressed: boolean) => {
    if (disabled) return { bg: k.bgDisabled, border: k.borderDisabled, text: k.textDisabled };
    if (isSelected) return { bg: hovered && selectable ? v.bgSelectedHover : v.bgSelected, border: v.borderSelected, text: v.textSelected };
    if (selectable && pressed) return { bg: v.bgActive, border: v.borderHover, text: v.textHover };
    if (selectable && hovered) return { bg: v.bgHover, border: v.borderHover, text: v.textHover };
    return { bg: k.bg, border: v.border, text: v.text };
  };

  const content = (color: string) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: k.gap, paddingVertical: k.paddingY, paddingLeft: k.paddingX, paddingRight: removable ? 0 : k.paddingX }}>
      {start ? <IconContext.Provider value={{ color, size: k.iconSize }}>{start}</IconContext.Provider> : null}
      <Text style={[label, { color }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );

  const chip = (pressed: boolean) => {
    const { bg, border, text } = colors(pressed);
    return (
      <View style={[{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: k.borderWidth, borderRadius: k.radius, borderColor: border, backgroundColor: bg }, style]}>
        {selectable ? (
          <View style={bodyFocus.focusVisible ? [{ borderRadius: k.radius }, ring(k.ringFocus, k.ringWidth, k.ringOffset)] : null}>{content(text)}</View>
        ) : (
          content(text)
        )}
        {removable && (
          <Pressable
            role="button"
            aria-label={`${removeLabel} ${textOf(children)}`.trim()}
            aria-disabled={disabled}
            disabled={disabled}
            onPress={() => onRemove?.()}
            onHoverIn={() => setRemoveHovered(true)}
            onHoverOut={() => setRemoveHovered(false)}
            onFocus={removeFocus.onFocus}
            onBlur={removeFocus.onBlur}
            hitSlop={k.gap}
            style={[
              { marginHorizontal: k.gap, borderRadius: k.radius, backgroundColor: removeHovered && !disabled ? v.bgActive : 'transparent' },
              removeFocus.focusVisible ? ring(k.ringFocus, k.ringWidth, k.ringOffset) : null,
            ]}
          >
            <CloseIcon size={k.iconSize} color={text} />
          </Pressable>
        )}
      </View>
    );
  };

  if (!selectable) return chip(false);
  return (
    <Pressable
      role="button"
      aria-pressed={isSelected}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={() => {
        setOn(!on);
        onChange?.(!on);
      }}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={bodyFocus.onFocus}
      onBlur={bodyFocus.onBlur}
      style={{ alignSelf: 'flex-start' }}
    >
      {({ pressed }) => chip(pressed)}
    </Pressable>
  );
}
