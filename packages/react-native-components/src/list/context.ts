import { createContext } from 'react';

/** Set by List for its items: whether it's dense (tighter rows). */
export const ListContext = createContext<{ dense: boolean }>({ dense: false });
/** True inside a ListItem's `nested` content: a List there is indented. */
export const NestedListContext = createContext(false);
