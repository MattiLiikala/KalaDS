import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { textOf } from './children.js';

export interface OptionProps {
  value: string;
  disabled?: boolean;
  /** Option label. */
  children?: ReactNode;
}

/**
 * One choice in a Select or Autocomplete. React Native has no <option> element, so these take Option
 * children: `<Select><Option value="a">Apple</Option></Select>`.
 */
export function Option(_props: OptionProps): null {
  return null;
}

export interface OptionData {
  value: string;
  label: string;
  disabled: boolean;
}

/** Reads Option children into plain option data. */
export function readOptions(children: ReactNode): OptionData[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    const el = child as ReactElement<OptionProps>;
    if (el.type === Option) return [{ value: el.props.value, label: textOf(el.props.children), disabled: Boolean(el.props.disabled) }];
    return readOptions((el.props as { children?: ReactNode }).children);
  });
}
