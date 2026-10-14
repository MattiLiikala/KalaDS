import { Children, isValidElement, useMemo, type ReactElement, type ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import type { TabsSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { useControllable } from '../internal/controllable.js';
import { Tab, type TabProps } from '../tab/Tab.js';
import { TabsContext } from './context.js';

export interface TabsProps extends TabsSpec {
  defaultValue?: string;
  /** When the user selects a tab (the web component's `kds-change`). */
  onChange?: (value: string) => void;
  /** Tab and TabPanel elements, matched by `value`. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Switches between related panels of content. Children are Tab and TabPanel elements, matched by
 * `value`; the tabs are gathered into a horizontally scrolling tab list. Defaults to the first enabled tab.
 */
export function Tabs({ value, defaultValue, label, onChange, children, style }: TabsProps) {
  const { c, s } = useTokens();
  const items = Children.toArray(children);
  const tabs = items.filter((c): c is ReactElement<TabProps> => isValidElement(c) && c.type === Tab);
  const others = items.filter((c) => !(isValidElement(c) && c.type === Tab));
  const enabled = tabs.filter((t) => !t.props.disabled).map((t) => t.props.value ?? '');
  const [current, setCurrent] = useControllable<string | undefined>(value, defaultValue);
  const selected = current && enabled.includes(current) ? current : (enabled[0] ?? '');
  const context = useMemo(
    () => ({
      value: selected,
      select: (next: string) => {
        if (next === selected) return;
        setCurrent(next);
        onChange?.(next);
      },
    }),
    [selected, setCurrent, onChange],
  );
  return (
    <TabsContext.Provider value={context}>
      <View style={style}>
        <View style={{ borderBottomWidth: c.tabs.borderWidth, borderBottomColor: c.tabs.border }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            role="tablist"
            aria-label={label || undefined}
            // Room for the focus ring, which sits outside the tabs.
            contentContainerStyle={{ gap: c.tabs.gap, paddingHorizontal: s.borderWidth.ringOffset, paddingTop: s.borderWidth.ring + s.borderWidth.ringOffset }}
          >
            {tabs}
          </ScrollView>
        </View>
        {others}
      </View>
    </TabsContext.Provider>
  );
}
