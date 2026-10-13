import { useContext } from 'react';
import { View, type ViewProps } from 'react-native';
import type { GridItemSpec } from '@kalads/spec';
import { GridContext, spanWidth } from '../grid/context.js';

export interface GridItemProps extends Omit<GridItemSpec, 'rowSpan'>, ViewProps {}

/**
 * Cell in a Grid that spans several columns, or the full row. (Row spans need CSS grid and aren't
 * available in React Native.)
 */
export function GridItem({ span = 1, full, style, ...rest }: GridItemProps) {
  const grid = useContext(GridContext);
  const width = grid ? spanWidth(grid, full ? grid.columns : span) : undefined;
  return <View style={[{ width, minWidth: 0 }, style]} {...rest} />;
}
