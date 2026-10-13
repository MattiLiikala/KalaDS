import { useMemo, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { RadioGroupDefaults, type RadioGroupSpec } from '@kalads/spec';
import { c } from '../internal/theme.js';
import { useControllable } from '../internal/controllable.js';
import { Group } from '../internal/Group.js';
import { RadioGroupContext } from './context.js';

export interface RadioGroupProps extends Omit<RadioGroupSpec, 'name'> {
  defaultValue?: string;
  /** When the user selects an option (the web component's `kds-change`). */
  onChange?: (value: string) => void;
  /** Radio elements. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Group of Radio options where exactly one can be selected. */
export function RadioGroup({
  value,
  defaultValue = '',
  orientation = RadioGroupDefaults.orientation,
  disabled,
  onChange,
  children,
  ...rest
}: RadioGroupProps) {
  const [current, setCurrent] = useControllable(value, defaultValue);
  const context = useMemo(
    () => ({
      value: current,
      disabled: Boolean(disabled),
      select: (next: string) => {
        if (next === current) return;
        setCurrent(next);
        onChange?.(next);
      },
    }),
    [current, disabled, setCurrent, onChange],
  );
  return (
    <Group tokens={c.radioGroup} role="radiogroup" orientation={orientation} {...rest}>
      <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
    </Group>
  );
}
