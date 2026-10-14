import { useContext, type ReactNode } from 'react';
import { Text, View, type ViewProps } from 'react-native';
import type { TabPanelSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { isText } from '../internal/children.js';
import { TabsContext } from '../tabs/context.js';

export interface TabPanelProps extends TabPanelSpec, ViewProps {
  children?: ReactNode;
}

/** Content shown when the Tab with the same `value` is selected. */
export function TabPanel({ value = '', style, children, ...rest }: TabPanelProps) {
  const { c } = useTokens();
  const tabs = useContext(TabsContext);
  if (tabs && tabs.value !== value) return null;
  return (
    <View role="tabpanel" style={[{ paddingVertical: c.tabPanel.paddingY }, style]} {...rest}>
      {isText(children) ? <Text style={[typeStyle('body'), { color: c.tabPanel.text }]}>{children}</Text> : children}
    </View>
  );
}
