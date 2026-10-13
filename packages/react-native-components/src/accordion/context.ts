import { createContext } from 'react';

export interface AccordionContextValue {
  multiple: boolean;
  /** The item opened most recently. With `multiple` off, every other item closes. */
  lastOpened: string | null;
  opened: (id: string) => void;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);
