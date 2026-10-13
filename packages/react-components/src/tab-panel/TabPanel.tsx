import { useContext, type ComponentPropsWithRef } from 'react';
import type { TabPanelSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { TabsContext } from '../tabs/context.js';
import styles from './TabPanel.module.css';

export interface TabPanelProps extends TabPanelSpec, Omit<ComponentPropsWithRef<'div'>, keyof TabPanelSpec> {}

/** Content shown when the Tab with the same `value` is selected. Tabs sets its role and labelling. */
export function TabPanel({ value = '', className, ...rest }: TabPanelProps) {
  const tabs = useContext(TabsContext);
  return (
    <div
      className={cx(styles.root, className)}
      id={tabs?.panelId(value)}
      role="tabpanel"
      aria-labelledby={tabs?.tabId(value)}
      hidden={tabs ? tabs.value !== value : false}
      tabIndex={0}
      {...rest}
    />
  );
}
