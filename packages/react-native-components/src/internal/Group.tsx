import { useId, type ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { t } from './theme.js';
import { typeStyle } from './text.js';

/** Tokens of a labelled option group (component.checkbox-group / radio-group). */
export interface GroupTokens {
  gap: number;
  gapHorizontal: number;
  legendText: string;
  helperText: string;
  errorText: string;
}

interface GroupProps {
  tokens: GroupTokens;
  role: 'group' | 'radiogroup';
  label?: string;
  orientation: 'vertical' | 'horizontal';
  helper?: string;
  error?: string;
  required?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/** A labelled group of options with helper or error text, as the web checkbox and radio groups. */
export function Group({ tokens: g, role, label, orientation, helper, error, required, style, children }: GroupProps) {
  const id = useId();
  const legend = { ...typeStyle('label'), lineHeight: Math.round(t.semantic.type.label.size * t.semantic.type.body.lineHeight) };
  const caption = typeStyle('caption');
  return (
    <View style={[{ gap: g.gap }, style]}>
      {label ? (
        <Text nativeID={`${id}-label`} style={[legend, { color: g.legendText }]}>
          {label}
          {required ? <Text aria-hidden> *</Text> : null}
        </Text>
      ) : null}
      <View
        role={role}
        aria-labelledby={label ? `${id}-label` : undefined}
        accessibilityLabel={label}
        accessibilityHint={error || helper || undefined}
        style={orientation === 'horizontal' ? { flexDirection: 'row', flexWrap: 'wrap', rowGap: g.gap, columnGap: g.gapHorizontal } : { gap: g.gap }}
      >
        {children}
      </View>
      {error ? <Text style={[caption, { color: g.errorText }]}>{error}</Text> : helper ? <Text style={[caption, { color: g.helperText }]}>{helper}</Text> : null}
    </View>
  );
}
