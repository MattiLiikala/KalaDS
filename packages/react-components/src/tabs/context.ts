import { createContext } from 'react';

export interface TabsContextValue {
  value: string;
  tabId: (value: string) => string;
  panelId: (value: string) => string;
  select: (value: string, focus?: boolean) => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);
