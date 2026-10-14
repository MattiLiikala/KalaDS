import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { AutocompleteDefaults, type AutocompleteSpec } from '@kalads/spec';
import { ChevronDownIcon } from '@kalads/icons/native';
import { useTokens } from '../internal/theme.js';
import { useControllable } from '../internal/controllable.js';
import { Field, fieldBox, fieldText } from '../internal/Field.js';
import { Listbox } from '../internal/Listbox.js';
import { readOptions, type OptionData } from '../internal/options.js';

export interface AutocompleteProps extends Omit<AutocompleteSpec, 'name'> {
  defaultValue?: string;
  /** When an option is picked or cleared (the web component's `kds-change`). */
  onChange?: (value: string) => void;
  /** Option elements. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Text field that suggests matching options as you type. Children are Option elements. Typing filters
 * them; picking one fills the field. Leaving the field restores the selected option's label, unless the
 * text exactly matches another option.
 */
export function Autocomplete({
  label,
  value,
  defaultValue = '',
  placeholder,
  helper,
  error,
  emptyText = AutocompleteDefaults.emptyText,
  disabled,
  required,
  onChange,
  children,
  style,
}: AutocompleteProps) {
  const { c, s } = useTokens();
  const id = useId();
  const options = useMemo(() => readOptions(children), [children]);
  const [current, setCurrent] = useControllable(value, defaultValue);
  const selectedLabel = options.find((o) => o.value === current)?.label ?? '';
  const [query, setQuery] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const f = c.autocomplete;

  useEffect(() => {
    if (!focused) setQuery(selectedLabel);
  }, [selectedLabel, focused]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || query === selectedLabel) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, selectedLabel]);

  const commit = (option: OptionData | undefined) => {
    if (option?.disabled) return;
    const next = option?.value ?? '';
    setQuery(option?.label ?? '');
    setOpen(false);
    if (next !== current) {
      setCurrent(next);
      onChange?.(next);
    }
  };

  return (
    <Field
      tokens={f}
      label={label}
      required={required}
      helper={helper}
      error={error}
      nativeID={id}
      style={style}
    >
      {/* The list sits inline under the field: a Modal would take focus from the text input and close the keyboard. */}
      <View style={{ position: 'relative', zIndex: open ? 1000 : undefined }}>
        <View
          style={fieldBox(f, {
            focused,
            hovered: false,
            invalid: Boolean(error),
            disabled: Boolean(disabled),
          })}
        >
          <TextInput
            role="combobox"
            aria-expanded={open}
            aria-disabled={disabled}
            aria-invalid={Boolean(error)}
            accessibilityLabel={label}
            accessibilityHint={error || helper || undefined}
            autoComplete="off"
            autoCorrect={false}
            value={query}
            placeholder={placeholder}
            placeholderTextColor={f.textPlaceholder}
            editable={!disabled}
            onChangeText={(text) => {
              setQuery(text);
              setOpen(true);
              if (!text) commit(undefined);
            }}
            onFocus={() => {
              setFocused(true);
              setOpen(true);
            }}
            onBlur={() => {
              setFocused(false);
              const exact = options.find(
                (o) => !o.disabled && o.label.toLowerCase() === query.trim().toLowerCase(),
              );
              if (exact && exact.value !== current) commit(exact);
              else setQuery(selectedLabel);
            }}
            style={[
              fieldText,
              {
                flex: 1,
                padding: 0,
                margin: 0,
                color: disabled ? f.textDisabled : f.text,
                ...({ outlineStyle: 'none' } as object),
              },
            ]}
          />
          <ChevronDownIcon size={s.spacing.lg} color={f.icon} />
        </View>
        {open && focused && (
          <View
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: f.popupOffset,
              zIndex: 1000,
            }}
          >
            <Listbox
              options={matches}
              selected={current}
              active={-1}
              emptyText={emptyText}
              label={label}
              onPick={commit}
              pickOnPressIn
            />
          </View>
        )}
      </View>
    </Field>
  );
}
