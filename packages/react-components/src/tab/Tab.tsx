import { useContext, type ComponentPropsWithRef } from 'react';
import type { TabSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { TabsContext } from '../tabs/context.js';
import styles from './Tab.module.css';

export interface TabProps extends TabSpec, Omit<ComponentPropsWithRef<'button'>, keyof TabSpec> {}

/** One tab in Tabs. Tabs sets its role, selection and keyboard behaviour. */
export function Tab({ value = '', disabled, className, onClick, ...rest }: TabProps) {
  const tabs = useContext(TabsContext);
  const selected = tabs?.value === value;
  return (
    <button
      type="button"
      className={cx(styles.root, className)}
      id={tabs?.tabId(value)}
      role="tab"
      aria-selected={selected}
      aria-disabled={disabled ? 'true' : 'false'}
      aria-controls={tabs?.panelId(value)}
      tabIndex={selected ? 0 : -1}
      onClick={(e) => {
        onClick?.(e);
        if (!disabled) tabs?.select(value);
      }}
      {...rest}
    />
  );
}
