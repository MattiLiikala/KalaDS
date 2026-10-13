import { createContext } from 'react';

/** True inside a ListItem's `nested` content: a List there is indented. */
export const NestedListContext = createContext(false);
