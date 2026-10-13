import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { textOf } from './children.js';

export interface OptionData {
  value: string;
  label: string;
  disabled: boolean;
}

type OptionProps = { value?: string | number; disabled?: boolean; children?: ReactNode };

/** Reads `<option>` children (as the web components read their light DOM) into plain option data. */
export function readOptions(children: ReactNode): OptionData[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    const el = child as ReactElement<OptionProps>;
    if (el.type === 'option') {
      const label = textOf(el.props.children);
      return [{ value: String(el.props.value ?? label), label, disabled: Boolean(el.props.disabled) }];
    }
    return readOptions(el.props.children);
  });
}
