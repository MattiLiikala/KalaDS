import { useContext, type ComponentPropsWithRef } from 'react';
import type { ListSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { NestedListContext } from './context.js';
import styles from './List.module.css';

export interface ListProps extends ListSpec, Omit<ComponentPropsWithRef<'ul'>, keyof ListSpec> {}

/** Vertical list of ListItems. A List in a ListItem's `nested` prop is indented. */
export function List({ label, dense, className, ...rest }: ListProps) {
  const nested = useContext(NestedListContext);
  return (
    <NestedListContext.Provider value={false}>
      <ul
        className={cx(styles.root, className)}
        // Safari drops list semantics from `list-style: none` lists without an explicit role.
        role="list"
        aria-label={label || undefined}
        data-dense={flag(dense)}
        data-nested={flag(nested)}
        {...rest}
      />
    </NestedListContext.Provider>
  );
}
