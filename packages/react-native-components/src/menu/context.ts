import { createContext } from 'react';

/** Set by Menu for its items: picking one reports its value and closes the menu. */
export const MenuContext = createContext<{ pick: (value: string) => void } | null>(null);
