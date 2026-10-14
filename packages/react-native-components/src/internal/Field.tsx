import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTokens } from './theme.js';
import { textStyle, typeStyle } from './text.js';

/** The field tokens Input, Select and Autocomplete share (component.input / select / autocomplete). */
export interface FieldTokens {
  bg: string;
  bgDisabled: string;
  text: string;
  textPlaceholder: string;
  textDisabled: string;
  border: string;
  borderHover: string;
  borderFocus: string;
  borderError: string;
  borderErrorFocus: string;
  borderDisabled: string;
  borderWidth: number;
  borderWidthFocus: number;
  radius: number;
  paddingX: number;
  paddingY: number;
  labelText: string;
  helperText: string;
  errorText: string;
}

/**
 * The control box: border colour for the state, and a thicker focus border whose extra width comes out of
 * the padding, so the field never changes size on focus (the web draws it as an inset shadow).
 */
export function fieldBox(f: FieldTokens, state: { focused: boolean; hovered: boolean; invalid: boolean; disabled: boolean }): ViewStyle {
  const { focused, hovered, invalid, disabled } = state;
  const borderColor = disabled
    ? f.borderDisabled
    : invalid
      ? focused
        ? f.borderErrorFocus
        : f.borderError
      : focused
        ? f.borderFocus
        : hovered
          ? f.borderHover
          : f.border;
  const width = focused && !disabled ? f.borderWidthFocus : f.borderWidth;
  const extra = width - f.borderWidth;
  return {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: width,
    borderColor,
    borderRadius: f.radius,
    backgroundColor: disabled ? f.bgDisabled : f.bg,
    paddingVertical: f.paddingY - extra,
    paddingHorizontal: f.paddingX - extra,
  };
}

/** The field's text style (body type), as the web fields use. */
export const fieldText = typeStyle('body');

interface FieldProps {
  tokens: FieldTokens;
  label?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  /** Typography as the web field labels: Input uses the label font at size 200, Select / Autocomplete the label type. */
  labelStyle?: 'input' | 'field';
  nativeID: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/** Label, control and helper / error text, laid out as the web fields are. */
export function Field({ tokens: f, label, required, helper, error, labelStyle = 'field', nativeID, style, children }: FieldProps) {
  const { s, t } = useTokens();
  const labelText =
    labelStyle === 'input'
      ? textStyle(t.font.family.label, t.font.size['200'], t.font.weight.bold, t.font.lineHeight.medium)
      : { ...typeStyle('label'), lineHeight: Math.round(t.semantic.type.label.size * t.semantic.type.body.lineHeight) };
  const caption =
    labelStyle === 'input'
      ? textStyle(t.font.family.base, t.font.size['100'], t.font.weight.normal, t.font.lineHeight.medium)
      : typeStyle('caption');
  return (
    <View style={[{ gap: labelStyle === 'input' ? t.size['100'].rem : s.spacing.xs }, style]}>
      {label ? (
        <Text nativeID={`${nativeID}-label`} style={[labelText, { color: f.labelText }]}>
          {label}
          {required ? <Text aria-hidden> *</Text> : null}
        </Text>
      ) : null}
      {children}
      {error ? (
        <Text nativeID={`${nativeID}-error`} style={[caption, { color: f.errorText }]}>
          {error}
        </Text>
      ) : helper ? (
        <Text nativeID={`${nativeID}-helper`} style={[caption, { color: f.helperText }]}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
