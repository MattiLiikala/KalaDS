import { Children, isValidElement, useState, type ReactNode } from 'react';
import { View, type FlexAlignType, type LayoutChangeEvent, type ViewProps } from 'react-native';
import type { GridSpec } from '@kalads/spec';
import { c, s, space } from '../internal/theme.js';
import { GridItem } from '../grid-item/GridItem.js';
import { GridContext, spanWidth } from './context.js';

export interface GridProps extends GridSpec, ViewProps {}

const ALIGN: Record<NonNullable<GridSpec['align']>, FlexAlignType> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

/**
 * Grid with a fixed number of columns (1–12), or as many columns as fit when `min` is set, each at least
 * that wide. React Native has no CSS grid: the grid measures its width and lays out wrapped cells with
 * the same maths. Use GridItem to span several columns.
 */
export function Grid({ columns = 1, min, gap, rowGap, align, style, children, onLayout, ...rest }: GridProps) {
  const [width, setWidth] = useState(0);
  const columnGap = space(gap) ?? c.grid.gap;
  const verticalGap = space(rowGap) ?? columnGap;
  const minWidth = min ? s.size[min] : undefined;
  // auto-fill: as many columns of at least `min` as fit (never wider than the grid).
  const count = minWidth
    ? Math.max(1, Math.floor((width + columnGap) / (Math.min(minWidth, width || minWidth) + columnGap)))
    : Math.min(12, Math.max(1, Math.round(columns)));
  const columnWidth = width ? (width - columnGap * (count - 1)) / count : 0;
  const grid = { columns: count, columnWidth, gap: columnGap };

  return (
    <View
      style={[{ flexDirection: 'row', flexWrap: 'wrap', columnGap, rowGap: verticalGap, alignItems: align ? ALIGN[align] : 'stretch' }, style]}
      onLayout={(e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width);
        onLayout?.(e);
      }}
      {...rest}
    >
      <GridContext.Provider value={grid}>
        {width > 0 &&
          Children.toArray(children).map((child: ReactNode, i) =>
            isValidElement(child) && child.type === GridItem ? (
              child
            ) : (
              <View key={i} style={{ width: spanWidth(grid, 1) }}>
                {child}
              </View>
            ),
          )}
      </GridContext.Provider>
    </View>
  );
}
