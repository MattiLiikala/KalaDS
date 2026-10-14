import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { CheckboxGroupDefaults, type CheckboxGroupSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { Group } from '../internal/Group.js';

export interface CheckboxGroupProps extends CheckboxGroupSpec {
  /** Checkbox elements. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Labelled group of related Checkboxes, with shared helper or error text. Each checkbox keeps its own state. */
export function CheckboxGroup({ orientation = CheckboxGroupDefaults.orientation, children, ...rest }: CheckboxGroupProps) {
  const { c } = useTokens();
  return (
    <Group tokens={c.checkboxGroup} role="group" orientation={orientation} {...rest}>
      {children}
    </Group>
  );
}
