import { createContext } from 'react';

export interface TabsContextValue {
  value: string;
  select: (value: string) => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);
