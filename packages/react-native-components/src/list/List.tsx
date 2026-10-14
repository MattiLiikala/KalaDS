import { useContext } from 'react';
import { View, type ViewProps } from 'react-native';
import type { ListSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { ListContext, NestedListContext } from './context.js';

export interface ListProps extends ListSpec, ViewProps {}

/** Vertical list of ListItems. A List in a ListItem's `nested` prop is indented. */
export function List({ label, dense = false, style, children, ...rest }: ListProps) {
  const { c } = useTokens();
  const nested = useContext(NestedListContext);
  return (
    <ListContext.Provider value={{ dense }}>
      <NestedListContext.Provider value={false}>
        <View
          role="list"
          aria-label={label || undefined}
          style={[{ gap: c.list.gap }, nested ? { paddingLeft: c.list.nestedIndent } : { paddingVertical: c.list.paddingY }, style]}
          {...rest}
        >
          {children}
        </View>
      </NestedListContext.Provider>
    </ListContext.Provider>
  );
}
