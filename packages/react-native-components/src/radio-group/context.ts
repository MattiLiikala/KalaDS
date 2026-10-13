import { createContext } from 'react';

export interface RadioGroupContextValue {
  value: string;
  disabled: boolean;
  select: (value: string) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
