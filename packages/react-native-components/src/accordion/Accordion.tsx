import { useMemo, useState } from 'react';
import { View, type ViewProps } from 'react-native';
import type { AccordionSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { AccordionContext } from './context.js';

export interface AccordionProps extends AccordionSpec, ViewProps {}

/** Stack of collapsible AccordionItems. Only one section is open at a time unless `multiple` is set. */
export function Accordion({ multiple = false, style, ...rest }: AccordionProps) {
  const { c } = useTokens();
  const [lastOpened, setLastOpened] = useState<string | null>(null);
  const context = useMemo(() => ({ multiple, lastOpened, opened: setLastOpened }), [multiple, lastOpened]);
  return (
    <AccordionContext.Provider value={context}>
      <View style={[{ gap: c.accordion.gap }, style]} {...rest} />
    </AccordionContext.Provider>
  );
}
