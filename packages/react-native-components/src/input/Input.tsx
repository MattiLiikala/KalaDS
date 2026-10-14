import { useId, useState } from 'react';
import { TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { InputDefaults, type InputSpec, type InputType } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { useControllable } from '../internal/controllable.js';
import { Field, fieldBox, fieldText } from '../internal/Field.js';

const KEYBOARD: Record<InputType, Partial<TextInputProps>> = {
  text: {},
  email: { keyboardType: 'email-address', autoCapitalize: 'none', autoComplete: 'email', inputMode: 'email' },
  password: { secureTextEntry: true, autoCapitalize: 'none' },
  number: { keyboardType: 'numeric', inputMode: 'numeric' },
  search: { keyboardType: 'web-search', inputMode: 'search', returnKeyType: 'search' },
  tel: { keyboardType: 'phone-pad', inputMode: 'tel', autoComplete: 'tel' },
  url: { keyboardType: 'url', autoCapitalize: 'none', inputMode: 'url' },
};

export interface InputProps extends InputSpec, Omit<TextInputProps, keyof InputSpec | 'onChange' | 'defaultValue' | 'style' | 'editable'> {
  defaultValue?: string;
  /** On every change to the text (the web component's `kds-input`). */
  onChange?: (value: string) => void;
  /** When the value is committed: on submit or when editing ends (the web component's `kds-change`). */
  onCommit?: (value: string) => void;
  /** Layout style for the field's outer box. */
  style?: StyleProp<ViewStyle>;
}

/** Text input field with label, helper text and error state. `type` picks the matching keyboard. */
export function Input({
  label,
  value,
  defaultValue = '',
  placeholder,
  type = InputDefaults.type,
  helper,
  error,
  disabled,
  required,
  onChange,
  onCommit,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const { c } = useTokens();
  const id = useId();
  const [current, setCurrent] = useControllable(value, defaultValue);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const f = c.input;
  return (
    <Field tokens={f} label={label} required={required} helper={helper} error={error} labelStyle="input" nativeID={id} style={style}>
      <View
        style={fieldBox(f, { focused, hovered, invalid: Boolean(error), disabled: Boolean(disabled) })}
        // Hover only matters with a pointer (iPad, web).
        {...({ onPointerEnter: () => setHovered(true), onPointerLeave: () => setHovered(false) } as object)}
      >
        <TextInput
          {...KEYBOARD[type]}
          value={current}
          placeholder={placeholder}
          placeholderTextColor={f.textPlaceholder}
          editable={!disabled}
          aria-disabled={disabled}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-labelledby={label ? `${id}-label` : undefined}
          accessibilityLabel={label}
          accessibilityHint={error || helper || undefined}
          onChangeText={(text) => {
            setCurrent(text);
            onChange?.(text);
          }}
          onSubmitEditing={(e) => onCommit?.(e.nativeEvent.text)}
          onEndEditing={(e) => onCommit?.(e.nativeEvent.text)}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            fieldText,
            { flex: 1, padding: 0, margin: 0, color: disabled ? f.textDisabled : f.text, ...({ outlineStyle: 'none' } as object) },
          ]}
          {...rest}
        />
      </View>
    </Field>
  );
}
