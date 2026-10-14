import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { BreadcrumbsDefaults, type BreadcrumbsSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';

export interface BreadcrumbsProps extends BreadcrumbsSpec, ViewProps {
  /** BreadcrumbItem elements. */
  children?: ReactNode;
}

/** Where the current screen sits in the hierarchy: a labelled navigation list of BreadcrumbItems. */
export function Breadcrumbs({ label = BreadcrumbsDefaults.label, style, children, ...rest }: BreadcrumbsProps) {
  const { c } = useTokens();
  // React Native has no :first-of-type: the first item is told to leave out its separator.
  const items = Children.toArray(children).map((child, i) =>
    isValidElement(child) ? cloneElement(child as ReactElement<{ first?: boolean }>, { first: i === 0 }) : child,
  );
  return (
    <View role="navigation" aria-label={label} style={style} {...rest}>
      <View role="list" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: c.breadcrumbs.gap }}>
        {items}
      </View>
    </View>
  );
}
