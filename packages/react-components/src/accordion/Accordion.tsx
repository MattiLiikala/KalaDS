import { useMemo, useState, type ComponentPropsWithRef } from 'react';
import type { AccordionSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { AccordionContext } from './context.js';
import styles from './Accordion.module.css';

export interface AccordionProps extends AccordionSpec, Omit<ComponentPropsWithRef<'div'>, keyof AccordionSpec> {}

/** Stack of collapsible AccordionItems. Only one section is open at a time unless `multiple` is set. */
export function Accordion({ multiple = false, className, ...rest }: AccordionProps) {
  const [lastOpened, setLastOpened] = useState<string | null>(null);
  const context = useMemo(() => ({ multiple, lastOpened, opened: setLastOpened }), [multiple, lastOpened]);
  return (
    <AccordionContext.Provider value={context}>
      <div className={cx(styles.root, className)} {...rest} />
    </AccordionContext.Provider>
  );
}
