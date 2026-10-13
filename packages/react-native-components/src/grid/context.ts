import { createContext } from 'react';

export interface GridContextValue {
  columns: number;
  columnWidth: number;
  gap: number;
}

export const GridContext = createContext<GridContextValue | null>(null);

/** Width of a cell spanning `span` columns, gaps between them included. */
export function spanWidth(grid: GridContextValue, span: number): number {
  const n = Math.min(Math.max(1, Math.round(span)), grid.columns);
  return n * grid.columnWidth + (n - 1) * grid.gap;
}
