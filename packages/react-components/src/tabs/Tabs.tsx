import {
  Children,
  isValidElement,
  useId,
  useMemo,
  useRef,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactElement,
} from 'react';
import type { TabsSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { useControllable } from '../internal/controllable.js';
import { Tab, type TabProps } from '../tab/Tab.js';
import { TabsContext } from './context.js';
import styles from './Tabs.module.css';

export interface TabsProps extends TabsSpec, Omit<ComponentPropsWithRef<'div'>, keyof TabsSpec | 'onChange' | 'defaultValue'> {
  defaultValue?: string;
  /** When the user selects a tab (the web component's `kds-change`). */
  onChange?: (value: string) => void;
}

const safe = (value: string) => value.replace(/[^\w-]/g, '_');

/**
 * Switches between related panels of content (WAI-ARIA tabs). Children are Tab and TabPanel elements,
 * matched by `value`; the tabs are gathered into the tab list. The tab list is one Tab stop; arrow keys,
 * Home and End move between tabs and select them (automatic activation).
 */
export function Tabs({ value, defaultValue, label, onChange, className, children, ...rest }: TabsProps) {
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const tabs = items.filter((c): c is ReactElement<TabProps> => isValidElement(c) && c.type === Tab);
  const others = items.filter((c) => !(isValidElement(c) && c.type === Tab));
  const enabled = tabs.filter((t) => !t.props.disabled).map((t) => t.props.value ?? '');

  const [current, setCurrent] = useControllable<string | undefined>(value, defaultValue);
  // Defaults to the first enabled tab, as kds-tabs does.
  const selected = current && enabled.includes(current) ? current : (enabled[0] ?? '');

  const context = useMemo(
    () => ({
      value: selected,
      tabId: (v: string) => `${base}-tab-${safe(v)}`,
      panelId: (v: string) => `${base}-panel-${safe(v)}`,
      select: (next: string, focus = false) => {
        if (focus) document.getElementById(`${base}-tab-${safe(next)}`)?.focus();
        if (next === selected) return;
        setCurrent(next);
        onChange?.(next);
      },
    }),
    [base, selected, setCurrent, onChange],
  );

  const onKeyDown = (e: KeyboardEvent) => {
    const index = enabled.findIndex((v) => context.tabId(v) === (document.activeElement as HTMLElement | null)?.id);
    if (index < 0) return;
    let next: number | undefined;
    if (e.key === 'ArrowRight') next = (index + 1) % enabled.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = enabled.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    context.select(enabled[next], true);
  };

  return (
    <TabsContext.Provider value={context}>
      <div className={cx(styles.root, className)} {...rest}>
        <div ref={listRef} className={styles.tablist} role="tablist" aria-label={label || undefined} onKeyDown={onKeyDown}>
          {tabs}
        </div>
        {others}
      </div>
    </TabsContext.Provider>
  );
}
