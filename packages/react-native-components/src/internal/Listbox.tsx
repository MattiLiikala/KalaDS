import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { typeStyle } from './text.js';
import { t } from './theme.js';
import { fontFamily } from './fonts.js';
import type { OptionData } from './options.js';

/** Popup surface tokens shared by the listbox popups (component.autocomplete popup-* and option-*). */
const p = t.component.autocomplete;

interface ListboxProps {
  options: OptionData[];
  selected: string;
  active: number;
  emptyText?: string;
  label?: string;
  onPick: (option: OptionData) => void;
  onHover?: (index: number) => void;
  /** Pick on press-in, before a focused text field blurs (Autocomplete). */
  pickOnPressIn?: boolean;
}

/** The option list of Select and Autocomplete, styled like kds-autocomplete's listbox. */
export function Listbox({ options, selected, active, emptyText, label, onPick, onHover, pickOnPressIn }: ListboxProps) {
  const body = typeStyle('body');
  const [hover, setHover] = useState(-1);
  return (
    <View
      // React Native has no listbox role: a list of options.
      role="list"
      aria-label={label}
      style={{
        maxHeight: p.popupMaxHeight,
        padding: p.popupPadding,
        backgroundColor: p.popupBg,
        borderWidth: p.popupBorderWidth,
        borderColor: p.popupBorder,
        borderRadius: p.popupRadius,
        boxShadow: p.popupShadow as never,
      }}
    >
      <ScrollView>
        {options.length ? (
          options.map((o, i) => {
            const isSelected = o.value === selected;
            return (
              <Pressable
                key={`${o.value}-${i}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled}
                disabled={o.disabled}
                onPress={pickOnPressIn ? undefined : () => onPick(o)}
                onPressIn={pickOnPressIn ? () => onPick(o) : undefined}
                onHoverIn={() => {
                  setHover(i);
                  onHover?.(i);
                }}
                onHoverOut={() => setHover(-1)}
                style={({ pressed }) => ({
                  paddingVertical: p.optionPaddingY,
                  paddingHorizontal: p.optionPaddingX,
                  borderRadius: p.optionRadius,
                  backgroundColor: o.disabled ? 'transparent' : i === active || pressed ? p.optionBgActive : hover === i ? p.optionBgHover : 'transparent',
                })}
              >
                <Text
                  style={[
                    body,
                    isSelected ? { fontFamily: fontFamily(t.font.family.base, t.font.weight.bold) } : null,
                    { color: o.disabled ? p.optionTextDisabled : i === active ? p.optionTextActive : p.optionText },
                  ]}
                >
                  {o.label}
                </Text>
              </Pressable>
            );
          })
        ) : (
          <Text style={[body, { paddingVertical: p.optionPaddingY, paddingHorizontal: p.optionPaddingX, color: p.emptyText }]}>{emptyText}</Text>
        )}
      </ScrollView>
    </View>
  );
}
