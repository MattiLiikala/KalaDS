import { useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { SelectSpec } from '@kalads/spec';
import { ChevronDownIcon } from '@kalads/icons/native';
import { c, s } from '../internal/theme.js';
import { useControllable } from '../internal/controllable.js';
import { ring, useFocusVisible } from '../internal/focus.js';
import { Field, fieldBox, fieldText } from '../internal/Field.js';
import { Listbox } from '../internal/Listbox.js';
import { readOptions } from '../internal/options.js';
import { Popup } from '../internal/Popup.js';

export interface SelectProps extends Omit<SelectSpec, 'name'> {
  defaultValue?: string;
  /** When the user picks an option (the web component's `kds-change`). */
  onChange?: (value: string) => void;
  /** Option elements. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pick one option from a list, styled like Input. Children are Option elements. Pressing the field opens
 * the list next to it; picking an option closes it. For long lists or type-to-filter, use Autocomplete.
 */
export function Select({ label, value, defaultValue = '', placeholder, helper, error, disabled, required, onChange, children, style }: SelectProps) {
  const id = useId();
  const options = useMemo(() => readOptions(children), [children]);
  // Without a placeholder the first option is selected, as with a native select.
  const [current, setCurrent] = useControllable(value, defaultValue || (placeholder ? '' : (options[0]?.value ?? '')));
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const focus = useFocusVisible();
  const anchor = useRef<View>(null);
  const f = c.select;
  const selected = options.find((o) => o.value === current);
  return (
    <Field tokens={f} label={label} required={required} helper={helper} error={error} nativeID={id} style={style}>
      <Pressable
        ref={anchor}
        role="combobox"
        aria-expanded={open}
        aria-disabled={disabled}
        aria-required={required}
        aria-invalid={Boolean(error)}
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.label ?? placeholder }}
        accessibilityHint={error || helper || undefined}
        disabled={disabled}
        onPress={() => setOpen(true)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        style={[
          fieldBox(f, { focused: open || focus.focused, hovered, invalid: Boolean(error), disabled: Boolean(disabled) }),
          focus.focusVisible ? ring(s.interactive.focus, s.borderWidth.ring, s.borderWidth.ringOffset) : null,
        ]}
      >
        <Text style={[fieldText, { flex: 1, color: disabled ? f.textDisabled : selected ? f.text : f.textPlaceholder }]} numberOfLines={1}>
          {selected?.label ?? placeholder ?? ''}
        </Text>
        <ChevronDownIcon size={s.spacing.lg} color={disabled ? f.textDisabled : f.icon} />
      </Pressable>
      <Popup anchorRef={anchor} open={open} placement="bottom-start" gap={c.autocomplete.popupOffset} matchWidth onDismiss={() => setOpen(false)}>
        <Listbox
          options={options}
          selected={current}
          active={-1}
          label={label}
          onPick={(o) => {
            setOpen(false);
            if (o.value === current) return;
            setCurrent(o.value);
            onChange?.(o.value);
          }}
        />
      </Popup>
    </Field>
  );
}
